import { prisma } from '../../config/prisma.js';
import { assertFacilityRole, assertPlatformRole, FACILITY_ADMIN_ROLES, resolveFacilityScope } from '../../utils/authorization.js';
import { notFound, badRequest } from '../../utils/errors.js';
import { writeAudit } from '../../utils/audit.js';

export const getAdminDashboard = async (userId, { facilityId } = {}) => {
  const scopedFacilityId = facilityId
    ? (await assertFacilityRole(userId, facilityId, FACILITY_ADMIN_ROLES), facilityId)
    : undefined;

  if (!scopedFacilityId) await assertPlatformRole(userId);

  const admissionWhere = scopedFacilityId ? { facilityId: scopedFacilityId } : {};
  const [
    totalFacilities,
    pendingFacilityVerification,
    activeUsers,
    activeAdmissions,
    ventilatedPatients,
    abgsPendingReview,
    datasetReviewQueue,
    syncFailures,
    referenceRules,
    modelVersions,
  ] = await Promise.all([
    scopedFacilityId ? 1 : prisma.facility.count(),
    scopedFacilityId ? 0 : prisma.facility.count({ where: { verificationStatus: 'PENDING' } }),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.admission.count({ where: { ...admissionWhere, status: 'ACTIVE' } }),
    prisma.ventilatorSetting.count({ where: scopedFacilityId ? { admission: { facilityId: scopedFacilityId } } : {} }),
    prisma.abgTest.count({ where: { reviewStatus: 'PENDING', ...(scopedFacilityId ? { admission: { facilityId: scopedFacilityId } } : {}) } }),
    prisma.datasetCase.count({ where: { ...(scopedFacilityId ? { facilityId: scopedFacilityId } : {}), reviewStatus: { in: ['SUBMITTED', 'NEEDS_CORRECTION', 'REVIEWED', 'APPROVED_FOR_DATASET'] } } }),
    prisma.syncEvent.count({ where: { ...(scopedFacilityId ? { facilityId: scopedFacilityId } : {}), status: { in: ['CONFLICT', 'FAILED', 'FAILED_VALIDATION', 'NEEDS_REVIEW'] } } }),
    prisma.referenceRule.count(),
    prisma.modelVersion.count(),
  ]);

  return {
    totalFacilities,
    pendingFacilityVerification,
    activeUsers,
    activeAdmissions,
    ventilatedPatients,
    abgsPendingReview,
    datasetReviewQueue,
    syncFailures,
    referenceRules,
    modelVersions,
    privacy: 'Aggregate dashboard only; patient identifiers are not included.',
  };
};

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
  const scopedFacilityId = await resolveFacilityScope(userId, facilityId, FACILITY_ADMIN_ROLES);
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

export const getModelMonitoring = async (userId) => {
  await assertPlatformRole(userId);
  const [versions, shadowOutputs] = await Promise.all([
    prisma.modelVersion.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.modelOutput.count({ where: { visibleToClinicians: false } }),
  ]);
  return {
    versions,
    shadowOutputs,
    liveClinicalPredictionEnabled: false,
    safetyStatement: 'Shadow-mode outputs are admin/research only and hidden from clinical users.',
  };
};

export const createReferenceRule = async (payload, userId, auditContext = {}) => {
  await assertPlatformRole(userId);
  return prisma.$transaction(async (tx) => {
    const rule = await tx.referenceRule.create({
      data: { ...payload, approvedByUserId: userId },
    });
    await writeAudit({
      tx,
      ...auditContext,
      userId,
      action: 'REFERENCE_RULE_CREATE',
      entityType: 'ReferenceRule',
      entityId: rule.id,
      afterJson: rule,
    });
    return rule;
  });
};

export const activateModelShadowMode = async (id, userId, auditContext = {}) => {
  await assertPlatformRole(userId);
  const existing = await prisma.modelVersion.findUnique({ where: { id } });
  if (!existing) throw notFound('Model version not found');
  if (!existing.intendedUse || !existing.trainingDatasetVersion) {
    throw badRequest('Model card metadata and training dataset version are required before shadow mode.');
  }
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
      afterJson: model,
    });
    return model;
  });
};

export const retireModel = async (id, userId, auditContext = {}) => {
  await assertPlatformRole(userId);
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
