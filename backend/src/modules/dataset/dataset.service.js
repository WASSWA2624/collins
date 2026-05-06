import { prisma } from '../../config/prisma.js';
import { DATASET_EXPORT_ROLES, REVIEW_ROLES, WRITE_ROLES, assertFacilityRole, resolveFacilityScope } from '../../utils/authorization.js';
import { badRequest, forbidden, notFound, reviewerRequired } from '../../utils/errors.js';
import { deidentifyPayload, buildDatasetPayloadFromAdmission, findIdentifierPaths } from '../../utils/deidentify.js';
import { writeAudit } from '../../utils/audit.js';
import { sha256 } from '../../utils/crypto.js';
import { resolveIdempotency, storeIdempotencyResult } from '../../utils/idempotency.js';
import {
  UNSAFE_DATASET_SOURCE_TYPE_MESSAGE,
  UNSAFE_DATASET_SOURCE_TYPE_PATTERN,
} from './dataset.constants.js';

const toJson = (value) => JSON.parse(JSON.stringify(value));
const DATASET_CAPTURE_OPERATION = 'dataset.capture.create';
const DATASET_CAPTURE_ROLES = Object.freeze([...new Set([...WRITE_ROLES, ...REVIEW_ROLES])]);

export const REQUIRED_TRAINING_GOVERNANCE_KEYS = Object.freeze([
  'facilityApproval',
  'dataSharingAgreement',
  'deidentificationReviewed',
]);

export const DATASET_EXPORT_POLICY = Object.freeze({
  deidentifiedOnly: true,
  reviewedOnly: true,
  ethicsApprovalRequired: true,
  datasetVersionRequired: true,
  rawNotesAllowed: false,
  patientIdentifiersAllowed: false,
});

const datasetSelect = {
  id: true,
  facilityId: true,
  sourceAdmissionId: true,
  sourceType: true,
  structuredPreviewJson: true,
  deidentifiedPayloadJson: true,
  deidentificationStatus: true,
  reviewStatus: true,
  approvedForTraining: true,
  ethicsApprovalId: true,
  governanceJson: true,
  datasetVersion: true,
  exclusionReason: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
};

const approvedDatasetSelect = {
  id: true,
  facilityId: true,
  sourceType: true,
  structuredPreviewJson: true,
  deidentifiedPayloadJson: true,
  deidentificationStatus: true,
  reviewStatus: true,
  approvedForTraining: true,
  ethicsApprovalId: true,
  governanceJson: true,
  datasetVersion: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
};

const extractNumber = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const value = Number(match[1]);
    if (Number.isFinite(value)) return value;
  }
  return undefined;
};

const extractRange = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const lower = Number(match[1]);
    const upper = Number(match[2]);
    if (Number.isFinite(lower) && Number.isFinite(upper)) return [lower, upper];
  }
  return [undefined, undefined];
};

const normalizeDiagnosis = (text) => {
  if (/\bcopd\b|chronic obstructive/i.test(text)) return 'COPD';
  if (/\basthma\b/i.test(text)) return 'ASTHMA';
  if (/\bpneumonia\b/i.test(text)) return 'PNEUMONIA';
  if (/\bards\b/i.test(text)) return 'ARDS';
  if (/\bheart failure\b|\bchf\b/i.test(text)) return 'HEART_FAILURE';
  if (/\bsepsis\b/i.test(text)) return 'SEPSIS';
  if (/\btrauma\b/i.test(text)) return 'TRAUMA';
  return undefined;
};

const normalizeVentilatorMode = (text) => {
  if (/\bprvc\b/i.test(text)) return 'PRVC';
  if (/\bsimv\b/i.test(text)) return 'SIMV';
  if (/\b(psv|pressure support)\b/i.test(text)) return 'PSV';
  if (/\b(bipap|niv)\b/i.test(text)) return 'BIPAP';
  if (/\b(volume control|vc)\b/i.test(text)) return 'VC';
  if (/\b(pressure control|pc)\b/i.test(text)) return 'PC';
  return text.match(/\bmode\s*[:=]?\s*([A-Za-z0-9 /+-]{2,20})/i)?.[1]?.trim()?.toUpperCase();
};

