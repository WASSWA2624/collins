import { prisma } from '../../config/prisma.js';
import { assertAdmissionAccess, assertFacilityRole, resolveFacilityScope, REVIEW_ROLES, WRITE_ROLES } from '../../utils/authorization.js';
import { conflict, notFound, reviewerRequired } from '../../utils/errors.js';
import { writeAudit } from '../../utils/audit.js';
import { resolveIdempotency, storeIdempotencyResult } from '../../utils/idempotency.js';
import { stripUndefined } from '../../utils/object.js';
import { calculateReferenceWeight } from '../../clinical/calculations.js';
import { calculateHumidificationFlags, calculateVentilationSummary, interpretAbg } from '../../clinical/flags.js';

const toJson = (value) => JSON.parse(JSON.stringify(value));

const latestOnly = { orderBy: { measuredAt: 'desc' }, take: 1 };

const admissionInclude = {
  patient: true,
  facility: {
    select: {
      id: true,
      name: true,
      registryCode: true,
      district: true,
      region: true,
      verificationStatus: true,
      abgAvailability: true,
    },
  },
  clinicalSnapshots: latestOnly,
  abgTests: { orderBy: { collectedAt: 'desc' }, take: 1 },
  ventilatorSettings: latestOnly,
  airwayDevices: latestOnly,
  humidificationDecisions: latestOnly,
  dailyReviews: { orderBy: { reviewDate: 'desc' }, take: 1 },
  outcomes: { orderBy: { createdAt: 'desc' }, take: 1 },
};

const fullAdmissionInclude = {
  ...admissionInclude,
  clinicalSnapshots: { orderBy: { measuredAt: 'desc' } },
  abgTests: { orderBy: { version: 'desc' } },
  ventilatorSettings: { orderBy: { version: 'desc' } },
  airwayDevices: { orderBy: { measuredAt: 'desc' } },
  humidificationDecisions: { orderBy: { measuredAt: 'desc' } },
  dailyReviews: { orderBy: { reviewDate: 'desc' } },
  outcomes: { orderBy: { createdAt: 'desc' } },
};

const createPatientCode = () => `COL-P-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const createAdmissionCode = () => `COL-A-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const withoutIdempotency = (data = {}) => {
  const { idempotencyKey, ...rest } = data;
  return stripUndefined(rest);
};

const preparePatientData = (patient) => {
  const reference = calculateReferenceWeight(patient);
  return stripUndefined({
    ...patient,
    appPatientCode: patient.appPatientCode || createPatientCode(),
    referenceWeightKg: reference.value ?? patient.referenceWeightKg,
    referenceWeightMethod: reference.method ?? patient.referenceWeightMethod,
  });
};

const getAdmissionForSummary = (admission) => ({
  patient: admission.patient,
  latestSnapshot: admission.clinicalSnapshots?.[0] || null,
  latestAbg: admission.abgTests?.[0] || null,
  latestVentilator: admission.ventilatorSettings?.[0] || null,
  latestAirway: admission.airwayDevices?.[0] || null,
  latestHumidification: admission.humidificationDecisions?.[0] || null,
});

export const buildClinicalSummary = (admission) => {
  const { patient, latestSnapshot, latestAbg, latestVentilator, latestHumidification } = getAdmissionForSummary(admission);
  const ventilationSummary = calculateVentilationSummary({
    patient,
    ventilator: latestVentilator || {},
    latestAbg,
    latestSnapshot,
  });
  const abgSummary = latestAbg ? interpretAbg(latestAbg, patient) : null;
  const humidificationFlags = latestHumidification ? calculateHumidificationFlags(latestHumidification) : [];

  return {
    ...ventilationSummary,
    abg: abgSummary,
    humidificationFlags,
    missingData: buildMissingData(admission),
  };
};

