import { prisma } from '../../config/prisma.js';
import { MEMBERSHIP_ROLES, MEMBERSHIP_ROLE_VALUES, getPermissionsForRoles } from '../../constants/roles.js';
import {
  DATASET_EXPORT_ROLES,
  FACILITY_ADMIN_ROLES,
  MODEL_GOVERNANCE_ROLES,
  READ_ROLES,
  REVIEW_ROLES,
  assertAnyApprovedRole,
  assertFacilityRole,
  assertPlatformRole,
  hasPlatformRole,
  resolveFacilityScope,
} from '../../utils/authorization.js';
import { notFound, badRequest, conflict, forbidden } from '../../utils/errors.js';
import { writeAudit } from '../../utils/audit.js';
import { stripUndefined } from '../../utils/object.js';
import { hashPassword } from '../../utils/password.js';
import { deidentifyPayload, findIdentifierPaths } from '../../utils/deidentify.js';
import { buildDashboardWindow, getOperationalDashboard } from '../dashboards/dashboards.service.js';
import { createInitialOnboardingState } from '../onboarding/onboarding.service.js';

export const getAdminDashboard = getOperationalDashboard;

const GOVERNANCE_MONITORING_ROLES = Object.freeze([
  ...new Set([
    ...FACILITY_ADMIN_ROLES,
    ...DATASET_EXPORT_ROLES,
    ...MODEL_GOVERNANCE_ROLES,
  ]),
]);

const addDays = (date, days) => new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));

const USER_MANAGEMENT_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
]);

const CLINICAL_CAPTURE_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.CLINICIAN,
  MEMBERSHIP_ROLES.ICU_NURSE,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
]);

const CLINICAL_VALIDATE_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
  MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
]);

const managedUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  facilityMemberships: {
    select: {
      id: true,
      facilityId: true,
      role: true,
      status: true,
      approvedByUserId: true,
      createdAt: true,
      updatedAt: true,
      facility: {
        select: {
          id: true,
          name: true,
          registryCode: true,
          district: true,
          region: true,
          verificationStatus: true,
        },
      },
      approvedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: [{ facility: { name: 'asc' } }, { role: 'asc' }],
  },
};

const serializeManagedMembership = (membership) => ({
  id: membership.id,
  facilityId: membership.facilityId,
  role: membership.role,
  status: membership.status,
  permissions: getPermissionsForRoles([membership.role]),
  approvedByUserId: membership.approvedByUserId || null,
  approvedBy: membership.approvedBy || null,
  facility: membership.facility || null,
  createdAt: membership.createdAt,
  updatedAt: membership.updatedAt,
});

const serializeManagedUser = (user) => {
  const memberships = (user.facilityMemberships || []).map(serializeManagedMembership);
  const approvedRoles = memberships
    .filter((membership) => membership.status === 'APPROVED')
    .map((membership) => membership.role);
  const approvedRoleSet = new Set(approvedRoles);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    memberships,
    capabilities: {
      canCaptureData: CLINICAL_CAPTURE_ROLES.some((role) => approvedRoleSet.has(role)),
      canValidateData: CLINICAL_VALIDATE_ROLES.some((role) => approvedRoleSet.has(role)),
      canManageUsers: USER_MANAGEMENT_ROLES.some((role) => approvedRoleSet.has(role)),
    },
  };
};

const getManagedFacilityIds = async (userId) => {
  if (await hasPlatformRole(userId)) return null;

  const memberships = await prisma.facilityMembership.findMany({
    where: {
      userId,
      status: 'APPROVED',
      role: MEMBERSHIP_ROLES.FACILITY_ADMIN,
    },
    select: { facilityId: true },
  });
  const facilityIds = [...new Set(memberships.map((membership) => membership.facilityId))];
  if (facilityIds.length === 0) throw forbidden('User management requires administrator permission');
  return facilityIds;
};

const assertCanManageMembership = async (adminUserId, { facilityId, role }) => {
  if (!MEMBERSHIP_ROLE_VALUES.includes(role)) throw badRequest('Unsupported membership role');
  if (role === MEMBERSHIP_ROLES.PLATFORM_ADMIN) {
    await assertPlatformRole(adminUserId);
    return;
  }
  await assertFacilityRole(adminUserId, facilityId, FACILITY_ADMIN_ROLES);
};