const normalizePatientPathway = (text) => {
  if (/\b(neonate|newborn)\b/i.test(text)) return 'NEONATE';
  if (/\b(child|paediatric|pediatric)\b/i.test(text)) return 'CHILD';
  if (/\badolescent\b/i.test(text)) return 'ADOLESCENT';
  return 'ADULT';
};

export const assertDatasetSourceTypeAllowed = (sourceType = '') => {
  if (UNSAFE_DATASET_SOURCE_TYPE_PATTERN.test(sourceType)) {
    throw badRequest(UNSAFE_DATASET_SOURCE_TYPE_MESSAGE);
  }
};

const filterReviewedAdmissionRecords = (admission) => ({
  ...admission,
  abgTests: (admission.abgTests || []).filter((record) => record.reviewStatus === 'APPROVED'),
  ventilatorSettings: (admission.ventilatorSettings || []).filter((record) => record.reviewStatus === 'APPROVED'),
});

export const buildReviewedAdmissionDatasetPayload = (admission) => buildDatasetPayloadFromAdmission(filterReviewedAdmissionRecords(admission));

export const parseIcuNote = async ({ noteText, facilityId }, userId, auditContext = {}) => {
  await assertFacilityRole(userId, facilityId, DATASET_CAPTURE_ROLES);
  const text = noteText.replace(/\s+/g, ' ');
  const fio2 = (() => {
    const value = extractNumber(text, [/fio2\s*[:=]?\s*(0?\.\d{1,2})/i, /fio2\s*[:=]?\s*(\d{2,3})\s*%/i]);
    if (value === undefined) return undefined;
    return value > 1 ? Number((value / 100).toFixed(2)) : value;
  })();
  const peep = extractNumber(text, [/PEEP\s*[:=]?\s*(\d{1,2})/i]);
  const plateauPressure = extractNumber(text, [/plateau\s*[:=]?\s*(\d{1,2})/i]);
  const [spo2Lower, spo2Upper] = extractRange(text, [/target\s*spo2\s*[:=]?\s*(\d{2,3})\s*[-to]+\s*(\d{2,3})/i]);
  const [paco2Lower, paco2Upper] = extractRange(text, [/target\s*paco2\s*[:=]?\s*(\d{1,3})\s*[-to]+\s*(\d{1,3})/i]);

  const preview = {
    captureMetadata: {
      schemaVersion: 'clinical_case_v1',
      entryMode: 'structured_clinician_entry',
      rawNoteStored: false,
    },
    caseContext: {
      primaryDiagnosis: normalizeDiagnosis(text),
      reasonForVentilation: /\bhypercap/i.test(text)
        ? 'Hypercapnic respiratory failure'
        : /\bhypox/i.test(text)
          ? 'Hypoxemic respiratory failure'
          : undefined,
      ventilationIndication: /\bhypercap/i.test(text)
        ? 'HYPERCAPNIA'
        : /\bhypox/i.test(text)
          ? 'HYPOXEMIA'
          : undefined,
    },
    patient: {
      patientPathway: normalizePatientPathway(text),
      ageYears: extractNumber(text, [/\bage\s*[:=]?\s*(\d{1,3})\b/i, /\b(\d{1,3})\s*y(?:ears?)?\b/i]),
      sexForSizeCalculations: /\bmale\b|\bman\b/i.test(text) ? 'MALE' : /\bfemale\b|\bwoman\b/i.test(text) ? 'FEMALE' : undefined,
      actualWeightKg: extractNumber(text, [/\bweight\s*[:=]?\s*(\d{1,3}(?:\.\d+)?)\s*kg/i]),
      heightOrLengthCm: extractNumber(text, [/\bheight\s*[:=]?\s*(\d{2,3}(?:\.\d+)?)\s*cm/i]),
    },
    clinicalContext: {
      copdPhenotype: /\bcopd\b/i.test(text) ? 'ACUTE_HYPERCAPNIC_EXACERBATION' : undefined,
    },
    clinicalSnapshot: {
      spo2: extractNumber(text, [/spo2\s*[:=]?\s*(\d{2,3})/i, /saturation\s*[:=]?\s*(\d{2,3})/i]),
      fio2,
      respiratoryRate: extractNumber(text, [/\bRR\s*[:=]?\s*(\d{1,3})/i, /respiratory rate\s*[:=]?\s*(\d{1,3})/i]),
      heartRate: extractNumber(text, [/\bHR\s*[:=]?\s*(\d{1,3})/i, /heart rate\s*[:=]?\s*(\d{1,3})/i]),
    },
    abgTest: {
      ph: extractNumber(text, [/\bpH\s*[:=]?\s*(\d\.\d{1,3})/i]),
      pao2: extractNumber(text, [/pa[o0]2\s*[:=]?\s*(\d{1,3})/i]),
      paco2: extractNumber(text, [/pa[cC][o0]2\s*[:=]?\s*(\d{1,3})/i]),
      hco3: extractNumber(text, [/hco3\s*[:=]?\s*(\d{1,3})/i]),
      lactate: extractNumber(text, [/lactate\s*[:=]?\s*(\d+(?:\.\d+)?)/i]),
      fio2AtSample: fio2,
    },
    ventilatorSetting: {
      mode: normalizeVentilatorMode(text),
      tidalVolumeMl: extractNumber(text, [/\bVT\s*[:=]?\s*(\d{2,4})/i, /tidal volume\s*[:=]?\s*(\d{2,4})/i]),
      respiratoryRateSet: extractNumber(text, [/set\s*RR\s*[:=]?\s*(\d{1,3})/i]),
      fio2,
      peep,
      plateauPressure,
      peakPressure: extractNumber(text, [/peak\s*[:=]?\s*(\d{1,2})/i]),
      drivingPressure: Number.isFinite(plateauPressure) && Number.isFinite(peep)
        ? plateauPressure - peep
        : undefined,
    },
    targetRanges: {
      spo2Lower,
      spo2Upper,
      paco2Lower,
      paco2Upper,
    },
    quality: {
      reviewerConfidence: 'NEEDS_REVIEW',
    },
    parserWarnings: [
      'Structured preview requires human review before dataset use.',
      'Raw note text was not stored in the training payload.',
    ],
  };

  const deidentifiedPreview = deidentifyPayload(preview);
  await writeAudit({
    ...auditContext,
    userId,
    facilityId,
    action: 'DATASET_NOTE_PARSE_PREVIEW',
    entityType: 'DatasetCase',
    afterJson: { fields: Object.keys(deidentifiedPreview) },
  });

  const requiredPreviewPaths = [
    'caseContext.primaryDiagnosis',
    'caseContext.reasonForVentilation',
    'patient.patientPathway',
    'patient.ageYears',
    'patient.sexForSizeCalculations',
    'clinicalSnapshot.spo2',
    'clinicalSnapshot.fio2',
    'clinicalSnapshot.respiratoryRate',
    'abgTest.ph',
    'abgTest.paco2',
    'ventilatorSetting.mode',
    'ventilatorSetting.tidalVolumeMl',
    'ventilatorSetting.respiratoryRateSet',
    'ventilatorSetting.peep',
    'targetRanges.spo2Lower',
    'targetRanges.spo2Upper',
    'outcome.outcomeType',
    'quality.reviewerConfidence',
  ];
  const getPreviewPath = (path) => path.split('.').reduce((acc, key) => acc?.[key], deidentifiedPreview);

  return {
    structuredPreviewJson: deidentifiedPreview,
    missingFields: requiredPreviewPaths.filter((path) => {
      const value = getPreviewPath(path);
      return value === undefined || value === null || value === '';
    }),
    noteStorage: 'raw_note_not_saved',
  };
};

