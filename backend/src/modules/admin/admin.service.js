import { prisma } from '../../config/prisma.js';
import {
  DATASET_EXPORT_ROLES,
  FACILITY_ADMIN_ROLES,
  MODEL_GOVERNANCE_ROLES,
  READ_ROLES,
  REVIEW_ROLES,
  assertAnyApprovedRole,
  assertFacilityRole,
  assertPlatformRole,
  resolveFacilityScope,
} from '../../utils/authorization.js';
import { notFound, badRequest } from '../../utils/errors.js';
import { writeAudit } from '../../utils/audit.js';
import { stripUndefined } from '../../utils/object.js';
import { deidentifyPayload, findIdentifierPaths } from '../../utils/deidentify.js';
import { getOperationalDashboard } from '../dashboards/dashboards.service.js';

export const getAdminDashboard = getOperationalDashboard;

export const listAdminFacilities = async (userId) => {
  await assertPlatformRole(userId);
  return prisma.facility.findMany({
    include: {
      _count: { select: { admissions: true, memberships: true, datasetCases: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const listAuditLogs = async (userId, { facilityId, action, entityType, page, limit }) => {
  const scopedFacilityId = await resolveFacilityScope(userId, facilityId, FACILITY_ADMIN_ROLES);
  const where = {
    ...(scopedFacilityId ? { facilityId: scopedFacilityId } : {}),
    ...(action ? { action } : {}),
    ...(entityType ? { entityType } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.auditLog.count({ where }),
  ]);
  return { items, total, page, limit };
};

export const getDatasetQuality = async (userId, { facilityId } = {}) => {
  const scopedFacilityId = await resolveFacilityScope(userId, facilityId, [
    ...FACILITY_ADMIN_ROLES,
    ...DATASET_EXPORT_ROLES,
  ]);
  const where = scopedFacilityId ? { facilityId: scopedFacilityId } : {};
  const [total, submitted, approvedForTraining, excluded] = await Promise.all([
    prisma.datasetCase.count({ where }),
    prisma.datasetCase.count({ where: { ...where, reviewStatus: 'SUBMITTED' } }),
    prisma.datasetCase.count({ where: { ...where, approvedForTraining: true } }),
    prisma.datasetCase.count({ where: { ...where, reviewStatus: 'EXCLUDED' } }),
  ]);
  return {
    total,
    submitted,
    approvedForTraining,
    excluded,
    warning: 'Only de-identified and approved-for-training records are export eligible.',
  };
};

export const REQUIRED_MODEL_CARD_FIELDS = Object.freeze([
  'modelName',
  'version',
  'trainingDatasetVersion',
  'intendedUse',
  'contraindicatedUse',
  'performanceSummaryJson',
  'calibrationSummaryJson',
  'biasAssessmentJson',
]);

const fieldIsPresent = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

export const buildModelCard = (model) => {
  const missingFields = REQUIRED_MODEL_CARD_FIELDS.filter((field) => !fieldIsPresent(model[field]));
  const modelCardComplete = missingFields.length === 0;

  return {
    modelVersionId: model.id,
    modelName: model.modelName,
    version: model.version,
    approvalStatus: model.approvalStatus,
    trainingDatasetVersion: model.trainingDatasetVersion || null,
    intendedUse: model.intendedUse || null,
    contraindicatedUse: model.contraindicatedUse || null,
    performanceSummaryJson: model.performanceSummaryJson || null,
    calibrationSummaryJson: model.calibrationSummaryJson || null,
    biasAssessmentJson: model.biasAssessmentJson || null,
    missingFields,
    readinessStatus: modelCardComplete ? 'model_card_complete' : 'model_card_incomplete',
    shadowModeEligible: modelCardComplete && ['DRAFT', 'SHADOW_MODE'].includes(model.approvalStatus),
    liveClinicalPredictionEnabled: false,
    clinicianVisibleOutputsAllowed: false,
    externalModelServicesAllowed: false,
  };
};

const assertModelReadyForShadowMode = (model) => {
  const modelCard = buildModelCard(model);
  if (!modelCard.shadowModeEligible) {
    throw badRequest('Model card metadata is required before shadow mode.', modelCard.missingFields.map((field) => ({
      path: field,
      message: 'Required for shadow-mode readiness',
    })));
  }
  return modelCard;
};

export const getModelMonitoring = async (userId) => {
  await assertAnyApprovedRole(userId, MODEL_GOVERNANCE_ROLES, 'Model governance permission is required');
  const [versions, shadowOutputs, outputsByModel] = await Promise.all([
    prisma.modelVersion.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.modelOutput.count({ where: { visibleToClinicians: false } }),
    prisma.modelOutput.groupBy({
      by: ['modelVersionId'],
      where: { visibleToClinicians: false },
      _count: { _all: true },
    }),
  ]);
  const outputCountsByModel = Object.fromEntries(outputsByModel.map((row) => [row.modelVersionId, row._count._all]));

  return {
    versions: versions.map((model) => ({
      ...model,
      modelCard: buildModelCard(model),
      shadowOutputCount: outputCountsByModel[model.id] || 0,
    })),
    shadowOutputs,
    liveClinicalPredictionEnabled: false,
    driftMetrics: {
      source: 'shadow_model_outputs',
      outputsByModelVersion: outputCountsByModel,
      liveClinicalDriftMonitoringEnabled: false,
    },
    safetyStatement: 'Shadow-mode outputs are admin/research only and hidden from clinical users.',
  };
};

const getReferenceFacilityId = (payload) => (payload.scope === 'FACILITY' ? payload.facilityId : null);

const assertReferenceGovernanceRole = async (userId, facilityId) => {
  if (facilityId) return assertFacilityRole(userId, facilityId, REVIEW_ROLES);
  return assertPlatformRole(userId);
};

const appendReferenceAuditTrail = (existingTrail, entry) => [
  ...(Array.isArray(existingTrail) ? existingTrail : []),
  entry,
];

export const listReferenceRules = async (userId, { facilityId, verificationStatus, page, limit }) => {
  const scopedFacilityId = facilityId
    ? (await assertReferenceGovernanceRole(userId, facilityId), facilityId)
    : undefined;

  if (!scopedFacilityId) await assertPlatformRole(userId);

  const where = {
    ...(scopedFacilityId ? { facilityId: scopedFacilityId } : {}),
    ...(verificationStatus ? { verificationStatus } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.referenceRule.findMany({
      where,
      include: { facility: true, verifiedBy: true, approvedBy: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.referenceRule.count({ where }),
  ]);

  return { items, total, page, limit };
};

export const createReferenceRule = async (payload, userId, auditContext = {}) => {
  const facilityId = getReferenceFacilityId(payload);
  await assertReferenceGovernanceRole(userId, facilityId);
  return prisma.$transaction(async (tx) => {
    const createdAt = new Date();
    const rule = await tx.referenceRule.create({
      data: {
        ...payload,
        facilityId,
        verificationStatus: 'PENDING_REVIEW',
        verifiedByUserId: null,
        verifiedAt: null,
        approvedByUserId: null,
        governanceStatus: 'pending_review',
        auditTrailJson: [
          {
            action: 'created_pending_reference_review',
            actorUserId: userId,
            at: createdAt.toISOString(),
            note: 'Production reference additions require authorized review before decision-support use.',
          },
        ],
      },
    });
    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId,
      action: 'REFERENCE_RULE_CREATE',
      entityType: 'ReferenceRule',
      entityId: rule.id,
      afterJson: rule,
    });
    return rule;
  });
};

export const updateReferenceRule = async (id, payload, userId, auditContext = {}) => {
  const existing = await prisma.referenceRule.findUnique({ where: { id } });
  if (!existing) throw notFound('Reference rule not found');

  const facilityId = payload.scope === undefined
    ? existing.facilityId
    : getReferenceFacilityId({ ...existing, ...payload });
  await assertReferenceGovernanceRole(userId, facilityId);

  return prisma.$transaction(async (tx) => {
    const updatedAt = new Date();
    const updated = await tx.referenceRule.update({
      where: { id },
      data: stripUndefined({
        ...payload,
        facilityId,
        verificationStatus: 'PENDING_REVIEW',
        verifiedByUserId: null,
        verifiedAt: null,
        approvedByUserId: null,
        governanceStatus: 'pending_review',
        auditTrailJson: appendReferenceAuditTrail(existing.auditTrailJson, {
          action: 'edited_pending_reference_review',
          actorUserId: userId,
          at: updatedAt.toISOString(),
          note: payload.reviewNotes || 'Reference edit requires authorized review before decision-support use.',
        }),
      }),
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId,
      action: 'REFERENCE_RULE_UPDATE',
      entityType: 'ReferenceRule',
      entityId: id,
      beforeJson: existing,
      afterJson: updated,
      reason: payload.reviewNotes,
    });

    return updated;
  });
};

export const activateModelShadowMode = async (id, userId, auditContext = {}) => {
  await assertAnyApprovedRole(userId, MODEL_GOVERNANCE_ROLES, 'Model governance permission is required');
  const existing = await prisma.modelVersion.findUnique({ where: { id } });
  if (!existing) throw notFound('Model version not found');
  const modelCard = assertModelReadyForShadowMode(existing);
  return prisma.$transaction(async (tx) => {
    const model = await tx.modelVersion.update({
      where: { id },
      data: { approvalStatus: 'SHADOW_MODE', activatedAt: new Date() },
    });
    await writeAudit({
      tx,
      ...auditContext,
      userId,
      action: 'MODEL_ACTIVATE_SHADOW_MODE',
      entityType: 'ModelVersion',
      entityId: id,
      beforeJson: existing,
      afterJson: { ...model, modelCard },
    });
    return model;
  });
};

export const retireModel = async (id, userId, auditContext = {}) => {
  await assertAnyApprovedRole(userId, MODEL_GOVERNANCE_ROLES, 'Model governance permission is required');
  const existing = await prisma.modelVersion.findUnique({ where: { id } });
  if (!existing) throw notFound('Model version not found');
  return prisma.$transaction(async (tx) => {
    const model = await tx.modelVersion.update({
      where: { id },
      data: { approvalStatus: 'RETIRED', retiredAt: new Date() },
    });
    await writeAudit({
      tx,
      ...auditContext,
      userId,
      action: 'MODEL_RETIRE',
      entityType: 'ModelVersion',
      entityId: id,
      beforeJson: existing,
      afterJson: model,
    });
    return model;
  });
};

const assertModelPayloadHasNoIdentifiers = (payload, label) => {
  const identifierPaths = findIdentifierPaths(payload);
  if (identifierPaths.length > 0) {
    throw badRequest(`${label} cannot contain patient identifiers`, identifierPaths.map((path) => ({
      path,
      message: 'Remove identifier-like field before model processing',
    })));
  }
};

export const createShadowModelOutput = async (id, payload, userId, auditContext = {}) => {
  await assertAnyApprovedRole(userId, MODEL_GOVERNANCE_ROLES, 'Model governance permission is required');
  const model = await prisma.modelVersion.findUnique({ where: { id } });
  if (!model) throw notFound('Model version not found');
  if (model.approvalStatus !== 'SHADOW_MODE') {
    throw badRequest('Model outputs can only be recorded for shadow-mode model versions.');
  }

  assertModelPayloadHasNoIdentifiers(payload.inputSummaryJson, 'Model input summary');
  assertModelPayloadHasNoIdentifiers(payload.outputJson, 'Model output');

  let facilityId = payload.facilityId || null;
  if (payload.sourceAdmissionId) {
    const admission = await prisma.admission.findUnique({
      where: { id: payload.sourceAdmissionId },
      select: { id: true, facilityId: true },
    });
    if (!admission) throw notFound('Source admission not found');
    if (facilityId && facilityId !== admission.facilityId) throw notFound('Source admission not found');
    facilityId = admission.facilityId;
  }

  if (facilityId) await assertFacilityRole(userId, facilityId, READ_ROLES);

  const inputSummaryJson = deidentifyPayload(payload.inputSummaryJson);
  const outputJson = deidentifyPayload(payload.outputJson);

  return prisma.$transaction(async (tx) => {
    const modelOutput = await tx.modelOutput.create({
      data: stripUndefined({
        modelVersionId: id,
        facilityId,
        sourceAdmissionId: payload.sourceAdmissionId,
        inputSummaryJson,
        outputJson,
        visibleToClinicians: false,
      }),
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId,
      action: 'MODEL_OUTPUT_SHADOW_CREATE',
      entityType: 'ModelOutput',
      entityId: modelOutput.id,
      afterJson: {
        modelOutputId: modelOutput.id,
        modelVersionId: id,
        modelCard: buildModelCard(model),
        facilityId,
        sourceAdmissionId: payload.sourceAdmissionId || null,
        visibleToClinicians: false,
        externalModelServicesUsed: false,
      },
      reason: payload.reason || null,
    });

    return {
      modelOutput,
      modelCard: buildModelCard(model),
      visibility: {
        visibleToClinicians: false,
        liveClinicalPredictionEnabled: false,
      },
      privacy: 'Input and output payloads are de-identified and were not sent to external AI/model services.',
    };
  });
};