const buildMissingData = (admission) => {
  const missing = [];
  const { patient, latestSnapshot, latestAbg, latestVentilator } = getAdmissionForSummary(admission);
  if (!patient?.patientPathway || ['UNKNOWN', 'OTHER'].includes(patient.patientPathway)) missing.push('patientPathway');
  if (!patient?.actualWeightKg && !patient?.referenceWeightKg) missing.push('actualWeightKg/referenceWeightKg');
  if (!latestSnapshot?.spo2) missing.push('SpO2');
  if (!latestSnapshot?.fio2 && !latestAbg?.fio2AtSample && !latestVentilator?.fio2) missing.push('FiO2');
  if (!latestAbg?.pao2) missing.push('PaO2');
  if (!latestVentilator?.tidalVolumeMl) missing.push('tidalVolumeMl');
  if (!latestVentilator?.peep) missing.push('PEEP');
  return missing;
};

const assertNoReviewedOverwrite = async (tx, admissionId, userId) => {
  const admission = await tx.admission.findUnique({
    where: { id: admissionId },
    select: { id: true, facilityId: true, reviewStatus: true },
  });
  if (!admission) throw notFound('Admission not found');

  if (admission.reviewStatus === 'APPROVED') {
    try {
      await assertFacilityRole(userId, admission.facilityId, REVIEW_ROLES);
    } catch (_error) {
      throw reviewerRequired('Reviewed clinical data cannot be overwritten; submit a new append-only record or request reviewer correction.');
    }
  }
  return admission;
};

