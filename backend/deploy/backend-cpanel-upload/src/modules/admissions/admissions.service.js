import { prisma } from '../../config/prisma.js';
import { assertAdmissionAccess, assertFacilityRole, resolveFacilityScope, REVIEW_ROLES, WRITE_ROLES } from '../../utils/authorization.js';
import { conflict, forbidden, notFound, reviewerRequired } from '../../utils/errors.js';
import { writeAudit } from '../../utils/audit.js';
import { resolveIdempotency, storeIdempotencyResult } from '../../utils/idempotency.js';
import { sha256 } from '../../utils/crypto.js';
import { isPlainObject, stripUndefined } from '../../utils/object.js';
import { calculateReferenceWeight } from '../../clinical/calculations.js';
import { calculateHumidificationFlags, calculateVentilationSummary, interpretAbg } from '../../clinical/flags.js';
import { listActiveReferenceRangeRecords } from '../references/references.service.js';

const toJson = (value) => JSON.parse(JSON.stringify(value));

export const latestOnly = { orderBy: { measuredAt: 'desc' }, take: 1 };

export const admissionInclude = {
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

export const fullAdmissionInclude = {
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
const patientReferenceFields = new Set([
  'patientPathway',
  'ageYears',
  'ageMonths',
  'gestationalAgeWeeks',
  'correctedAgeWeeks',
  'sexForSizeCalculations',
  'actualWeightKg',
  'heightOrLengthCm',
  'referenceWeightKg',
  'referenceWeightMethod',
]);
const admissionPatchFields = ['bedNumber', 'admissionSource', 'reasonForVentilation', 'status', 'clientUpdatedAt'];
const THREE_STEP_FLOW_VERSION = 'three-step-admission-flow@2026-05-05';
const THREE_STEP_SOURCE = 'three_step_admission_flow';
const ABG_UPDATE_VALUE_FIELDS = [
  'ph',
  'pao2',
  'paco2',
  'hco3',
  'baseExcess',
  'lactate',
  'fio2AtSample',
  'spo2AtSample',
];
const VENTILATOR_UPDATE_VALUE_FIELDS = [
  'mode',
  'tidalVolumeMl',
  'respiratoryRateSet',
  'respiratoryRateMeasured',
  'fio2',
  'peep',
  'pressureSupport',
  'inspiratoryPressure',
  'peakPressure',
  'plateauPressure',
  'ieRatio',
];

const withoutIdempotency = (data = {}) => {
  const rest = { ...data };
  delete rest.idempotencyKey;
  delete rest.overrideReason;
  return stripUndefined(rest);
};

const getOverrideReason = (payload = {}) => {
  const reason = payload.overrideReason?.trim();
  return reason || null;
};

const resolveAdmissionCreateFacilityId = async (userId, requestedFacilityId) => {
  const facilityId = await resolveFacilityScope(userId, cleanText(requestedFacilityId) || undefined, WRITE_ROLES);
  if (!facilityId) throw forbidden('Facility scope is required to create an admission');
  return facilityId;
};

const hasKeys = (value) => Object.keys(value || {}).length > 0;
const hasClinicalValue = (record, fields) =>
  Boolean(record && fields.some((field) => record[field] !== undefined && record[field] !== null));

const stripNullish = (value) => {
  if (Array.isArray(value)) return value.map(stripNullish).filter((item) => item !== undefined && item !== null);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined && entryValue !== null)
        .map(([key, entryValue]) => [key, stripNullish(entryValue)])
        .filter(([, entryValue]) => entryValue !== undefined && entryValue !== null)
    );
  }
  return value;
};

const cleanText = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
};

const uniqueStringList = (items = []) => [...new Set(
  (Array.isArray(items) ? items : [])
    .map((item) => cleanText(item))
    .filter(Boolean)
)];

const normalizeFieldKey = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

const deriveScopedToken = (base, suffix, maxLength) => {
  const trimmedBase = cleanText(base);
  if (!trimmedBase) return undefined;

  const candidate = `${trimmedBase}:${suffix}`;
  if (candidate.length <= maxLength) return candidate;

  const hash = sha256(candidate).slice(0, 16);
  return `${trimmedBase.slice(0, maxLength - hash.length - 1)}:${hash}`;
};

const deriveStepIdempotencyKey = (base, suffix) => deriveScopedToken(base, suffix, 160);
const deriveStepClientRecordId = (base, suffix) => deriveScopedToken(base, suffix, 120);

const normalizeUncertainty = (uncertainty = null) => {
  if (!isPlainObject(uncertainty)) return null;
  const fields = uniqueStringList(uncertainty.fields);
  const reason = cleanText(uncertainty.reason);
  const notes = cleanText(uncertainty.notes);
  const isUncertain = uncertainty.isUncertain === true || fields.length > 0 || Boolean(reason || notes);

  if (!isUncertain) return null;
  return stripUndefined({
    isUncertain,
    fields,
    reason,
    notes,
  });
};

const normalizeDeviceContext = (payload = {}) => {
  const context = isPlainObject(payload.deviceContext) ? payload.deviceContext : {};
  const normalized = stripUndefined({
    deviceId: cleanText(context.deviceId) || cleanText(payload.deviceId),
    source: cleanText(context.source),
    oxygenSource: cleanText(context.oxygenSource),
    ventilatorType: cleanText(context.ventilatorType),
    facilityDeviceLabel: cleanText(context.facilityDeviceLabel),
  });
  return hasKeys(normalized) ? normalized : null;
};