const userSearchWhere = ({ q, facilityQ, facilityId, role, status }, managedFacilityIds) => {
  const terms = String(q || '').trim();
  const facilityTerms = String(facilityQ || '').trim();
  const scopedFacilityIds = managedFacilityIds
    ? managedFacilityIds.filter((id) => !facilityId || id === facilityId)
    : (facilityId ? [facilityId] : null);

  if (managedFacilityIds && facilityId && !managedFacilityIds.includes(facilityId)) {
    throw forbidden('You do not have permission for this facility');
  }

  return {
    ...(status ? { status } : {}),
    ...(terms ? {
      OR: [
        { name: { contains: terms } },
        { email: { contains: terms } },
        { phone: { contains: terms } },
      ],
    } : {}),
    ...((scopedFacilityIds || facilityTerms || role) ? {
      facilityMemberships: {
        some: {
          ...(scopedFacilityIds ? { facilityId: { in: scopedFacilityIds } } : {}),
          ...(role ? { role } : {}),
          ...(facilityTerms ? {
            facility: {
              OR: [
                { name: { contains: facilityTerms } },
                { registryCode: { contains: facilityTerms } },
                { district: { contains: facilityTerms } },
                { region: { contains: facilityTerms } },
              ],
            },
          } : {}),
        },
      },
    } : {}),
  };
};

const dateFilter = (field, window) => ({
  [field]: {
    gte: window.from,
    lt: window.toExclusive,
  },
});

const formatDay = (date) => date.toISOString().slice(0, 10);

const dailyCountTrend = async (client, model, dateField, baseWhere, window) => Promise.all(
  window.days.map(async (day) => ({
    date: formatDay(day),
    count: await client[model].count({
      where: {
        ...baseWhere,
        [dateField]: {
          gte: day,
          lt: addDays(day, 1),
        },
      },
    }),
  })),
);

const groupCountByField = async (client, model, field, where = {}) => {
  const rows = await client[model].groupBy({
    by: [field],
    where,
    _count: { _all: true },
  });

  return rows.reduce((summary, row) => ({
    ...summary,
    [row[field] || 'UNSPECIFIED']: row._count._all,
  }), {});
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

export const listManagedUsers = async (userId, query = {}) => {
  const managedFacilityIds = await getManagedFacilityIds(userId);
  const where = userSearchWhere(query, managedFacilityIds);
  const page = query.page || 1;
  const limit = query.limit || 20;

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: managedUserSelect,
      orderBy: [{ name: 'asc' }, { email: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items: items.map(serializeManagedUser),
    total,
    page,
    limit,
  };
};

export const createManagedUser = async (adminUserId, payload, auditContext = {}) => {
  const memberships = payload.memberships || [];
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) throw conflict('A user with this email already exists');

  for (const membership of memberships) {
    await assertCanManageMembership(adminUserId, membership);
  }
  if (memberships.length === 0) await assertAnyApprovedRole(adminUserId, USER_MANAGEMENT_ROLES, 'User management requires administrator permission');

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        passwordHash: await hashPassword(payload.password),
        status: payload.status || 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const createdMemberships = [];
    for (const membership of memberships) {
      const created = await tx.facilityMembership.create({
        data: {
          userId: user.id,
          facilityId: membership.facilityId,
          role: membership.role,
          status: membership.status || 'APPROVED',
          approvedByUserId: (membership.status || 'APPROVED') === 'APPROVED' ? adminUserId : null,
        },
      });
      createdMemberships.push(created);
      await writeAudit({
        tx,
        ...auditContext,
        userId: adminUserId,
        facilityId: membership.facilityId,
        action: 'ADMIN_USER_MEMBERSHIP_CREATE',
        entityType: 'FacilityMembership',
        entityId: created.id,
        afterJson: {
          targetUserId: user.id,
          role: created.role,
          status: created.status,
          approvedByUserId: created.approvedByUserId,
        },
      });
    }

    await createInitialOnboardingState(tx, user.id, {
      ...(createdMemberships[0] ? {
        selectedFacilityId: createdMemberships[0].facilityId,
        requestedRole: createdMemberships[0].role,
      } : {}),
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId: adminUserId,
      action: 'ADMIN_USER_CREATE',
      entityType: 'User',
      entityId: user.id,
      afterJson: {
        id: user.id,
        email: user.email,
        membershipCount: createdMemberships.length,
      },
    });

    const createdUser = await tx.user.findUnique({ where: { id: user.id }, select: managedUserSelect });
    return serializeManagedUser(createdUser);
  });
};

