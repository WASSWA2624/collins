import { prisma } from '../../config/prisma.js';
import { MEMBERSHIP_ROLES } from '../../constants/roles.js';
import {
  assertFacilityRole,
  hasPlatformRole,
} from '../../utils/authorization.js';
import { badRequest, forbidden } from '../../utils/errors.js';
import {
  ADMIN_DASHBOARD_ROLES,
  CLINICIAN_DASHBOARD_ROLES,
  DASHBOARD_WINDOW_MAX_DAYS,
  DATASET_QUEUE_STATUSES,
  GOVERNANCE_DASHBOARD_ROLES,
  REFERENCE_APPROVED_STATUSES,
  REFERENCE_RETIRED_STATUSES,
  REVIEW_BACKLOG_STATUSES,
  SYNC_ATTENTION_STATUSES,
} from './dashboards.constants.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const STATUS_UNKNOWN = 'UNSPECIFIED';

const startOfDay = (date) => new Date(Date.UTC(
  date.getUTCFullYear(),
  date.getUTCMonth(),
  date.getUTCDate(),
));
const addDays = (date, days) => new Date(date.getTime() + (days * MS_PER_DAY));

const formatDay = (date) => date.toISOString().slice(0, 10);

export const buildDashboardWindow = ({ from, to, days } = {}) => {
  const end = to ? startOfDay(new Date(to)) : startOfDay(new Date());
  const start = from ? startOfDay(new Date(from)) : addDays(end, -((days || 1) - 1));
  const toExclusive = addDays(end, 1);
  const spanDays = Math.ceil((toExclusive.getTime() - start.getTime()) / MS_PER_DAY);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw badRequest('Dashboard date range is invalid');
  }

  if (start >= toExclusive) {
    throw badRequest('Dashboard date range must start before it ends');
  }

  if (spanDays > DASHBOARD_WINDOW_MAX_DAYS) {
    throw badRequest(`Dashboard date range cannot exceed ${DASHBOARD_WINDOW_MAX_DAYS} days`);
  }

  return {
    from: start,
    to: end,
    toExclusive,
    days: Array.from({ length: spanDays }, (_, index) => addDays(start, index)),
  };
};

const dateFilter = (field, window) => ({
  [field]: {
    gte: window.from,
    lt: window.toExclusive,
  },
});

const normalizeStatusKey = (value) => value || STATUS_UNKNOWN;

const countByValues = async (client, model, field, values, baseWhere = {}) => {
  const entries = await Promise.all(values.map(async (value) => [
    value,
    await client[model].count({ where: { ...baseWhere, [field]: value } }),
  ]));
  return Object.fromEntries(entries);
};

const groupCountByField = async (client, model, field, where = {}) => {
  const rows = await client[model].groupBy({
    by: [field],
    where,
    _count: { _all: true },
  });

  return rows.reduce((summary, row) => ({
    ...summary,
    [normalizeStatusKey(row[field])]: row._count._all,
  }), {});
};