const buildDatasetPayload = async ({ facilityId, sourceAdmissionId, sourceType, structuredPreviewJson }) => {
  assertDatasetSourceTypeAllowed(sourceType);
  if (!sourceAdmissionId) return deidentifyPayload(structuredPreviewJson);

  const admission = await prisma.admission.findUnique({
    where: { id: sourceAdmissionId },
    include: {
      patient: true,
      clinicalSnapshots: true,
      abgTests: true,
      ventilatorSettings: true,
      airwayDevices: true,
      humidificationDecisions: true,
      dailyReviews: true,
      outcomes: true,
    },
  });
  if (!admission) throw notFound('Source admission not found');
  if (admission.facilityId !== facilityId) throw notFound('Source admission not found');
  if (admission.reviewStatus !== 'APPROVED') {
    throw reviewerRequired('Source admission must be reviewed before dataset approval.');
  }
  return buildReviewedAdmissionDatasetPayload(admission);
};

export const createDatasetImport = async (payload, userId, auditContext = {}) => {
  await assertFacilityRole(userId, payload.facilityId, DATASET_CAPTURE_ROLES);
  const deidentifiedPayloadJson = await buildDatasetPayload(payload);

  return prisma.$transaction(async (tx) => {
    const idem = await resolveIdempotency({
      tx,
      userId,
      facilityId: payload.facilityId,
      key: payload.idempotencyKey,
      operation: DATASET_CAPTURE_OPERATION,
      payload,
    });

    if (!idem.shouldRun) {
      const datasetCase = idem.responseJson?.datasetCase || idem.responseJson;
      return datasetCase ? { ...datasetCase, syncStatus: 'duplicate' } : idem.responseJson;
    }

    const datasetCase = await tx.datasetCase.create({
      data: {
        facilityId: payload.facilityId,
        sourceAdmissionId: payload.sourceAdmissionId,
        sourceType: payload.sourceType,
        structuredPreviewJson: deidentifyPayload(payload.structuredPreviewJson),
        sourcePayloadJson: null,
        deidentifiedPayloadJson,
        deidentificationStatus: 'deidentified_server_side',
        reviewStatus: 'SUBMITTED',
        governanceJson: payload.governanceJson,
      },
      select: datasetSelect,
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: payload.facilityId,
      action: 'DATASET_CAPTURE_CREATE',
      entityType: 'DatasetCase',
      entityId: datasetCase.id,
      afterJson: datasetCase,
    });

    const responseJson = toJson({
      datasetCase,
      syncStatus: payload.idempotencyKey ? 'synced' : undefined,
    });

    await storeIdempotencyResult({
      tx,
      userId,
      facilityId: payload.facilityId,
      key: payload.idempotencyKey,
      operation: DATASET_CAPTURE_OPERATION,
      requestHash: idem.requestHash,
      responseJson,
      entityType: 'DatasetCase',
      entityId: datasetCase.id,
      clientRecordId: payload.clientRecordId,
    });

    return payload.idempotencyKey ? { ...datasetCase, syncStatus: 'synced' } : datasetCase;
  });
};