export const assignManagedUserMemberships = async (targetUserId, payload, adminUserId, auditContext = {}) => {
  const roles = [...new Set(payload.roles || [])];
  if (roles.length === 0) throw badRequest('At least one role is required');

  for (const role of roles) {
    await assertCanManageMembership(adminUserId, { facilityId: payload.facilityId, role });
  }

  return prisma.$transaction(async (tx) => {
    const [targetUser, facility] = await Promise.all([
      tx.user.findUnique({ where: { id: targetUserId }, select: { id: true, email: true, name: true } }),
      tx.facility.findUnique({ where: { id: payload.facilityId }, select: { id: true, name: true } }),
    ]);
    if (!targetUser) throw notFound('User not found');
    if (!facility) throw notFound('Facility not found');

    const savedMemberships = [];
    for (const role of roles) {
      const before = await tx.facilityMembership.findUnique({
        where: {
          userId_facilityId_role: {
            userId: targetUserId,
            facilityId: payload.facilityId,
            role,
          },
        },
      });
      const membership = await tx.facilityMembership.upsert({
        where: {
          userId_facilityId_role: {
            userId: targetUserId,
            facilityId: payload.facilityId,
            role,
          },
        },
        update: {
          status: payload.status,
          approvedByUserId: payload.status === 'APPROVED' ? adminUserId : null,
        },
        create: {
          userId: targetUserId,
          facilityId: payload.facilityId,
          role,
          status: payload.status,
          approvedByUserId: payload.status === 'APPROVED' ? adminUserId : null,
        },
      });
      savedMemberships.push(membership);
      await writeAudit({
        tx,
        ...auditContext,
        userId: adminUserId,
        facilityId: payload.facilityId,
        action: before ? 'ADMIN_USER_MEMBERSHIP_UPDATE' : 'ADMIN_USER_MEMBERSHIP_CREATE',
        entityType: 'FacilityMembership',
        entityId: membership.id,
        beforeJson: before ? { role: before.role, status: before.status, approvedByUserId: before.approvedByUserId } : null,
        afterJson: {
          targetUserId,
          role: membership.role,
          status: membership.status,
          approvedByUserId: membership.approvedByUserId,
        },
        reason: payload.reason,
      });
    }

    const user = await tx.user.findUnique({ where: { id: targetUserId }, select: managedUserSelect });
    return {
      user: serializeManagedUser(user),
      memberships: savedMemberships,
    };
  });
};

