import { prisma } from '../../config/prisma.js';
import { DATASET_EXPORT_ROLES, REVIEW_ROLES, assertFacilityRole, resolveFacilityScope } from '../../utils/authorization.js';
import { badRequest, forbidden, notFound, reviewerRequired } from '../../utils/errors.js';
import { deidentifyPayload, buildDatasetPayloadFromAdmission } from '../../utils/deidentify.js';
import { writeAudit } from '../../utils/audit.js';

const toJson = (value) => JSON.parse(JSON.stringify(value));

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

const extractNumber = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number(match[1]);
  }
  return undefined;
};

export const parseIcuNote = async ({ noteText, facilityId }, userId, auditContext = {}) => {
  if (facilityId) await assertFacilityRole(userId, facilityId, REVIEW_ROLES);
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
  if (facilityId) {
    await writeAudit({
      ...auditContext,
      userId,
      facilityId,
      action: 'DATASET_NOTE_PARSE_PREVIEW',
      entityType: 'DatasetCase',
      afterJson: { fields: Object.keys(deidentifiedPreview) },
    });
  }

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

const buildDatasetPayload = async ({ sourceAdmissionId, structuredPreviewJson }) => {
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
  if (admission.reviewStatus !== 'APPROVED') {
    throw reviewerRequired('Source admission must be reviewed before dataset approval.');
  }
  return buildDatasetPayloadFromAdmission(admission);
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
      action: 'DATASET_IMPORT_CREATE',
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
  const required = ['facilityApproval', 'dataSharingAgreement', 'deidentificationReviewed'];
  const missing = required.filter((key) => governance[key] !== true);
  if (missing.length > 0) {
    throw badRequest('Governance metadata is incomplete', missing.map((key) => ({ path: `governanceJson.${key}`, message: 'Must be true before training approval' })));
  }
};

export const reviewDatasetImport = async (id, payload, userId, auditContext = {}) => {
  const existing = await prisma.datasetCase.findUnique({ where: { id }, select: { ...datasetSelect, approvedForTraining: true } });
  if (!existing) throw notFound('Dataset case not found');
  await assertFacilityRole(userId, existing.facilityId, REVIEW_ROLES);

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
      action: 'DATASET_REVIEW',
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
    prisma.datasetCase.findMany({ where, select: datasetSelect, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.datasetCase.count({ where }),
  ]);
  return { items, total, page, limit };
};

export const exportDatasetCase = async (id, { reason }, userId, auditContext = {}) => {
  const datasetCase = await prisma.datasetCase.findUnique({ where: { id }, select: datasetSelect });
  if (!datasetCase) throw notFound('Dataset case not found');
  await assertFacilityRole(userId, datasetCase.facilityId, DATASET_EXPORT_ROLES);
  if (!datasetCase.approvedForTraining || datasetCase.reviewStatus !== 'APPROVED_FOR_TRAINING') {
    throw forbidden('Only reviewed, de-identified, approved-for-training dataset cases can be exported');
  }
  if (!datasetCase.ethicsApprovalId || !datasetCase.datasetVersion) {
    throw forbidden('Dataset export requires ethics approval and dataset version metadata');
  }

  const exportPayload = toJson({
    datasetCaseId: datasetCase.id,
    datasetVersion: datasetCase.datasetVersion,
    ethicsApprovalId: datasetCase.ethicsApprovalId,
    payload: deidentifyPayload(datasetCase.deidentifiedPayloadJson),
  });

  await writeAudit({
    ...auditContext,
    userId,
    facilityId: datasetCase.facilityId,
    action: 'DATASET_EXPORT',
    entityType: 'DatasetCase',
    entityId: id,
    afterJson: { datasetCaseId: id, datasetVersion: datasetCase.datasetVersion },
    reason,
  });

  return exportPayload;
};
