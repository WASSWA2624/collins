import { prisma } from '../../config/prisma.js';
import { DATASET_EXPORT_ROLES, REVIEW_ROLES, assertFacilityRole, resolveFacilityScope } from '../../utils/authorization.js';
import { badRequest, forbidden, notFound, reviewerRequired } from '../../utils/errors.js';
import { deidentifyPayload, buildDatasetPayloadFromAdmission, findIdentifierPaths } from '../../utils/deidentify.js';
import { writeAudit } from '../../utils/audit.js';
import { sha256 } from '../../utils/crypto.js';
import {
  UNSAFE_DATASET_SOURCE_TYPE_MESSAGE,
  UNSAFE_DATASET_SOURCE_TYPE_PATTERN,
} from './dataset.constants.js';

const toJson = (value) => JSON.parse(JSON.stringify(value));

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
    if (match) return Number(match[1]);
  }
  return undefined;
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
  await assertFacilityRole(userId, facilityId, REVIEW_ROLES);
  const text = noteText.replace(/\s+/g, ' ');

  const preview = {
    patient: {
      ageYears: extractNumber(text, [/\bage\s*(\d{1,3})\b/i, /\b(\d{1,3})\s*y(?:ears?)?\b/i]),
      sexForSizeCalculations: /\bmale\b|\bman\b/i.test(text) ? 'MALE' : /\bfemale\b|\bwoman\b/i.test(text) ? 'FEMALE' : 'UNKNOWN',
    },
    clinicalSnapshot: {
      spo2: extractNumber(text, [/spo2\s*[:=]?\s*(\d{2,3})/i, /saturation\s*[:=]?\s*(\d{2,3})/i]),
      fio2: (() => {
        const value = extractNumber(text, [/fio2\s*[:=]?\s*(0?\.\d{1,2})/i, /fio2\s*[:=]?\s*(\d{2,3})\s*%/i]);
        if (value === undefined) return undefined;
        return value > 1 ? value / 100 : value;
      })(),
      respiratoryRate: extractNumber(text, [/\bRR\s*[:=]?\s*(\d{1,3})/i]),
    },
    abgTest: {
      ph: extractNumber(text, [/\bpH\s*[:=]?\s*(\d\.\d{1,3})/i]),
      pao2: extractNumber(text, [/pa[o0]2\s*[:=]?\s*(\d{1,3})/i]),
      paco2: extractNumber(text, [/pa[cC][o0]2\s*[:=]?\s*(\d{1,3})/i]),
      hco3: extractNumber(text, [/hco3\s*[:=]?\s*(\d{1,3})/i]),
      lactate: extractNumber(text, [/lactate\s*[:=]?\s*(\d+(?:\.\d+)?)/i]),
    },
    ventilatorSetting: {
      mode: text.match(/\bmode\s*[:=]?\s*([A-Za-z0-9 -]{2,20})/i)?.[1]?.trim(),
      tidalVolumeMl: extractNumber(text, [/\bVT\s*[:=]?\s*(\d{2,4})/i, /tidal volume\s*[:=]?\s*(\d{2,4})/i]),
      respiratoryRateSet: extractNumber(text, [/set\s*RR\s*[:=]?\s*(\d{1,3})/i]),
      peep: extractNumber(text, [/PEEP\s*[:=]?\s*(\d{1,2})/i]),
      plateauPressure: extractNumber(text, [/plateau\s*[:=]?\s*(\d{1,2})/i]),
      peakPressure: extractNumber(text, [/peak\s*[:=]?\s*(\d{1,2})/i]),
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

  return {
    structuredPreviewJson: deidentifiedPreview,
    missingFields: Object.entries(deidentifiedPreview).flatMap(([section, value]) => (
      value && typeof value === 'object'
        ? Object.entries(value).filter(([, entry]) => entry === undefined || entry === null).map(([key]) => `${section}.${key}`)
        : []
    )),
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
  await assertFacilityRole(userId, payload.facilityId, REVIEW_ROLES);
  const deidentifiedPayloadJson = await buildDatasetPayload(payload);

  return prisma.$transaction(async (tx) => {
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
    return datasetCase;
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