export const updateManagedUserMembership = async (targetUserId, membershipId, payload, adminUserId, auditContext = {}) => {
  const existing = await prisma.facilityMembership.findFirst({
    where: { id: membershipId, userId: targetUserId },
  });
  if (!existing) throw notFound('Membership not found');

  await assertCanManageMembership(adminUserId, {
    facilityId: existing.facilityId,
    role: payload.role || existing.role,
  });

  return prisma.$transaction(async (tx) => {
    const updated = await tx.facilityMembership.update({
      where: { id: membershipId },
      data: {
        ...(payload.role ? { role: payload.role } : {}),
        ...(payload.status ? { status: payload.status } : {}),
        approvedByUserId: (payload.status || existing.status) === 'APPROVED' ? adminUserId : null,
      },
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId: adminUserId,
      facilityId: updated.facilityId,
      action: 'ADMIN_USER_MEMBERSHIP_UPDATE',
      entityType: 'FacilityMembership',
      entityId: updated.id,
      beforeJson: { role: existing.role, status: existing.status, approvedByUserId: existing.approvedByUserId },
      afterJson: {
        targetUserId,
        role: updated.role,
        status: updated.status,
        approvedByUserId: updated.approvedByUserId,
      },
      reason: payload.reason,
    });

    const user = await tx.user.findUnique({ where: { id: targetUserId }, select: managedUserSelect });
    return {
      user: serializeManagedUser(user),
      membership: updated,
    };
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

export const listModelCards = async (userId) => {
  await assertAnyApprovedRole(userId, MODEL_GOVERNANCE_ROLES, 'Model governance permission is required');
  const versions = await prisma.modelVersion.findMany({ orderBy: { createdAt: 'desc' } });
  return {
    modelCards: versions.map(buildModelCard),
    visibility: {
      liveClinicalPredictionEnabled: false,
      clinicianVisibleOutputsAllowed: false,
      externalModelServicesAllowed: false,
    },
  };
};

export const getModelCard = async (id, userId) => {
  await assertAnyApprovedRole(userId, MODEL_GOVERNANCE_ROLES, 'Model governance permission is required');
  const model = await prisma.modelVersion.findUnique({ where: { id } });
  if (!model) throw notFound('Model version not found');
  return {
    modelCard: buildModelCard(model),
    visibility: {
      liveClinicalPredictionEnabled: false,
      clinicianVisibleOutputsAllowed: false,
      externalModelServicesAllowed: false,
    },
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

export const getModelDriftMonitoring = async (userId, query = {}) => {
  await assertAnyApprovedRole(userId, MODEL_GOVERNANCE_ROLES, 'Model governance permission is required');
  const facilityId = await resolveFacilityScope(userId, query.facilityId, MODEL_GOVERNANCE_ROLES);
  const window = buildDashboardWindow(query);
  const shadowWhere = {
    ...(facilityId ? { facilityId } : {}),
    visibleToClinicians: false,
  };
  const windowWhere = {
    ...shadowWhere,
    ...dateFilter('createdAt', window),
  };

  const [
    shadowOutputs,
    outputsInWindow,
    outputsByModelVersion,
    outputsByFacility,
    trend,
    clinicianVisibleOutputs,
  ] = await Promise.all([
    prisma.modelOutput.count({ where: shadowWhere }),
    prisma.modelOutput.count({ where: windowWhere }),
    groupCountByField(prisma, 'modelOutput', 'modelVersionId', shadowWhere),
    groupCountByField(prisma, 'modelOutput', 'facilityId', shadowWhere),
    dailyCountTrend(prisma, 'modelOutput', 'createdAt', shadowWhere, window),
    prisma.modelOutput.count({
      where: {
        ...(facilityId ? { facilityId } : {}),
        visibleToClinicians: true,
      },
    }),
  ]);

  return {
    scope: facilityId ? { scope: 'facility', facilityId } : { scope: 'platform' },
    window: { from: window.from, to: window.to },
    source: 'shadow_model_outputs',
    shadowOutputs,
    outputsInWindow,
    outputsByModelVersion,
    outputsByFacility,
    trend,
    driftSignals: {
      liveClinicalDriftMonitoringEnabled: false,
      externalModelServicesUsed: false,
      clinicianVisibleOutputCount: clinicianVisibleOutputs,
    },
    safetyStatement: 'Drift monitoring uses shadow-mode aggregate output counts only; outputs remain hidden from clinicians.',
    privacy: 'Aggregate monitoring only; patient identifiers and raw model inputs are not included.',
  };
};

export const getOverrideMonitoring = async (userId, query = {}) => {
  const facilityId = await resolveFacilityScope(userId, query.facilityId, GOVERNANCE_MONITORING_ROLES);
  const window = buildDashboardWindow(query);
  const scopedWhere = facilityId ? { facilityId } : {};
  const reviewWindowWhere = {
    ...scopedWhere,
    ...dateFilter('createdAt', window),
  };
  const auditOverrideWhere = {
    ...scopedWhere,
    action: { contains: 'OVERRIDE' },
    ...dateFilter('createdAt', window),
  };

  const [
    auditedOverrides,
    reviewedOverrides,
    correctionRequests,
    exclusions,
    byReviewAction,
    auditedOverrideTrend,
  ] = await Promise.all([
    prisma.auditLog.count({ where: auditOverrideWhere }),
    prisma.reviewAction.count({
      where: {
        ...reviewWindowWhere,
        overrideReason: { not: null },
      },
    }),
    prisma.reviewAction.count({ where: { ...reviewWindowWhere, action: 'request_correction' } }),
    prisma.reviewAction.count({ where: { ...reviewWindowWhere, action: 'exclude' } }),
    groupCountByField(prisma, 'reviewAction', 'action', reviewWindowWhere),
    dailyCountTrend(prisma, 'auditLog', 'createdAt', auditOverrideWhere, window),
  ]);

  return {
    scope: facilityId ? { scope: 'facility', facilityId } : { scope: 'platform' },
    window: { from: window.from, to: window.to },
    auditedOverrides,
    reviewedOverrides,
    correctionRequests,
    exclusions,
    byReviewAction,
    auditedOverrideTrend,
    source: 'ReviewAction override reasons and AuditLog override actions.',
    safetyStatement: 'Override monitoring is governance-only and does not expose patient identifiers.',
    privacy: 'Aggregate monitoring only; patient identifiers are not included.',
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

const updateReferenceLifecycle = async ({
  id,
  payload = {},
  userId,
  auditContext = {},
  data,
  auditAction,
  trailAction,
  defaultNote,
}) => {
  const existing = await prisma.referenceRule.findUnique({ where: { id } });
  if (!existing) throw notFound('Reference rule not found');
  await assertReferenceGovernanceRole(userId, existing.facilityId);

  return prisma.$transaction(async (tx) => {
    const updatedAt = new Date();
    const updated = await tx.referenceRule.update({
      where: { id },
      data: stripUndefined({
        ...data,
        reviewNotes: payload.reviewNotes,
        auditTrailJson: appendReferenceAuditTrail(existing.auditTrailJson, {
          action: trailAction,
          actorUserId: userId,
          at: updatedAt.toISOString(),
          note: payload.reviewNotes || defaultNote,
        }),
      }),
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: existing.facilityId,
      action: auditAction,
      entityType: 'ReferenceRule',
      entityId: id,
      beforeJson: existing,
      afterJson: updated,
      reason: payload.reviewNotes || payload.reason,
    });

    return updated;
  });
};

export const verifyReferenceRule = async (id, payload = {}, userId, auditContext = {}) => {
  const verifiedAt = new Date();
  return updateReferenceLifecycle({
    id,
    payload,
    userId,
    auditContext,
    data: {
      verificationStatus: 'VERIFIED',
      governanceStatus: payload.governanceStatus || 'verified',
      verifiedByUserId: userId,
      approvedByUserId: userId,
      verifiedAt,
      activeFrom: payload.activeFrom || verifiedAt,
      activeTo: payload.activeTo,
    },
    auditAction: 'REFERENCE_RULE_VERIFY',
    trailAction: 'verified_reference_rule',
    defaultNote: 'Reference rule verified for active decision-support lookup.',
  });
};

export const requestReferenceCorrection = async (id, payload = {}, userId, auditContext = {}) => (
  updateReferenceLifecycle({
    id,
    payload,
    userId,
    auditContext,
    data: {
      verificationStatus: 'CORRECTION_REQUESTED',
      governanceStatus: 'correction_requested',
      verifiedByUserId: null,
      approvedByUserId: null,
      verifiedAt: null,
    },
    auditAction: 'REFERENCE_RULE_CORRECTION_REQUESTED',
    trailAction: 'reference_correction_requested',
    defaultNote: 'Reference rule correction requested before decision-support use.',
  })
);

export const retireReferenceRule = async (id, payload = {}, userId, auditContext = {}) => {
  const retiredAt = payload.activeTo || new Date();
  return updateReferenceLifecycle({
    id,
    payload,
    userId,
    auditContext,
    data: {
      verificationStatus: 'RETIRED',
      governanceStatus: 'retired',
      activeTo: retiredAt,
    },
    auditAction: 'REFERENCE_RULE_RETIRE',
    trailAction: 'retired_reference_rule',
    defaultNote: 'Reference rule retired from active decision-support lookup.',
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