export const listAdmissions = async (userId, { facilityId, status, reviewStatus, patientPathway, page, limit }) => {
  const scopedFacilityId = await resolveFacilityScope(userId, facilityId);
  const where = {
    ...(scopedFacilityId ? { facilityId: scopedFacilityId } : {}),
    ...(status ? { status } : {}),
    ...(reviewStatus ? { reviewStatus } : {}),
    ...(patientPathway ? { patient: { patientPathway } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.admission.findMany({
      where,
      include: admissionInclude,
      orderBy: { admittedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.admission.count({ where }),
  ]);

  return {
    items: items.map((admission) => ({
      ...admission,
      clinicalSummary: buildClinicalSummary(admission),
    })),
    total,
    page,
    limit,
  };
};

export const createAdmission = async (payload, createdByUserId, auditContext = {}) => {
  await assertFacilityRole(createdByUserId, payload.facilityId, WRITE_ROLES);

  return prisma.$transaction(async (tx) => {
    const idem = await resolveIdempotency({
      tx,
      userId: createdByUserId,
      facilityId: payload.facilityId,
      key: payload.idempotencyKey,
      operation: 'admission.create',
      payload,
    });
    if (!idem.shouldRun) return { ...idem.responseJson, syncStatus: 'duplicate' };

    const patientData = preparePatientData(payload.patient);
    const createdPatient = await tx.patient.create({
      data: { ...patientData, facilityId: payload.facilityId },
    });

    const admission = await tx.admission.create({
      data: stripUndefined({
        patientId: createdPatient.id,
        facilityId: payload.facilityId,
        appAdmissionCode: payload.appAdmissionCode || createAdmissionCode(),
        bedNumber: payload.bedNumber,
        admittedAt: payload.admittedAt,
        admissionSource: payload.admissionSource,
        reasonForVentilation: payload.reasonForVentilation,
        createdByUserId,
        clientRecordId: payload.clientRecordId,
        deviceId: payload.deviceId,
        clientCreatedAt: payload.clientCreatedAt,
        clientUpdatedAt: payload.clientUpdatedAt,
      }),
    });

    if (payload.clinicalSnapshot) {
      await tx.clinicalSnapshot.create({
        data: stripUndefined({
          admissionId: admission.id,
          ...withoutIdempotency(payload.clinicalSnapshot),
          enteredByUserId: createdByUserId,
          validationStatus: 'valid_or_missing',
        }),
      });
    }

    if (payload.abgTest) {
      const abgInterpretation = interpretAbg(payload.abgTest, createdPatient);
      await tx.abgTest.create({
        data: stripUndefined({
          admissionId: admission.id,
          version: 1,
          ...withoutIdempotency(payload.abgTest),
          enteredByUserId: createdByUserId,
          validationStatus: abgInterpretation.flags.some((flag) => flag.code === 'IMPOSSIBLE_VALUE') ? 'impossible' : 'valid_or_suspicious',
          clinicalFlagsJson: abgInterpretation.flags,
          calculationSummaryJson: { pfRatio: abgInterpretation.pfRatio, sfRatio: abgInterpretation.sfRatio },
        }),
      });
    }

    if (payload.ventilatorSetting) {
      const latestAbg = payload.abgTest || null;
      const latestSnapshot = payload.clinicalSnapshot || null;
      const summary = calculateVentilationSummary({
        patient: createdPatient,
        ventilator: payload.ventilatorSetting,
        latestAbg,
        latestSnapshot,
      });
      await tx.ventilatorSetting.create({
        data: stripUndefined({
          admissionId: admission.id,
          version: 1,
          ...withoutIdempotency(payload.ventilatorSetting),
          minuteVolumeLMin: summary.minuteVentilation.value,
          vtMlPerKgReferenceWeight: summary.vtPerKg.value,
          drivingPressure: summary.drivingPressure.value,
          enteredByUserId: createdByUserId,
          validationStatus: summary.flags.some((flag) => flag.code === 'IMPOSSIBLE_VALUE') ? 'impossible' : 'valid_or_suspicious',
          clinicalFlagsJson: summary.flags,
          calculationSummaryJson: summary,
        }),
      });
    }

    if (payload.airwayDevice) {
      await tx.airwayDevice.create({
        data: stripUndefined({
          admissionId: admission.id,
          ...withoutIdempotency(payload.airwayDevice),
          enteredByUserId: createdByUserId,
          validationStatus: 'valid_or_missing',
        }),
      });
    }

    if (payload.humidification) {
      const humidificationFlags = calculateHumidificationFlags(payload.humidification);
      await tx.humidificationDecision.create({
        data: stripUndefined({
          admissionId: admission.id,
          ...withoutIdempotency(payload.humidification),
          confirmedByUserId: createdByUserId,
          clinicalFlagsJson: humidificationFlags,
        }),
      });
    }

    const created = await tx.admission.findUnique({ where: { id: admission.id }, include: admissionInclude });
    const responseJson = toJson({ admission: created, clinicalSummary: buildClinicalSummary(created), syncStatus: 'synced' });

    await storeIdempotencyResult({
      tx,
      userId: createdByUserId,
      facilityId: payload.facilityId,
      key: payload.idempotencyKey,
      operation: 'admission.create',
      requestHash: idem.requestHash,
      responseJson,
      entityType: 'Admission',
      entityId: admission.id,
      clientRecordId: payload.clientRecordId,
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId: createdByUserId,
      facilityId: payload.facilityId,
      action: 'ADMISSION_CREATE',
      entityType: 'Admission',
      entityId: admission.id,
      afterJson: responseJson,
    });

    return responseJson;
  });
};

export const getAdmissionById = async (userId, id) => {
  const admissionAccess = await assertAdmissionAccess(userId, id);
  const admission = await prisma.admission.findUnique({ where: { id }, include: fullAdmissionInclude });
  if (!admission) throw notFound('Admission not found');
  if (admission.facilityId !== admissionAccess.facilityId) throw notFound('Admission not found');
  return { ...admission, clinicalSummary: buildClinicalSummary(admission) };
};

export const updateAdmission = async (userId, id, data, auditContext = {}) => {
  const admission = await assertAdmissionAccess(userId, id, WRITE_ROLES);
  await assertNoReviewedOverwrite(prisma, id, userId);

  return prisma.$transaction(async (tx) => {
    const before = await tx.admission.findUnique({ where: { id }, include: admissionInclude });
    const updated = await tx.admission.update({
      where: { id },
      data: stripUndefined({
        bedNumber: data.bedNumber,
        admissionSource: data.admissionSource,
        reasonForVentilation: data.reasonForVentilation,
        status: data.status,
        clientUpdatedAt: data.clientUpdatedAt,
      }),
      include: admissionInclude,
    });

    const responseJson = toJson({ admission: updated, clinicalSummary: buildClinicalSummary(updated) });
    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: admission.facilityId,
      action: 'ADMISSION_UPDATE',
      entityType: 'Admission',
      entityId: id,
      beforeJson: before,
      afterJson: responseJson,
    });
    return responseJson;
  });
};

const createAppendOnlyRecord = async ({
  userId,
  admissionId,
  payload,
  operation,
  entityType,
  createRecord,
  auditAction,
  auditContext,
}) => {
  const admission = await assertAdmissionAccess(userId, admissionId, WRITE_ROLES);

  return prisma.$transaction(async (tx) => {
    const idem = await resolveIdempotency({
      tx,
      userId,
      facilityId: admission.facilityId,
      key: payload.idempotencyKey,
      operation,
      payload: { admissionId, ...payload },
    });
    if (!idem.shouldRun) return { ...idem.responseJson, syncStatus: 'duplicate' };

    await assertNoReviewedOverwrite(tx, admissionId, userId);
    const record = await createRecord(tx, admission);
    const refreshed = await tx.admission.findUnique({ where: { id: admissionId }, include: admissionInclude });
    const responseJson = toJson({
      [entityType[0].toLowerCase() + entityType.slice(1)]: record,
      clinicalSummary: buildClinicalSummary(refreshed),
      syncStatus: 'synced',
    });

    await storeIdempotencyResult({
      tx,
      userId,
      facilityId: admission.facilityId,
      key: payload.idempotencyKey,
      operation,
      requestHash: idem.requestHash,
      responseJson,
      entityType,
      entityId: record.id,
      clientRecordId: payload.clientRecordId,
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: admission.facilityId,
      action: auditAction,
      entityType,
      entityId: record.id,
      afterJson: responseJson,
    });
    return responseJson;
  });
};

export const addClinicalSnapshot = (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'clinicalSnapshot.create',
  entityType: 'ClinicalSnapshot',
  auditAction: 'CLINICAL_SNAPSHOT_CREATE',
  auditContext,
  createRecord: (tx) => tx.clinicalSnapshot.create({
    data: stripUndefined({
      admissionId,
      ...withoutIdempotency(payload),
      enteredByUserId: userId,
      validationStatus: 'valid_or_missing',
    }),
  }),
});

export const addAbgTest = (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'abgTest.create',
  entityType: 'AbgTest',
  auditAction: 'ABG_TEST_CREATE_VERSION',
  auditContext,
  createRecord: async (tx) => {
    const admission = await tx.admission.findUnique({ where: { id: admissionId }, include: { patient: true } });
    const latest = await tx.abgTest.findFirst({
      where: { admissionId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    const abgInterpretation = interpretAbg(payload, admission.patient);
    return tx.abgTest.create({
      data: stripUndefined({
        admissionId,
        ...withoutIdempotency(payload),
        version: (latest?.version || 0) + 1,
        enteredByUserId: userId,
        validationStatus: abgInterpretation.flags.some((flag) => flag.code === 'IMPOSSIBLE_VALUE') ? 'impossible' : 'valid_or_suspicious',
        clinicalFlagsJson: abgInterpretation.flags,
        calculationSummaryJson: { pfRatio: abgInterpretation.pfRatio, sfRatio: abgInterpretation.sfRatio },
      }),
    });
  },
});

export const addVentilatorSetting = (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'ventilatorSetting.create',
  entityType: 'VentilatorSetting',
  auditAction: 'VENTILATOR_SETTING_CREATE_VERSION',
  auditContext,
  createRecord: async (tx) => {
    const admission = await tx.admission.findUnique({
      where: { id: admissionId },
      include: {
        patient: true,
        abgTests: { orderBy: { collectedAt: 'desc' }, take: 1 },
        clinicalSnapshots: latestOnly,
      },
    });
    const latest = await tx.ventilatorSetting.findFirst({
      where: { admissionId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    const summary = calculateVentilationSummary({
      patient: admission.patient,
      ventilator: payload,
      latestAbg: admission.abgTests[0] || null,
      latestSnapshot: admission.clinicalSnapshots[0] || null,
    });
    return tx.ventilatorSetting.create({
      data: stripUndefined({
        admissionId,
        ...withoutIdempotency(payload),
        version: (latest?.version || 0) + 1,
        minuteVolumeLMin: summary.minuteVentilation.value,
        vtMlPerKgReferenceWeight: summary.vtPerKg.value,
        drivingPressure: summary.drivingPressure.value,
        enteredByUserId: userId,
        validationStatus: summary.flags.some((flag) => flag.code === 'IMPOSSIBLE_VALUE') ? 'impossible' : 'valid_or_suspicious',
        clinicalFlagsJson: summary.flags,
        calculationSummaryJson: summary,
      }),
    });
  },
});

export const addAirwayDevice = (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'airwayDevice.create',
  entityType: 'AirwayDevice',
  auditAction: 'AIRWAY_DEVICE_CREATE',
  auditContext,
  createRecord: (tx) => tx.airwayDevice.create({
    data: stripUndefined({
      admissionId,
      ...withoutIdempotency(payload),
      enteredByUserId: userId,
      validationStatus: 'valid_or_missing',
    }),
  }),
});

export const addHumidification = (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'humidification.create',
  entityType: 'HumidificationDecision',
  auditAction: 'HUMIDIFICATION_CREATE',
  auditContext,
  createRecord: (tx) => tx.humidificationDecision.create({
    data: stripUndefined({
      admissionId,
      ...withoutIdempotency(payload),
      confirmedByUserId: userId,
      clinicalFlagsJson: calculateHumidificationFlags(payload),
    }),
  }),
});

export const addDailyReview = (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'dailyReview.create',
  entityType: 'DailyVentilationReview',
  auditAction: 'DAILY_REVIEW_CREATE',
  auditContext,
  createRecord: (tx) => tx.dailyVentilationReview.create({
    data: stripUndefined({
      admissionId,
      ...withoutIdempotency(payload),
      reviewedByUserId: userId,
      clinicalFlagsJson: {
        readinessPrompt: 'Daily liberation/readiness checklist saved. Clinician confirms readiness and final plan.',
      },
    }),
  }),
});

export const addOutcome = async (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'outcome.create',
  entityType: 'Outcome',
  auditAction: 'OUTCOME_CREATE',
  auditContext,
  createRecord: async (tx) => {
    const outcome = await tx.outcome.create({
      data: stripUndefined({
        admissionId,
        ...withoutIdempotency(payload),
        enteredByUserId: userId,
      }),
    });

    const statusMap = {
      TRANSFERRED: 'TRANSFERRED',
      DISCHARGED: 'DISCHARGED',
      DECEASED: 'DECEASED',
      STILL_ADMITTED: 'ACTIVE',
    };
    if (statusMap[payload.outcomeType]) {
      await tx.admission.update({ where: { id: admissionId }, data: { status: statusMap[payload.outcomeType] } });
    }
    return outcome;
  },
});

export const assertNoConflictForSync = async ({ admissionId, clientUpdatedAt }) => {
  if (!admissionId || !clientUpdatedAt) return null;
  const admission = await prisma.admission.findUnique({
    where: { id: admissionId },
    select: { id: true, updatedAt: true, reviewStatus: true },
  });
  if (!admission) throw notFound('Admission not found');
  if (admission.reviewStatus === 'APPROVED') {
    throw conflict('Reviewed admission requires reviewer resolution before sync overwrite', [], {
      status: 'conflict',
      serverUpdatedAt: admission.updatedAt,
      clientUpdatedAt,
    });
  }
  if (new Date(clientUpdatedAt) < admission.updatedAt) {
    throw conflict('Another update exists. Keep both values for reviewer?', [], {
      status: 'conflict',
      serverUpdatedAt: admission.updatedAt,
      clientUpdatedAt,
    });
  }
  return admission;
};