export const listPendingDatasetImports = async (userId, { facilityId, page, limit }) => {
  const scopedFacilityId = await resolveFacilityScope(userId, facilityId, REVIEW_ROLES);
  const where = {
    ...(scopedFacilityId ? { facilityId: scopedFacilityId } : {}),
    reviewStatus: { in: ['SUBMITTED', 'NEEDS_CORRECTION', 'REVIEWED', 'APPROVED_FOR_DATASET'] },
  };

  const [items, total] = await Promise.all([
    prisma.datasetCase.findMany({ where, select: datasetSelect, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.datasetCase.count({ where }),
  ]);
  return { items, total, page, limit };
};

const assertTrainingGovernance = (payload) => {
  if (!payload.ethicsApprovalId) throw badRequest('ethicsApprovalId is required before approving data for training');
  if (!payload.datasetVersion) throw badRequest('datasetVersion is required before approving data for training');
  const governance = payload.governanceJson || {};
  const missing = REQUIRED_TRAINING_GOVERNANCE_KEYS.filter((key) => governance[key] !== true);
  if (missing.length > 0) {
    throw badRequest('Governance metadata is incomplete', missing.map((key) => ({ path: `governanceJson.${key}`, message: 'Must be true before training approval' })));
  }
};

const getMissingExportGovernance = (datasetCase) => {
  const governance = datasetCase.governanceJson || {};
  return REQUIRED_TRAINING_GOVERNANCE_KEYS.filter((key) => governance[key] !== true);
};

export const buildDatasetCard = (datasetCase) => ({
  datasetCaseId: datasetCase.id,
  datasetVersion: datasetCase.datasetVersion || null,
  ethicsApprovalId: datasetCase.ethicsApprovalId || null,
  facilityId: datasetCase.facilityId,
  sourceType: datasetCase.sourceType,
  reviewStatus: datasetCase.reviewStatus,
  approvedForTraining: datasetCase.approvedForTraining === true,
  deidentificationStatus: datasetCase.deidentificationStatus || null,
  reviewedAt: datasetCase.reviewedAt || null,
  governanceChecks: Object.fromEntries(
    REQUIRED_TRAINING_GOVERNANCE_KEYS.map((key) => [key, datasetCase.governanceJson?.[key] === true])
  ),
  exportPolicy: DATASET_EXPORT_POLICY,
});

export const assertDatasetCaseExportEligible = (datasetCase) => {
  assertDatasetSourceTypeAllowed(datasetCase.sourceType);

  if (!datasetCase.approvedForTraining || datasetCase.reviewStatus !== 'APPROVED_FOR_TRAINING') {
    throw forbidden('Only reviewed, de-identified, approved-for-training dataset cases can be exported');
  }

  if (!datasetCase.ethicsApprovalId || !datasetCase.datasetVersion) {
    throw forbidden('Dataset export requires ethics approval and dataset version metadata');
  }

  if (!String(datasetCase.deidentificationStatus || '').startsWith('deidentified')) {
    throw forbidden('Dataset export requires server-side de-identification status');
  }

  const missingGovernance = getMissingExportGovernance(datasetCase);
  if (missingGovernance.length > 0) {
    throw forbidden('Dataset export requires complete governance metadata', missingGovernance.map((key) => ({
      path: `governanceJson.${key}`,
      message: 'Must be true before export',
    })));
  }

  const identifierPaths = findIdentifierPaths(datasetCase.deidentifiedPayloadJson);
  if (identifierPaths.length > 0) {
    throw forbidden('Dataset export payload still contains identifier-like fields', identifierPaths.map((path) => ({
      path: `deidentifiedPayloadJson.${path}`,
      message: 'Remove identifier-like field before export',
    })));
  }
};

export const reviewDatasetImport = async (id, payload, userId, auditContext = {}) => {
  const existing = await prisma.datasetCase.findUnique({ where: { id }, select: { ...datasetSelect, approvedForTraining: true } });
  if (!existing) throw notFound('Dataset case not found');
  await assertFacilityRole(userId, existing.facilityId, REVIEW_ROLES);
  assertDatasetSourceTypeAllowed(existing.sourceType);
  if (payload.action === 'approve_for_training') {
    await assertFacilityRole(userId, existing.facilityId, DATASET_EXPORT_ROLES);
  }

  let data;
  if (payload.action === 'request_correction') {
    data = { reviewStatus: 'NEEDS_CORRECTION', reviewedByUserId: userId, reviewedAt: new Date() };
  } else if (payload.action === 'approve_for_dataset') {
    data = {
      reviewStatus: 'APPROVED_FOR_DATASET',
      reviewedByUserId: userId,
      reviewedAt: new Date(),
      deidentifiedPayloadJson: deidentifyPayload(payload.correctedPayloadJson || existing.deidentifiedPayloadJson),
    };
  } else if (payload.action === 'approve_for_training') {
    assertTrainingGovernance(payload);
    if (!['APPROVED_FOR_DATASET', 'APPROVED_FOR_TRAINING'].includes(existing.reviewStatus)) {
      throw reviewerRequired('Dataset case must be approved for dataset before training approval.');
    }
    data = {
      reviewStatus: 'APPROVED_FOR_TRAINING',
      approvedForTraining: true,
      approvedByUserId: userId,
      reviewedByUserId: userId,
      reviewedAt: new Date(),
      ethicsApprovalId: payload.ethicsApprovalId,
      datasetVersion: payload.datasetVersion,
      governanceJson: payload.governanceJson,
      deidentifiedPayloadJson: deidentifyPayload(payload.correctedPayloadJson || existing.deidentifiedPayloadJson),
    };
  } else {
    data = {
      reviewStatus: 'EXCLUDED',
      approvedForTraining: false,
      reviewedByUserId: userId,
      reviewedAt: new Date(),
      exclusionReason: payload.exclusionReason || payload.reviewerComment || 'Excluded by reviewer',
    };
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.datasetCase.update({ where: { id }, data, select: datasetSelect });
    await tx.reviewAction.create({
      data: {
        facilityId: existing.facilityId,
        reviewerUserId: userId,
        entityType: 'DatasetCase',
        entityId: id,
        action: payload.action,
        statusBefore: existing.reviewStatus,
        statusAfter: updated.reviewStatus,
        comment: payload.reviewerComment,
        beforeJson: existing,
        afterJson: updated,
      },
    });
    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: existing.facilityId,
      action: payload.action === 'exclude' ? 'DATASET_EXCLUSION' : 'DATASET_REVIEW',
      entityType: 'DatasetCase',
      entityId: id,
      beforeJson: existing,
      afterJson: updated,
      reason: payload.reviewerComment,
    });
    return updated;
  });
};