const dailyTrend = async (client, model, dateField, baseWhere, window) => Promise.all(
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

const getApprovedDashboardMemberships = (client, userId, allowedRoles) => client.facilityMembership.findMany({
  where: {
    userId,
    status: 'APPROVED',
    role: { in: allowedRoles.filter((role) => role !== MEMBERSHIP_ROLES.PLATFORM_ADMIN) },
  },
  select: {
    facilityId: true,
    role: true,
    facility: {
      select: {
        id: true,
        name: true,
        district: true,
        region: true,
        verificationStatus: true,
      },
    },
  },
});

const resolveRequiredFacilityScope = async (userId, requestedFacilityId, allowedRoles, client = prisma) => {
  if (requestedFacilityId) {
    await assertFacilityRole(userId, requestedFacilityId, allowedRoles);
    return requestedFacilityId;
  }

  const memberships = await getApprovedDashboardMemberships(client, userId, allowedRoles);
  const uniqueFacilityIds = [...new Set(memberships.map((membership) => membership.facilityId))];

  if (uniqueFacilityIds.length === 1) return uniqueFacilityIds[0];
  if (await hasPlatformRole(userId)) throw forbidden('facilityId is required for facility-scoped dashboards');
  throw forbidden('facilityId is required when the user has zero or multiple active facilities');
};

const resolveOptionalFacilityScope = async (userId, requestedFacilityId, allowedRoles, client = prisma) => {
  if (requestedFacilityId) {
    await assertFacilityRole(userId, requestedFacilityId, allowedRoles);
    return requestedFacilityId;
  }

  if (await hasPlatformRole(userId)) return undefined;

  const memberships = await getApprovedDashboardMemberships(client, userId, allowedRoles);
  const uniqueFacilityIds = [...new Set(memberships.map((membership) => membership.facilityId))];

  if (uniqueFacilityIds.length === 1) return uniqueFacilityIds[0];
  throw forbidden('facilityId is required when the user has zero or multiple active facilities');
};

const facilityMetadata = async (client, facilityId) => {
  if (!facilityId) return { scope: 'platform' };

  const facility = await client.facility.findUnique({
    where: { id: facilityId },
    select: {
      id: true,
      name: true,
      district: true,
      region: true,
      verificationStatus: true,
    },
  });

  return { scope: 'facility', facility };
};

const admissionFacilityWhere = (facilityId) => (facilityId ? { facilityId } : {});
const childAdmissionFacilityWhere = (facilityId) => (facilityId ? { admission: { facilityId } } : {});

const getVentilatedAdmissionCount = async (client, facilityId) => {
  const rows = await client.ventilatorSetting.groupBy({
    by: ['admissionId'],
    where: childAdmissionFacilityWhere(facilityId),
    _count: { admissionId: true },
  });
  return rows.length;
};

const getReviewBacklog = async (client, facilityId) => {
  const [admissions, abgTests, ventilatorSettings, datasetCases] = await Promise.all([
    countByValues(client, 'admission', 'reviewStatus', REVIEW_BACKLOG_STATUSES, admissionFacilityWhere(facilityId)),
    countByValues(client, 'abgTest', 'reviewStatus', REVIEW_BACKLOG_STATUSES, childAdmissionFacilityWhere(facilityId)),
    countByValues(client, 'ventilatorSetting', 'reviewStatus', REVIEW_BACKLOG_STATUSES, childAdmissionFacilityWhere(facilityId)),
    countByValues(client, 'datasetCase', 'reviewStatus', DATASET_QUEUE_STATUSES, facilityId ? { facilityId } : {}),
  ]);

  return {
    admissions,
    abgTests,
    ventilatorSettings,
    datasetCases,
  };
};

const getDatasetReadiness = async (client, facilityId) => {
  const where = facilityId ? { facilityId } : {};
  const exportEligibleWhere = {
    ...where,
    approvedForTraining: true,
    reviewStatus: 'APPROVED_FOR_TRAINING',
    ethicsApprovalId: { not: null },
    datasetVersion: { not: null },
  };

  const [
    total,
    statusCounts,
    approvedForTraining,
    exportEligible,
    missingGovernance,
    byDatasetVersion,
  ] = await Promise.all([
    client.datasetCase.count({ where }),
    groupCountByField(client, 'datasetCase', 'reviewStatus', where),
    client.datasetCase.count({ where: { ...where, approvedForTraining: true } }),
    client.datasetCase.count({ where: exportEligibleWhere }),
    client.datasetCase.count({
      where: {
        ...where,
        reviewStatus: 'APPROVED_FOR_TRAINING',
        OR: [
          { ethicsApprovalId: null },
          { datasetVersion: null },
        ],
      },
    }),
    groupCountByField(client, 'datasetCase', 'datasetVersion', where),
  ]);

  return {
    total,
    statusCounts,
    approvedForTraining,
    exportEligible,
    missingGovernance,
    byDatasetVersion,
    exportRule: 'Only de-identified, reviewed, ethics-approved records with dataset versions are export eligible.',
  };
};

const getSyncConflictSummary = async (client, facilityId, window) => {
  const where = {
    ...(facilityId ? { facilityId } : {}),
    status: { in: SYNC_ATTENTION_STATUSES },
  };

  const [total, byStatus, byOperation, trend] = await Promise.all([
    client.syncEvent.count({ where }),
    countByValues(client, 'syncEvent', 'status', SYNC_ATTENTION_STATUSES, facilityId ? { facilityId } : {}),
    groupCountByField(client, 'syncEvent', 'operation', where),
    dailyTrend(client, 'syncEvent', 'createdAt', where, window),
  ]);

  return {
    total,
    byStatus,
    byOperation,
    trend,
  };
};

const getOverrideSummary = async (client, facilityId, window) => {
  const reviewWhere = facilityId ? { facilityId } : {};
  const auditWhere = {
    ...(facilityId ? { facilityId } : {}),
    action: { contains: 'OVERRIDE' },
    ...dateFilter('createdAt', window),
  };

  const [
    auditedOverrides,
    correctionRequests,
    exclusions,
    reviewApprovals,
    auditedOverrideTrend,
  ] = await Promise.all([
    client.auditLog.count({ where: auditWhere }),
    client.reviewAction.count({ where: { ...reviewWhere, action: 'request_correction', ...dateFilter('createdAt', window) } }),
    client.reviewAction.count({ where: { ...reviewWhere, action: 'exclude', ...dateFilter('createdAt', window) } }),
    client.reviewAction.count({ where: { ...reviewWhere, action: 'approve', ...dateFilter('createdAt', window) } }),
    dailyTrend(client, 'auditLog', 'createdAt', auditWhere, window),
  ]);

  return {
    auditedOverrides,
    correctionRequests,
    exclusions,
    reviewApprovals,
    auditedOverrideTrend,
    source: 'AuditLog override actions and ReviewAction correction, exclusion, and approval records.',
  };
};

const getReferenceGovernance = async (client, window) => {
  const now = new Date();
  const activeWindow = {
    OR: [{ activeFrom: null }, { activeFrom: { lte: now } }],
    AND: [{ OR: [{ activeTo: null }, { activeTo: { gte: now } }] }],
  };
  const retiredWhere = {
    OR: [
      { activeTo: { lt: now } },
      { governanceStatus: { in: REFERENCE_RETIRED_STATUSES } },
    ],
  };
  const backlogWhere = {
    AND: [
      { NOT: retiredWhere },
      {
        OR: [
          { approvedByUserId: null },
          { governanceStatus: null },
          { governanceStatus: { notIn: REFERENCE_APPROVED_STATUSES } },
        ],
      },
    ],
  };
  const activeWhere = {
    ...activeWindow,
    approvedByUserId: { not: null },
    governanceStatus: { in: REFERENCE_APPROVED_STATUSES },
  };

  const [
    verificationBacklog,
    activeVersions,
    retiredVersions,
    byGovernanceStatus,
    auditSummary,
    auditTrend,
  ] = await Promise.all([
    client.referenceRule.count({ where: backlogWhere }),
    client.referenceRule.count({ where: activeWhere }),
    client.referenceRule.count({ where: retiredWhere }),
    groupCountByField(client, 'referenceRule', 'governanceStatus', {}),
    groupCountByField(client, 'auditLog', 'action', { entityType: 'ReferenceRule', ...dateFilter('createdAt', window) }),
    dailyTrend(client, 'auditLog', 'createdAt', { entityType: 'ReferenceRule' }, window),
  ]);

  return {
    verificationBacklog,
    activeVersions,
    retiredVersions,
    byGovernanceStatus,
    auditSummary,
    auditTrend,
    safetyStatement: 'Reference ranges are summarized as governed versions; dashboard responses do not create clinical orders.',
  };
};

const getModelGovernance = async (client, facilityId, window) => {
  const outputWhere = {
    ...(facilityId ? { facilityId } : {}),
    visibleToClinicians: false,
  };

  const [
    byApprovalStatus,
    shadowOutputs,
    outputsInWindow,
    modelsMissingReadinessMetadata,
    outputTrend,
  ] = await Promise.all([
    groupCountByField(client, 'modelVersion', 'approvalStatus', {}),
    client.modelOutput.count({ where: outputWhere }),
    client.modelOutput.count({ where: { ...outputWhere, ...dateFilter('createdAt', window) } }),
    client.modelVersion.count({
      where: {
        approvalStatus: { not: 'RETIRED' },
        OR: [
          { trainingDatasetVersion: null },
          { intendedUse: null },
          { performanceSummaryJson: null },
          { calibrationSummaryJson: null },
          { biasAssessmentJson: null },
        ],
      },
    }),
    dailyTrend(client, 'modelOutput', 'createdAt', outputWhere, window),
  ]);

  return {
    byApprovalStatus,
    shadowOutputs,
    outputsInWindow,
    modelsMissingReadinessMetadata,
    outputTrend,
    liveClinicalPredictionEnabled: false,
    driftMetricSource: 'Shadow model output counts are available; no live clinical drift table is exposed.',
    safetyStatement: 'Model outputs remain hidden from normal clinicians.',
  };
};

const getAuditSummary = async (client, facilityId, window) => {
  const where = {
    ...(facilityId ? { facilityId } : {}),
    ...dateFilter('createdAt', window),
  };

  const [total, byAction, byEntityType, trend] = await Promise.all([
    client.auditLog.count({ where }),
    groupCountByField(client, 'auditLog', 'action', where),
    groupCountByField(client, 'auditLog', 'entityType', where),
    dailyTrend(client, 'auditLog', 'createdAt', where, window),
  ]);

  return {
    total,
    byAction,
    byEntityType,
    trend,
  };
};

const getOperationalCounts = async (client, facilityId) => {
  const admissionWhere = admissionFacilityWhere(facilityId);
  const facilityWhere = facilityId ? { id: facilityId } : {};
  const activeUserWhere = facilityId
    ? { status: 'ACTIVE', facilityMemberships: { some: { facilityId, status: 'APPROVED' } } }
    : { status: 'ACTIVE' };

  const [
    totalFacilities,
    pendingFacilityVerification,
    activeUsers,
    activeAdmissions,
    ventilatedPatients,
    abgsPendingReview,
    datasetReviewQueue,
    syncAttention,
    referenceRules,
    modelVersions,
  ] = await Promise.all([
    facilityId ? 1 : client.facility.count({ where: facilityWhere }),
    facilityId ? 0 : client.facility.count({ where: { verificationStatus: 'PENDING' } }),
    client.user.count({ where: activeUserWhere }),
    client.admission.count({ where: { ...admissionWhere, status: 'ACTIVE' } }),
    getVentilatedAdmissionCount(client, facilityId),
    client.abgTest.count({ where: { reviewStatus: 'PENDING', ...childAdmissionFacilityWhere(facilityId) } }),
    client.datasetCase.count({ where: { ...(facilityId ? { facilityId } : {}), reviewStatus: { in: DATASET_QUEUE_STATUSES } } }),
    client.syncEvent.count({ where: { ...(facilityId ? { facilityId } : {}), status: { in: SYNC_ATTENTION_STATUSES } } }),
    client.referenceRule.count(),
    client.modelVersion.count(),
  ]);

  return {
    totalFacilities,
    pendingFacilityVerification,
    activeUsers,
    activeAdmissions,
    ventilatedPatients,
    abgsPendingReview,
    datasetReviewQueue,
    syncAttention,
    referenceRules,
    modelVersions,
  };
};

const getClinicianWorkload = async (client, facilityId, window) => {
  const today = startOfDay(new Date());
  const admissionWhere = admissionFacilityWhere(facilityId);
  const activeAdmissionWhere = { ...admissionWhere, status: 'ACTIVE' };

  const [
    activeAdmissions,
    newAdmissions,
    pendingDailyReviews,
    recentAbgTests,
    recentVentilatorUpdates,
    reviewBacklog,
    admissionTrend,
    abgTrend,
    ventilatorTrend,
  ] = await Promise.all([
    client.admission.count({ where: activeAdmissionWhere }),
    client.admission.count({ where: { ...admissionWhere, ...dateFilter('createdAt', window) } }),
    client.admission.count({
      where: {
        ...activeAdmissionWhere,
        dailyReviews: { none: { reviewDate: { gte: today } } },
      },
    }),
    client.abgTest.count({ where: { ...childAdmissionFacilityWhere(facilityId), ...dateFilter('createdAt', window) } }),
    client.ventilatorSetting.count({ where: { ...childAdmissionFacilityWhere(facilityId), ...dateFilter('createdAt', window) } }),
    getReviewBacklog(client, facilityId),
    dailyTrend(client, 'admission', 'createdAt', admissionWhere, window),
    dailyTrend(client, 'abgTest', 'createdAt', childAdmissionFacilityWhere(facilityId), window),
    dailyTrend(client, 'ventilatorSetting', 'createdAt', childAdmissionFacilityWhere(facilityId), window),
  ]);

  return {
    counts: {
      activeAdmissions,
      newAdmissions,
      pendingDailyReviews,
      recentAbgTests,
      recentVentilatorUpdates,
    },
    reviewBacklog,
    trends: {
      admissions: admissionTrend,
      abgTests: abgTrend,
      ventilatorSettings: ventilatorTrend,
    },
  };
};

export const getClinicalDashboard = async (userId, query = {}, client = prisma) => {
  const window = buildDashboardWindow(query);
  const facilityId = await resolveRequiredFacilityScope(userId, query.facilityId, CLINICIAN_DASHBOARD_ROLES, client);
  const [scope, workload, syncConflicts] = await Promise.all([
    facilityMetadata(client, facilityId),
    getClinicianWorkload(client, facilityId, window),
    getSyncConflictSummary(client, facilityId, window),
  ]);

  return {
    dashboard: 'clinical',
    scope,
    window: { from: window.from, to: window.to },
    workload,
    syncConflicts,
    visibility: {
      modelGovernanceIncluded: false,
      governanceDashboardIncluded: false,
    },
    safetyStatement: 'Clinician dashboard metrics are workload and review aggregates only; no predictive model output is included.',
    privacy: 'Aggregate dashboard only; patient identifiers are not included.',
  };
};

export const getOperationalDashboard = async (userId, query = {}, client = prisma) => {
  const window = buildDashboardWindow(query);
  const facilityId = await resolveOptionalFacilityScope(userId, query.facilityId, ADMIN_DASHBOARD_ROLES, client);
  const [
    scope,
    counts,
    reviewBacklog,
    datasetReadiness,
    syncConflicts,
    overrides,
    referenceGovernance,
    modelGovernance,
    auditSummary,
    admissionTrend,
    datasetTrend,
  ] = await Promise.all([
    facilityMetadata(client, facilityId),
    getOperationalCounts(client, facilityId),
    getReviewBacklog(client, facilityId),
    getDatasetReadiness(client, facilityId),
    getSyncConflictSummary(client, facilityId, window),
    getOverrideSummary(client, facilityId, window),
    getReferenceGovernance(client, window),
    getModelGovernance(client, facilityId, window),
    getAuditSummary(client, facilityId, window),
    dailyTrend(client, 'admission', 'createdAt', admissionFacilityWhere(facilityId), window),
    dailyTrend(client, 'datasetCase', 'createdAt', facilityId ? { facilityId } : {}, window),
  ]);

  return {
    dashboard: 'operational',
    scope,
    window: { from: window.from, to: window.to },
    counts,
    trends: {
      admissions: admissionTrend,
      datasetCases: datasetTrend,
      syncAttention: syncConflicts.trend,
    },
    reviewBacklog,
    syncConflicts,
    datasetReadiness,
    overrides,
    referenceGovernance,
    modelGovernance,
    auditSummary,
    privacy: 'Aggregate dashboard only; patient identifiers are not included.',
  };
};

export const getGovernanceDashboard = async (userId, query = {}, client = prisma) => {
  const window = buildDashboardWindow(query);
  const facilityId = await resolveOptionalFacilityScope(userId, query.facilityId, GOVERNANCE_DASHBOARD_ROLES, client);
  const [
    scope,
    datasetReadiness,
    referenceGovernance,
    modelGovernance,
    auditSummary,
    overrides,
    syncConflicts,
  ] = await Promise.all([
    facilityMetadata(client, facilityId),
    getDatasetReadiness(client, facilityId),
    getReferenceGovernance(client, window),
    getModelGovernance(client, facilityId, window),
    getAuditSummary(client, facilityId, window),
    getOverrideSummary(client, facilityId, window),
    getSyncConflictSummary(client, facilityId, window),
  ]);

  return {
    dashboard: 'governance',
    scope,
    window: { from: window.from, to: window.to },
    datasetReadiness,
    referenceGovernance,
    modelGovernance,
    auditSummary,
    overrides,
    syncConflicts,
    privacy: 'Aggregate governance dashboard only; patient identifiers are not included.',
  };
};