const mergeAdmissionFlowMetadata = (existingJson, updates = {}) => {
  const base = isPlainObject(existingJson) ? existingJson : {};
  const previousFlow = isPlainObject(base.admissionFlow) ? base.admissionFlow : {};
  return stripNullish({
    ...base,
    admissionFlow: {
      ...previousFlow,
      flowVersion: THREE_STEP_FLOW_VERSION,
      ...updates,
      updatedAt: new Date().toISOString(),
    },
  });
};

const extractAdmissionFlowMetadata = (admission = {}) => {
  const snapshots = admission.clinicalSnapshots || [];
  for (const snapshot of snapshots) {
    const flow = snapshot?.comorbiditiesJson?.admissionFlow;
    if (isPlainObject(flow)) return flow;
  }
  return {};
};

const buildStepWriteMetadata = (record, payload, suffix, { includeSource = false, includeClientUpdatedAt = false } = {}) => {
  const { clientUpdatedAt, source, ...baseRecord } = record || {};
  const deviceContext = normalizeDeviceContext(payload) || {};
  return stripNullish({
    ...baseRecord,
    ...(includeSource ? { source: source || deviceContext.source } : {}),
    clientRecordId: baseRecord.clientRecordId || deriveStepClientRecordId(payload.clientRecordId, suffix),
    clientCreatedAt: baseRecord.clientCreatedAt || payload.clientCreatedAt,
    ...(includeClientUpdatedAt ? { clientUpdatedAt: clientUpdatedAt || payload.clientUpdatedAt } : {}),
    deviceId: baseRecord.deviceId || deviceContext.deviceId || payload.deviceId,
    idempotencyKey: deriveStepIdempotencyKey(payload.idempotencyKey, suffix),
    overrideReason: payload.overrideReason,
  });
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

const preparePatientUpdateData = (currentPatient, patientPatch = {}) => {
  const patientData = stripUndefined(patientPatch);
  if (!hasKeys(patientData)) return null;
  if (patientData.appPatientCode === null) delete patientData.appPatientCode;
  if (!hasKeys(patientData)) return null;

  const shouldRecalculateReference = Object.keys(patientData).some((field) => patientReferenceFields.has(field));
  if (!shouldRecalculateReference) return patientData;

  const reference = calculateReferenceWeight({ ...currentPatient, ...patientData });
  return stripUndefined({
    ...patientData,
    referenceWeightKg: reference.value,
    referenceWeightMethod: reference.method,
  });
};

const pickAdmissionPatchData = (data) => stripUndefined(Object.fromEntries(
  admissionPatchFields.map((field) => [field, data[field]])
));

const getAdmissionForSummary = (admission) => ({
  patient: admission.patient,
  latestSnapshot: admission.clinicalSnapshots?.[0] || null,
  latestAbg: admission.abgTests?.[0] || null,
  latestVentilator: admission.ventilatorSettings?.[0] || null,
  latestAirway: admission.airwayDevices?.[0] || null,
  latestHumidification: admission.humidificationDecisions?.[0] || null,
});

const resolveDecisionSupportReferenceRanges = async (facilityId, { tx = prisma, allowDevelopmentFallback = true } = {}) => (
  listActiveReferenceRangeRecords({
    facilityId,
    client: tx,
    allowDevelopmentFallback,
  })
);

const buildReferenceRangeStatus = (referenceRanges) => {
  if (referenceRanges === undefined) {
    return {
      status: 'development_fallback_unconfirmed',
      verifiedOnly: true,
      pendingBackendConfirmation: true,
      message: 'Development fallback ranges were used; backend reference confirmation is pending.',
    };
  }

  if (!Array.isArray(referenceRanges) || referenceRanges.length === 0) {
    return {
      status: 'missing_verified_records',
      verifiedOnly: true,
      pendingBackendConfirmation: true,
      message: 'No active verified backend reference range records were available for this summary.',
    };
  }

  if (referenceRanges.some((range) => range.source === 'development_fallback_no_reference_repository')) {
    return {
      status: 'development_fallback_unconfirmed',
      verifiedOnly: true,
      pendingBackendConfirmation: true,
      message: 'Development fallback ranges were used because the reference repository was unavailable in this runtime.',
    };
  }

  return {
    status: 'backend_verified',
    verifiedOnly: true,
    pendingBackendConfirmation: false,
    message: 'Calculated with active verified backend reference range records.',
  };
};

export const buildClinicalSummary = (admission, { referenceRanges } = {}) => {
  const { patient, latestSnapshot, latestAbg, latestVentilator, latestHumidification } = getAdmissionForSummary(admission);
  const activeReferenceRanges = Array.isArray(referenceRanges) ? referenceRanges : undefined;
  const ventilationSummary = calculateVentilationSummary({
    patient,
    ventilator: latestVentilator || {},
    latestAbg,
    latestSnapshot,
    ...(activeReferenceRanges ? { referenceRanges: activeReferenceRanges } : {}),
  });
  const abgSummary = latestAbg
    ? interpretAbg(latestAbg, patient, activeReferenceRanges ? { referenceRanges: activeReferenceRanges } : {})
    : null;
  const humidificationFlags = latestHumidification ? calculateHumidificationFlags(latestHumidification) : [];

  return {
    ...ventilationSummary,
    abg: abgSummary,
    humidificationFlags,
    missingData: buildMissingData(admission),
    referenceRangeStatus: buildReferenceRangeStatus(activeReferenceRanges),
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

const isMissingFieldPermitted = (field, permittedFields) => {
  const normalizedField = normalizeFieldKey(field);
  return permittedFields.some((permittedField) => {
    const normalizedPermitted = normalizeFieldKey(permittedField);
    return normalizedField === normalizedPermitted
      || normalizedField.includes(normalizedPermitted)
      || normalizedPermitted.includes(normalizedField);
  });
};

const getClinicalFlags = (clinicalSummary = {}) => [
  ...(clinicalSummary.flags || []),
  ...(clinicalSummary.abg?.flags || []),
  ...(clinicalSummary.humidificationFlags || []),
];

export const buildAdmissionReadiness = (admission) => {
  const clinicalSummary = admission.clinicalSummary || buildClinicalSummary(admission);
  const flowMetadata = extractAdmissionFlowMetadata(admission);
  const permittedMissingFields = uniqueStringList(flowMetadata.permittedMissingFields);
  const uncertainty = normalizeUncertainty(flowMetadata.uncertainty);
  const clinicalFlags = getClinicalFlags(clinicalSummary);

  const missingWarnings = (clinicalSummary.missingData || []).map((field) => {
    const permitted = isMissingFieldPermitted(field, permittedMissingFields);
    return {
      code: permitted ? 'PERMITTED_MISSING_DATA' : 'MISSING_DATA',
      severity: permitted ? 'info' : 'yellow',
      field,
      message: permitted
        ? `${field} is documented as unavailable; review when it becomes available.`
        : `${field} is missing; saving is allowed, but clinician review should confirm the gap.`,
    };
  });

  const uncertaintyWarnings = uncertainty ? [{
    code: 'EXPLICIT_UNCERTAINTY',
    severity: 'yellow',
    fields: uncertainty.fields || [],
    message: 'Uncertain values were documented; clinician review should confirm them.',
    reason: uncertainty.reason,
  }] : [];

  const clinicalWarnings = clinicalFlags.map((flag) => ({
    code: flag.code,
    severity: flag.severity || 'info',
    field: flag.field,
    message: flag.message,
    ruleVersion: flag.ruleVersion,
  }));

  const blockers = clinicalWarnings
    .filter((warning) => warning.code === 'IMPOSSIBLE_VALUE')
    .map((warning) => ({
      ...warning,
      message: 'Impossible values require correction or documented clinician override before save review.',
    }));

  const warnings = [...missingWarnings, ...uncertaintyWarnings, ...clinicalWarnings];

  return {
    flowVersion: THREE_STEP_FLOW_VERSION,
    isReadyToSave: blockers.length === 0,
    needsReview: warnings.some((warning) => ['red', 'yellow'].includes(warning.severity)),
    missingData: clinicalSummary.missingData || [],
    permittedMissingFields,
    uncertainty,
    warnings,
    blockers,
    safetyStatement: clinicalSummary.safetyStatement,
  };
};

const buildThreeStepAdmissionResponse = (step, admission, extra = {}, { referenceRanges } = {}) => {
  const clinicalSummary = admission.clinicalSummary || buildClinicalSummary(admission, { referenceRanges });
  const admissionWithSummary = admission.clinicalSummary ? admission : { ...admission, clinicalSummary };

  return toJson({
    step,
    admission: admissionWithSummary,
    clinicalSummary,
    readiness: buildAdmissionReadiness(admissionWithSummary),
    ...extra,
  });
};

const buildPatientReasonSnapshot = (payload) => {
  const clinicalReason = isPlainObject(payload.clinicalReason) ? payload.clinicalReason : {};
  const comorbiditiesJson = isPlainObject(clinicalReason.comorbiditiesJson) ? clinicalReason.comorbiditiesJson : {};
  const specialConditionsJson = isPlainObject(clinicalReason.specialConditionsJson) ? clinicalReason.specialConditionsJson : undefined;
  const reasonForSupport = cleanText(payload.reasonForVentilation) || cleanText(payload.reasonForSupport);

  return stripNullish({
    measuredAt: payload.admittedAt,
    mainCondition: cleanText(clinicalReason.mainCondition) || reasonForSupport,
    comorbiditiesJson: mergeAdmissionFlowMetadata({
      ...comorbiditiesJson,
      specialConditionsJson,
    }, {
      step: 'patient_reason',
      permittedMissingFields: uniqueStringList(payload.permittedMissingFields),
      reasonForSupport,
    }),
    source: `${THREE_STEP_SOURCE}:patient_reason`,
    clientRecordId: deriveStepClientRecordId(payload.clientRecordId, 'patient-reason'),
    deviceId: payload.deviceId,
    clientCreatedAt: payload.clientCreatedAt,
  });
};

const applyClinicalSnapshotFlowMetadata = (record, admission, payload) => {
  const existingFlow = extractAdmissionFlowMetadata(admission);
  const uncertainty = normalizeUncertainty(payload.uncertainty) || existingFlow.uncertainty || null;
  const deviceContext = normalizeDeviceContext(payload) || existingFlow.deviceContext || null;

  return stripNullish({
    ...record,
    source: record?.source || `${THREE_STEP_SOURCE}:oxygen_abg_ventilator`,
    comorbiditiesJson: mergeAdmissionFlowMetadata(record?.comorbiditiesJson, {
      ...existingFlow,
      step: 'oxygen_abg_ventilator',
      uncertainty,
      deviceContext,
    }),
  });
};

const toValidDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const decisionSupportPrompts = {
  AbgTest: 'Review ABG pattern, oxygenation ratios, and trend before documenting clinician interpretation.',
  VentilatorSetting: 'Review calculated safety values, airway pressure trend, and patient pathway before documenting clinician plan.',
};

const buildDecisionSupport = (entityType, record) => {
  if (!decisionSupportPrompts[entityType]) return {};

  const advisoryChecks = Array.isArray(record?.clinicalFlagsJson) ? record.clinicalFlagsJson : [];
  const reviewPrompts = [decisionSupportPrompts[entityType]];

  if (record?.validationStatus === 'impossible') {
    reviewPrompts.unshift('Correct impossible values or request reviewer override before clinical use.');
  } else if (advisoryChecks.some((flag) => flag.severity === 'red')) {
    reviewPrompts.unshift('Urgent clinician review is needed for red advisory checks.');
  }

  return {
    decisionSupport: {
      advisoryChecks,
      reviewPrompts,
    },
  };
};

const assertNoStaleClientAppend = ({ entityType, admission, payload, latest, timestampField }) => {
  const clientUpdatedAt = toValidDate(payload.clientUpdatedAt);
  const serverCreatedAt = toValidDate(latest?.createdAt);

  if (!clientUpdatedAt || !serverCreatedAt || clientUpdatedAt >= serverCreatedAt) return;

  throw conflict('Stale client timestamp for append-only clinical event', [
    {
      path: 'body.clientUpdatedAt',
      message: 'Refresh the admission timeline before submitting this offline clinical event.',
    },
  ], toJson(stripUndefined({
    status: 'conflict',
    conflictType: 'STALE_CLIENT_TIMESTAMP',
    entityType,
    admissionId: admission.id,
    facilityId: admission.facilityId,
    clientRecordId: payload.clientRecordId,
    clientUpdatedAt,
    serverRecord: stripUndefined({
      id: latest.id,
      version: latest.version,
      createdAt: latest.createdAt,
      [timestampField]: latest[timestampField],
      clientRecordId: latest.clientRecordId,
      clientUpdatedAt: latest.clientUpdatedAt,
    }),
    clientPayload: withoutIdempotency(payload),
  })));
};

const assertNoReviewedOverwrite = async (tx, admissionId, userId, { allowClinicianOverride = false, overrideReason = null } = {}) => {
  const admission = await tx.admission.findUnique({
    where: { id: admissionId },
    select: { id: true, facilityId: true, reviewStatus: true },
  });
  if (!admission) throw notFound('Admission not found');

  if (admission.reviewStatus === 'APPROVED') {
    try {
      await assertFacilityRole(userId, admission.facilityId, REVIEW_ROLES);
    } catch {
      if (allowClinicianOverride && overrideReason) {
        return {
          ...admission,
          overrideApplied: true,
          overrideReason,
        };
      }
      throw reviewerRequired('Reviewed clinical data cannot be overwritten; submit a new append-only record with overrideReason or request reviewer correction.', [], {
        status: 'needs_review',
        overrideRequired: true,
        reasonField: 'overrideReason',
      });
    }
  }
  return {
    ...admission,
    overrideApplied: false,
    overrideReason: null,
  };
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
  const referenceRanges = await resolveDecisionSupportReferenceRanges(scopedFacilityId, { allowDevelopmentFallback: false });

  return {
    items: items.map((admission) => ({
      ...admission,
      clinicalSummary: buildClinicalSummary(admission, { referenceRanges }),
    })),
    total,
    page,
    limit,
  };
};

export const createAdmission = async (payload, createdByUserId, auditContext = {}) => {
  const facilityId = await resolveAdmissionCreateFacilityId(createdByUserId, payload.facilityId);
  const admissionPayload = {
    ...payload,
    facilityId,
  };

  return prisma.$transaction(async (tx) => {
    const idem = await resolveIdempotency({
      tx,
      userId: createdByUserId,
      facilityId,
      key: admissionPayload.idempotencyKey,
      operation: 'admission.create',
      payload: admissionPayload,
    });
    if (!idem.shouldRun) return { ...idem.responseJson, syncStatus: 'duplicate' };

    const patientData = preparePatientData(admissionPayload.patient);
    const createdPatient = await tx.patient.create({
      data: { ...patientData, facilityId },
    });

    const admission = await tx.admission.create({
      data: stripUndefined({
        patientId: createdPatient.id,
        facilityId,
        appAdmissionCode: admissionPayload.appAdmissionCode || createAdmissionCode(),
        bedNumber: admissionPayload.bedNumber,
        admittedAt: admissionPayload.admittedAt,
        admissionSource: admissionPayload.admissionSource,
        reasonForVentilation: admissionPayload.reasonForVentilation,
        createdByUserId,
        clientRecordId: admissionPayload.clientRecordId,
        deviceId: admissionPayload.deviceId,
        clientCreatedAt: admissionPayload.clientCreatedAt,
        clientUpdatedAt: admissionPayload.clientUpdatedAt,
      }),
    });
    const referenceRanges = await resolveDecisionSupportReferenceRanges(facilityId, { tx });

    if (admissionPayload.clinicalSnapshot) {
      await tx.clinicalSnapshot.create({
        data: stripUndefined({
          admissionId: admission.id,
          ...withoutIdempotency(admissionPayload.clinicalSnapshot),
          enteredByUserId: createdByUserId,
          validationStatus: 'valid_or_missing',
        }),
      });
    }

    if (admissionPayload.abgTest) {
      const abgInterpretation = interpretAbg(admissionPayload.abgTest, createdPatient, { referenceRanges });
      await tx.abgTest.create({
        data: stripUndefined({
          admissionId: admission.id,
          version: 1,
          ...withoutIdempotency(admissionPayload.abgTest),
          enteredByUserId: createdByUserId,
          validationStatus: abgInterpretation.flags.some((flag) => flag.code === 'IMPOSSIBLE_VALUE') ? 'impossible' : 'valid_or_suspicious',
          clinicalFlagsJson: abgInterpretation.flags,
          calculationSummaryJson: { pfRatio: abgInterpretation.pfRatio, sfRatio: abgInterpretation.sfRatio },
        }),
      });
    }

    if (admissionPayload.ventilatorSetting) {
      const latestAbg = admissionPayload.abgTest || null;
      const latestSnapshot = admissionPayload.clinicalSnapshot || null;
      const summary = calculateVentilationSummary({
        patient: createdPatient,
        ventilator: admissionPayload.ventilatorSetting,
        latestAbg,
        latestSnapshot,
        referenceRanges,
      });
      await tx.ventilatorSetting.create({
        data: stripUndefined({
          admissionId: admission.id,
          version: 1,
          ...withoutIdempotency(admissionPayload.ventilatorSetting),
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

    if (admissionPayload.airwayDevice) {
      await tx.airwayDevice.create({
        data: stripUndefined({
          admissionId: admission.id,
          ...withoutIdempotency(admissionPayload.airwayDevice),
          enteredByUserId: createdByUserId,
          validationStatus: 'valid_or_missing',
        }),
      });
    }

    if (admissionPayload.humidification) {
      const humidificationFlags = calculateHumidificationFlags(admissionPayload.humidification);
      await tx.humidificationDecision.create({
        data: stripUndefined({
          admissionId: admission.id,
          ...withoutIdempotency(admissionPayload.humidification),
          confirmedByUserId: createdByUserId,
          clinicalFlagsJson: humidificationFlags,
        }),
      });
    }

    const created = await tx.admission.findUnique({ where: { id: admission.id }, include: admissionInclude });
    const responseJson = toJson({
      admission: created,
      clinicalSummary: buildClinicalSummary(created, { referenceRanges }),
      syncStatus: 'synced',
    });

    await storeIdempotencyResult({
      tx,
      userId: createdByUserId,
      facilityId,
      key: admissionPayload.idempotencyKey,
      operation: 'admission.create',
      requestHash: idem.requestHash,
      responseJson,
      entityType: 'Admission',
      entityId: admission.id,
      clientRecordId: admissionPayload.clientRecordId,
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId: createdByUserId,
      facilityId,
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
  const referenceRanges = await resolveDecisionSupportReferenceRanges(admission.facilityId, { allowDevelopmentFallback: false });
  return { ...admission, clinicalSummary: buildClinicalSummary(admission, { referenceRanges }) };
};

export const createAdmissionPatientReasonStep = async (payload, userId, auditContext = {}) => {
  const admissionPayload = stripNullish({
    facilityId: payload.facilityId,
    appAdmissionCode: payload.appAdmissionCode,
    bedNumber: payload.bedNumber,
    admittedAt: payload.admittedAt,
    admissionSource: payload.admissionSource,
    reasonForVentilation: cleanText(payload.reasonForVentilation) || cleanText(payload.reasonForSupport),
    patient: payload.patient,
    clinicalSnapshot: buildPatientReasonSnapshot(payload),
    clientRecordId: payload.clientRecordId,
    deviceId: payload.deviceId,
    clientCreatedAt: payload.clientCreatedAt,
    clientUpdatedAt: payload.clientUpdatedAt,
    idempotencyKey: payload.idempotencyKey,
  });

  const result = await createAdmission(admissionPayload, userId, auditContext);
  const admissionId = result.admission?.id;
  const admission = admissionId ? await getAdmissionById(userId, admissionId) : result.admission;
  const response = buildThreeStepAdmissionResponse('patient_reason', admission, {
    facilityId: admission?.facilityId || payload.facilityId,
    syncStatus: result.syncStatus || 'synced',
  });

  if (admissionId && result.syncStatus !== 'duplicate') {
    await writeAudit({
      ...auditContext,
      userId,
      facilityId: admission.facilityId,
      action: 'ADMISSION_THREE_STEP_PATIENT_REASON',
      entityType: 'Admission',
      entityId: admissionId,
      afterJson: response,
    });
  }

  return response;
};

export const saveAdmissionOxygenAbgVentilatorStep = async (userId, admissionId, payload, auditContext = {}) => {
  await assertAdmissionAccess(userId, admissionId, WRITE_ROLES);
  const admission = await getAdmissionById(userId, admissionId);
  const saved = {};
  const writeStatuses = [];

  const oxygenRecord = stripNullish(payload.oxygen || payload.clinicalSnapshot || {});
  const shouldStoreFlowSnapshot = hasKeys(stripNullish({
    uncertainty: normalizeUncertainty(payload.uncertainty),
    deviceContext: normalizeDeviceContext(payload),
  }));

  if (hasKeys(oxygenRecord) || shouldStoreFlowSnapshot) {
    const clinicalSnapshotPayload = buildStepWriteMetadata(
      applyClinicalSnapshotFlowMetadata(oxygenRecord, admission, payload),
      payload,
      'oxygen',
      { includeSource: true }
    );
    const result = await addClinicalSnapshot(userId, admissionId, clinicalSnapshotPayload, auditContext);
    saved.clinicalSnapshot = result.clinicalSnapshot;
    writeStatuses.push(result.syncStatus || 'synced');
  }

  const abgRecord = stripNullish(payload.abg || payload.abgTest || {});
  if (hasKeys(abgRecord)) {
    const abgPayload = buildStepWriteMetadata(abgRecord, payload, 'abg', {
      includeSource: true,
      includeClientUpdatedAt: true,
    });
    const result = await addAbgTest(userId, admissionId, abgPayload, auditContext);
    saved.abgTest = result.abgTest;
    writeStatuses.push(result.syncStatus || 'synced');
  }

  const ventilatorRecord = stripNullish(payload.ventilator || payload.ventilatorSetting || {});
  if (hasKeys(ventilatorRecord)) {
    const ventilatorPayload = buildStepWriteMetadata(ventilatorRecord, payload, 'ventilator', {
      includeSource: true,
      includeClientUpdatedAt: true,
    });
    const result = await addVentilatorSetting(userId, admissionId, ventilatorPayload, auditContext);
    saved.ventilatorSetting = result.ventilatorSetting;
    writeStatuses.push(result.syncStatus || 'synced');
  }

  const airwayRecord = stripNullish(payload.airwayDevice || {});
  if (hasKeys(airwayRecord)) {
    const airwayPayload = buildStepWriteMetadata(airwayRecord, payload, 'airway');
    const result = await addAirwayDevice(userId, admissionId, airwayPayload, auditContext);
    saved.airwayDevice = result.airwayDevice;
    writeStatuses.push(result.syncStatus || 'synced');
  }

  const humidificationRecord = stripNullish(payload.humidification || {});
  if (hasKeys(humidificationRecord)) {
    const humidificationPayload = buildStepWriteMetadata(humidificationRecord, payload, 'humidification');
    const result = await addHumidification(userId, admissionId, humidificationPayload, auditContext);
    saved.humidificationDecision = result.humidificationDecision;
    writeStatuses.push(result.syncStatus || 'synced');
  }

  const refreshed = await getAdmissionById(userId, admissionId);
  const syncStatus = writeStatuses.length > 0 && writeStatuses.every((status) => status === 'duplicate') ? 'duplicate' : 'synced';
  const response = buildThreeStepAdmissionResponse('oxygen_abg_ventilator', refreshed, {
    facilityId: refreshed.facilityId,
    saved,
    syncStatus,
  });

  if (syncStatus !== 'duplicate') {
    await writeAudit({
      ...auditContext,
      userId,
      facilityId: refreshed.facilityId,
      action: 'ADMISSION_THREE_STEP_OXYGEN_ABG_VENTILATOR',
      entityType: 'Admission',
      entityId: admissionId,
      afterJson: response,
      reason: getOverrideReason(payload),
    });
  }

  return response;
};

export const saveAdmissionAbgVentilatorUpdate = async (userId, admissionId, payload, auditContext = {}) => {
  await assertAdmissionAccess(userId, admissionId, WRITE_ROLES);
  const saved = {};
  const writeStatuses = [];

  const abgRecord = stripNullish(payload.abgTest || {});
  if (hasClinicalValue(abgRecord, ABG_UPDATE_VALUE_FIELDS)) {
    const abgPayload = buildStepWriteMetadata(abgRecord, payload, 'abg', {
      includeSource: true,
      includeClientUpdatedAt: true,
    });
    const result = await addAbgTest(userId, admissionId, abgPayload, auditContext);
    saved.abgTest = result.abgTest;
    writeStatuses.push(result.syncStatus || 'synced');
  }

  const ventilatorRecord = stripNullish(payload.ventilatorSetting || {});
  if (hasClinicalValue(ventilatorRecord, VENTILATOR_UPDATE_VALUE_FIELDS)) {
    const ventilatorPayload = buildStepWriteMetadata(ventilatorRecord, payload, 'ventilator', {
      includeSource: true,
      includeClientUpdatedAt: true,
    });
    const result = await addVentilatorSetting(userId, admissionId, ventilatorPayload, auditContext);
    saved.ventilatorSetting = result.ventilatorSetting;
    writeStatuses.push(result.syncStatus || 'synced');
  }

  const refreshed = await getAdmissionById(userId, admissionId);
  const syncStatus = writeStatuses.length > 0 && writeStatuses.every((status) => status === 'duplicate') ? 'duplicate' : 'synced';
  const response = buildThreeStepAdmissionResponse('abg_ventilator_update', refreshed, {
    facilityId: refreshed.facilityId,
    saved,
    syncStatus,
  });

  if (syncStatus !== 'duplicate') {
    await writeAudit({
      ...auditContext,
      userId,
      facilityId: refreshed.facilityId,
      action: 'ADMISSION_ABG_VENTILATOR_UPDATE',
      entityType: 'Admission',
      entityId: admissionId,
      afterJson: response,
      reason: getOverrideReason(payload),
    });
  }

  return response;
};

export const saveAdmissionReviewStep = async (userId, admissionId, payload, auditContext = {}) => {
  const admissionAccess = await assertAdmissionAccess(userId, admissionId, WRITE_ROLES);

  return prisma.$transaction(async (tx) => {
    const idem = await resolveIdempotency({
      tx,
      userId,
      facilityId: admissionAccess.facilityId,
      key: payload.idempotencyKey,
      operation: 'admission.threeStep.saveReview',
      payload: { admissionId, ...payload },
    });
    if (!idem.shouldRun) return { ...idem.responseJson, syncStatus: 'duplicate' };

    const before = await tx.admission.findUnique({ where: { id: admissionId }, include: fullAdmissionInclude });
    if (!before) throw notFound('Admission not found');

    const referenceRanges = await resolveDecisionSupportReferenceRanges(before.facilityId, { tx });
    const clinicalSummary = buildClinicalSummary(before, { referenceRanges });
    const readiness = buildAdmissionReadiness({ ...before, clinicalSummary });
    const overrideReasonText = getOverrideReason(payload);

    if (readiness.blockers.length > 0 && !overrideReasonText) {
      throw reviewerRequired('Save review requires correction or a clinician override reason for impossible values.', readiness.blockers, {
        status: 'needs_review',
        facilityId: before.facilityId,
        admissionId,
      });
    }

    let reviewAction = null;
    const reviewComment = overrideReasonText || cleanText(payload.reviewNote);
    if (payload.clinicianConfirmed === true || reviewComment) {
      reviewAction = await tx.reviewAction.create({
        data: {
          facilityId: before.facilityId,
          reviewerUserId: userId,
          entityType: 'Admission',
          entityId: admissionId,
          action: overrideReasonText ? 'clinician_override' : 'clinician_save_review',
          statusBefore: before.reviewStatus,
          statusAfter: before.reviewStatus,
          comment: reviewComment,
          beforeJson: { readiness },
          afterJson: {
            readiness,
            clinicianConfirmed: payload.clinicianConfirmed === true,
            overrideReason: overrideReasonText,
          },
        },
      });
    }

    const after = await tx.admission.findUnique({ where: { id: admissionId }, include: fullAdmissionInclude });
    const responseJson = buildThreeStepAdmissionResponse(
      'save_review',
      { ...after, clinicalSummary: buildClinicalSummary(after, { referenceRanges }) },
      {
        facilityId: after.facilityId,
        review: {
          clinicianConfirmed: payload.clinicianConfirmed === true,
          overrideRecorded: Boolean(overrideReasonText),
          reviewActionId: reviewAction?.id || null,
          admissionReviewStatus: after.reviewStatus,
        },
        syncStatus: 'synced',
      },
      { referenceRanges },
    );

    await storeIdempotencyResult({
      tx,
      userId,
      facilityId: before.facilityId,
      key: payload.idempotencyKey,
      operation: 'admission.threeStep.saveReview',
      requestHash: idem.requestHash,
      responseJson,
      entityType: 'Admission',
      entityId: admissionId,
      clientRecordId: payload.clientRecordId,
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: before.facilityId,
      action: 'ADMISSION_THREE_STEP_SAVE_REVIEW',
      entityType: 'Admission',
      entityId: admissionId,
      beforeJson: { readiness },
      afterJson: responseJson,
      reason: overrideReasonText || cleanText(payload.reviewNote),
    });

    return responseJson;
  });
};

export const updateAdmission = async (userId, id, data, auditContext = {}) => {
  const admission = await assertAdmissionAccess(userId, id, WRITE_ROLES);

  return prisma.$transaction(async (tx) => {
    const idem = await resolveIdempotency({
      tx,
      userId,
      facilityId: admission.facilityId,
      key: data.idempotencyKey,
      operation: 'admission.update',
      payload: { admissionId: id, ...data },
    });
    if (!idem.shouldRun) return { ...idem.responseJson, syncStatus: 'duplicate' };

    const reviewedWrite = await assertNoReviewedOverwrite(tx, id, userId, {
      allowClinicianOverride: true,
      overrideReason: getOverrideReason(data),
    });
    const before = await tx.admission.findUnique({ where: { id }, include: admissionInclude });
    const admissionPatchData = pickAdmissionPatchData(data);
    const patientPatchData = preparePatientUpdateData(before.patient, data.patient);

    if (patientPatchData) {
      await tx.patient.update({
        where: { id: before.patientId },
        data: patientPatchData,
      });
    }

    const updated = hasKeys(admissionPatchData)
      ? await tx.admission.update({
        where: { id },
        data: admissionPatchData,
        include: admissionInclude,
      })
      : await tx.admission.findUnique({ where: { id }, include: admissionInclude });
    const referenceRanges = await resolveDecisionSupportReferenceRanges(admission.facilityId, { tx });

    const responseJson = toJson({
      admission: updated,
      clinicalSummary: buildClinicalSummary(updated, { referenceRanges }),
      reviewState: {
        admissionReviewStatus: reviewedWrite.reviewStatus,
        overrideApplied: reviewedWrite.overrideApplied,
        overrideReasonRequired: false,
      },
      syncStatus: 'synced',
    });

    await storeIdempotencyResult({
      tx,
      userId,
      facilityId: admission.facilityId,
      key: data.idempotencyKey,
      operation: 'admission.update',
      requestHash: idem.requestHash,
      responseJson,
      entityType: 'Admission',
      entityId: id,
    });

    if (hasKeys(admissionPatchData)) {
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
        reason: reviewedWrite.overrideReason,
      });
    }

    if (data.status !== undefined && before.status !== updated.status) {
      await writeAudit({
        tx,
        ...auditContext,
        userId,
        facilityId: admission.facilityId,
        action: 'ADMISSION_LIFECYCLE_UPDATE',
        entityType: 'Admission',
        entityId: id,
        beforeJson: { status: before.status },
        afterJson: { status: updated.status },
        reason: reviewedWrite.overrideReason,
      });
    }

    if (patientPatchData) {
      await writeAudit({
        tx,
        ...auditContext,
        userId,
        facilityId: admission.facilityId,
        action: 'PATIENT_REGISTRATION_UPDATE',
        entityType: 'Patient',
        entityId: before.patientId,
        beforeJson: before.patient,
        afterJson: updated.patient,
        reason: reviewedWrite.overrideReason,
      });
    }

    if (!hasKeys(admissionPatchData) && !patientPatchData) {
      await writeAudit({
        tx,
        ...auditContext,
        userId,
        facilityId: admission.facilityId,
        action: 'ADMISSION_NOOP_UPDATE',
        entityType: 'Admission',
        entityId: id,
        beforeJson: before,
        afterJson: responseJson,
        reason: reviewedWrite.overrideReason,
      });
    }

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

    const reviewedWrite = await assertNoReviewedOverwrite(tx, admissionId, userId, {
      allowClinicianOverride: true,
      overrideReason: getOverrideReason(payload),
    });
    const record = await createRecord(tx, admission);
    const refreshed = await tx.admission.findUnique({ where: { id: admissionId }, include: admissionInclude });
    const referenceRanges = await resolveDecisionSupportReferenceRanges(admission.facilityId, { tx });
    const responseJson = toJson({
      [entityType[0].toLowerCase() + entityType.slice(1)]: record,
      facilityId: admission.facilityId,
      clinicalSummary: buildClinicalSummary(refreshed, { referenceRanges }),
      ...buildDecisionSupport(entityType, record),
      reviewState: {
        admissionReviewStatus: reviewedWrite.reviewStatus,
        overrideApplied: reviewedWrite.overrideApplied,
        overrideReasonRequired: false,
      },
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
      reason: reviewedWrite.overrideReason,
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
      select: {
        id: true,
        version: true,
        collectedAt: true,
        clientRecordId: true,
        clientUpdatedAt: true,
        createdAt: true,
      },
    });
    assertNoStaleClientAppend({
      entityType: 'AbgTest',
      admission,
      payload,
      latest,
      timestampField: 'collectedAt',
    });
    const referenceRanges = await resolveDecisionSupportReferenceRanges(admission.facilityId, { tx });
    const abgInterpretation = interpretAbg(payload, admission.patient, { referenceRanges });
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
      select: {
        id: true,
        version: true,
        measuredAt: true,
        clientRecordId: true,
        clientUpdatedAt: true,
        createdAt: true,
      },
    });
    assertNoStaleClientAppend({
      entityType: 'VentilatorSetting',
      admission,
      payload,
      latest,
      timestampField: 'measuredAt',
    });
    const referenceRanges = await resolveDecisionSupportReferenceRanges(admission.facilityId, { tx });
    const summary = calculateVentilationSummary({
      patient: admission.patient,
      ventilator: payload,
      latestAbg: admission.abgTests[0] || null,
      latestSnapshot: admission.clinicalSnapshots[0] || null,
      referenceRanges,
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
  createRecord: async (tx, admission) => {
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
      const nextStatus = statusMap[payload.outcomeType];
      await tx.admission.update({ where: { id: admissionId }, data: { status: nextStatus } });
      if (admission.status !== nextStatus) {
        await writeAudit({
          tx,
          ...auditContext,
          userId,
          facilityId: admission.facilityId,
          action: 'ADMISSION_LIFECYCLE_UPDATE',
          entityType: 'Admission',
          entityId: admissionId,
          beforeJson: { status: admission.status },
          afterJson: { status: nextStatus, outcomeId: outcome.id },
        });
      }
    }
    return outcome;
  },
});

export const assertNoConflictForSync = async ({ admissionId, clientUpdatedAt }) => {
  if (!admissionId || !clientUpdatedAt) return null;
  const admission = await prisma.admission.findUnique({
    where: { id: admissionId },
    select: { id: true, facilityId: true, updatedAt: true, reviewStatus: true },
  });
  if (!admission) throw notFound('Admission not found');
  if (admission.reviewStatus === 'APPROVED') {
    throw conflict('Reviewed admission requires reviewer resolution before sync overwrite', [], {
      status: 'conflict',
      facilityId: admission.facilityId,
      admissionId: admission.id,
      reviewStatus: admission.reviewStatus,
      preserveReviewedData: true,
      resolution: 'submit_new_append_only_record_or_request_reviewer_correction',
      serverUpdatedAt: admission.updatedAt,
      clientUpdatedAt,
    });
  }
  if (new Date(clientUpdatedAt) < admission.updatedAt) {
    throw conflict('Another update exists. Keep both values for reviewer?', [], {
      status: 'conflict',
      facilityId: admission.facilityId,
      admissionId: admission.id,
      reviewStatus: admission.reviewStatus,
      preserveReviewedData: true,
      resolution: 'keep_server_record_and_route_client_payload_for_review',
      serverUpdatedAt: admission.updatedAt,
      clientUpdatedAt,
    });
  }
  return admission;
};