export const listApprovedDatasets = async (userId, { facilityId, datasetVersion, page, limit }) => {
  const scopedFacilityId = await resolveFacilityScope(userId, facilityId, REVIEW_ROLES);
  const where = {
    ...(scopedFacilityId ? { facilityId: scopedFacilityId } : {}),
    ...(datasetVersion ? { datasetVersion } : {}),
    approvedForTraining: true,
    reviewStatus: 'APPROVED_FOR_TRAINING',
  };
  const [items, total] = await Promise.all([
    prisma.datasetCase.findMany({ where, select: approvedDatasetSelect, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.datasetCase.count({ where }),
  ]);
  return {
    items: items.map((item) => ({
      ...item,
      datasetCard: buildDatasetCard(item),
    })),
    total,
    page,
    limit,
  };
};

export const getDatasetCaseCard = async (id, userId) => {
  const datasetCase = await prisma.datasetCase.findUnique({ where: { id }, select: datasetSelect });
  if (!datasetCase) throw notFound('Dataset case not found');
  await assertFacilityRole(userId, datasetCase.facilityId, DATASET_EXPORT_ROLES);
  assertDatasetSourceTypeAllowed(datasetCase.sourceType);

  return {
    datasetCard: buildDatasetCard(datasetCase),
    exportEligible: (() => {
      try {
        assertDatasetCaseExportEligible(datasetCase);
        return true;
      } catch {
        return false;
      }
    })(),
  };
};

export const exportDatasetCase = async (id, { reason }, userId, auditContext = {}) => {
  const datasetCase = await prisma.datasetCase.findUnique({ where: { id }, select: datasetSelect });
  if (!datasetCase) throw notFound('Dataset case not found');
  await assertFacilityRole(userId, datasetCase.facilityId, DATASET_EXPORT_ROLES);
  assertDatasetCaseExportEligible(datasetCase);

  const exportedAt = new Date();
  const payload = deidentifyPayload(datasetCase.deidentifiedPayloadJson);
  const datasetCard = buildDatasetCard(datasetCase);
  const exportPayload = toJson({
    exportId: sha256(`${datasetCase.id}:${userId}:${auditContext.requestId || ''}:${exportedAt.toISOString()}`).slice(0, 24),
    datasetCaseId: datasetCase.id,
    datasetVersion: datasetCase.datasetVersion,
    ethicsApprovalId: datasetCase.ethicsApprovalId,
    exportedAt,
    datasetCard,
    exportPolicy: DATASET_EXPORT_POLICY,
    payload,
  });

  const auditLog = await writeAudit({
    ...auditContext,
    userId,
    facilityId: datasetCase.facilityId,
    action: 'DATASET_EXPORT',
    entityType: 'DatasetCase',
    entityId: id,
    afterJson: {
      exportId: exportPayload.exportId,
      datasetCaseId: id,
      datasetVersion: datasetCase.datasetVersion,
      ethicsApprovalId: datasetCase.ethicsApprovalId,
      exportedAt,
      datasetCard,
    },
    reason,
  });

  return {
    ...exportPayload,
    audit: {
      auditLogId: auditLog.id,
      action: auditLog.action,
      requestId: auditLog.requestId,
    },
  };
};
