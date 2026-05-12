import { prisma } from '../../config/prisma.js';
import { MEMBERSHIP_ROLES } from '../../constants/roles.js';
import { READ_ROLES, assertFacilityRole, requireUserId } from '../../utils/authorization.js';
import { forbidden, notFound } from '../../utils/errors.js';
import {
  buildAvailableFacilities,
  buildFacilitySelectionHomeSummary,
  buildScopedHomeSummary,
  canSeeReviewCounts,
} from './home.presenter.js';

const facilitySelect = {
  id: true,
  registryCode: true,
  name: true,
  district: true,
  region: true,
  type: true,
  ownership: true,
  verificationStatus: true,
  abgAvailability: true,
};

const membershipSelect = {
  id: true,
  userId: true,
  facilityId: true,
  role: true,
  status: true,
  facility: { select: facilitySelect },
};

const getApprovedMemberships = (userId) => prisma.facilityMembership.findMany({
  where: { userId, status: 'APPROVED' },
  select: membershipSelect,
  orderBy: { createdAt: 'desc' },
});

const rolePriority = [
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
  MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
  MEMBERSHIP_ROLES.CLINICIAN,
  MEMBERSHIP_ROLES.ICU_NURSE,
  MEMBERSHIP_ROLES.READ_ONLY_REVIEWER,
];

const getHighestPriorityRole = (roles) => rolePriority.find((role) => roles.includes(role)) || roles[0];

const findActiveMembershipRole = (memberships, facilityId, fallbackRole) => (
  getHighestPriorityRole([
    ...memberships
      .filter((membership) => membership.facilityId === facilityId)
      .map((membership) => membership.role),
    fallbackRole,
  ].filter(Boolean))
);

const hasPlatformAdminMembership = (memberships = []) =>
  memberships.some((membership) => membership.role === MEMBERSHIP_ROLES.PLATFORM_ADMIN);

const allFacilityOptions = async () => (
  await prisma.facility.findMany({
    select: facilitySelect,
    orderBy: { name: 'asc' },
  })
).map((facility) => ({ ...facility, roles: [MEMBERSHIP_ROLES.PLATFORM_ADMIN] }));

const buildAggregateFacility = ({ id, name, count }) => ({
  id,
  name,
  district: count ? `${count} facilities` : null,
  region: null,
  type: 'Aggregate',
  ownership: null,
  verificationStatus: 'VERIFIED',
  abgAvailability: null,
});

const resolveHomeFacilityContext = async ({ userId, requestedFacilityId, memberships, availableFacilities }) => {
  const isPlatformAdmin = hasPlatformAdminMembership(memberships);

  if (requestedFacilityId) {
    const membership = await assertFacilityRole(userId, requestedFacilityId, READ_ROLES);
    const facility = await prisma.facility.findUnique({ where: { id: requestedFacilityId }, select: facilitySelect });
    if (!facility) throw notFound('Facility not found');

    return {
      facility,
      activeRole: findActiveMembershipRole(memberships, requestedFacilityId, membership.role),
    };
  }

  if (isPlatformAdmin) {
    return {
      facility: buildAggregateFacility({
        id: '__all_facilities__',
        name: 'All facilities',
        count: availableFacilities.length,
      }),
      activeRole: MEMBERSHIP_ROLES.PLATFORM_ADMIN,
      facilityIds: undefined,
    };
  }

  if (availableFacilities.length === 0) {
    return {
      selectionRequired: true,
      reason: 'needs_facility_membership',
    };
  }

  if (availableFacilities.length > 1) {
    return {
      facility: buildAggregateFacility({
        id: '__assigned_facilities__',
        name: 'Assigned facilities',
        count: availableFacilities.length,
      }),
      activeRole: getHighestPriorityRole(availableFacilities.flatMap((facility) => facility.roles || [])),
      facilityIds: availableFacilities.map((facility) => facility.id),
    };
  }

  const [onlyFacility] = availableFacilities;
  const facility = await prisma.facility.findUnique({ where: { id: onlyFacility.id }, select: facilitySelect });
  if (!facility) throw notFound('Facility not found');

  return {
    facility,
    activeRole: findActiveMembershipRole(memberships, onlyFacility.id, onlyFacility.roles?.[0]),
    facilityIds: [onlyFacility.id],
  };
};

const facilityScopeWhere = ({ facilityId, facilityIds } = {}) => {
  if (facilityId) return { facilityId };
  if (Array.isArray(facilityIds)) return { facilityId: { in: facilityIds } };
  return {};
};

const countReviewerWork = async ({ facilityId, facilityIds }) => {
  const scopeWhere = facilityScopeWhere({ facilityId, facilityIds });
  const admissionScopeWhere = Object.keys(scopeWhere).length > 0
    ? { admission: scopeWhere }
    : {};
  const [
    admissionsPending,
    admissionsCorrectionRequested,
    abgTestsPending,
    abgTestsCorrectionRequested,
    ventilatorSettingsPending,
    ventilatorSettingsCorrectionRequested,
    datasetDraft,
    datasetSubmitted,
    datasetNeedsCorrection,
    datasetReviewed,
    datasetApprovedForDataset,
  ] = await Promise.all([
    prisma.admission.count({ where: { ...scopeWhere, reviewStatus: 'PENDING' } }),
    prisma.admission.count({ where: { ...scopeWhere, reviewStatus: 'CORRECTION_REQUESTED' } }),
    prisma.abgTest.count({ where: { ...admissionScopeWhere, reviewStatus: 'PENDING' } }),
    prisma.abgTest.count({ where: { ...admissionScopeWhere, reviewStatus: 'CORRECTION_REQUESTED' } }),
    prisma.ventilatorSetting.count({ where: { ...admissionScopeWhere, reviewStatus: 'PENDING' } }),
    prisma.ventilatorSetting.count({ where: { ...admissionScopeWhere, reviewStatus: 'CORRECTION_REQUESTED' } }),
    prisma.datasetCase.count({ where: { ...scopeWhere, reviewStatus: 'DRAFT' } }),
    prisma.datasetCase.count({ where: { ...scopeWhere, reviewStatus: 'SUBMITTED' } }),
    prisma.datasetCase.count({ where: { ...scopeWhere, reviewStatus: 'NEEDS_CORRECTION' } }),
    prisma.datasetCase.count({ where: { ...scopeWhere, reviewStatus: 'REVIEWED' } }),
    prisma.datasetCase.count({ where: { ...scopeWhere, reviewStatus: 'APPROVED_FOR_DATASET' } }),
  ]);

  return {
    review: {
      visible: true,
      pendingTotal: admissionsPending + abgTestsPending + ventilatorSettingsPending,
      correctionRequestedTotal: admissionsCorrectionRequested + abgTestsCorrectionRequested + ventilatorSettingsCorrectionRequested,
      byEntity: {
        admissions: {
          pending: admissionsPending,
          correctionRequested: admissionsCorrectionRequested,
        },
        abgTests: {
          pending: abgTestsPending,
          correctionRequested: abgTestsCorrectionRequested,
        },
        ventilatorSettings: {
          pending: ventilatorSettingsPending,
          correctionRequested: ventilatorSettingsCorrectionRequested,
        },
      },
    },
    dataset: {
      visible: true,
      draft: datasetDraft,
      submitted: datasetSubmitted,
      needsCorrection: datasetNeedsCorrection,
      reviewed: datasetReviewed,
      approvedForDataset: datasetApprovedForDataset,
    },
  };
};

const hiddenReviewerWork = {
  review: {
    visible: false,
    pendingTotal: null,
    correctionRequestedTotal: null,
    byEntity: null,
  },
  dataset: {
    visible: false,
    draft: null,
    submitted: null,
    needsCorrection: null,
    reviewed: null,
    approvedForDataset: null,
  },
};

const getHomeCounts = async ({ facilityId, facilityIds, includeReviewerCounts }) => {
  const scopeWhere = facilityScopeWhere({ facilityId, facilityIds });
  const activeAdmissionWhere = { ...scopeWhere, status: 'ACTIVE' };
  const [
    activeAdmissions,
    activePatientRows,
    localDrafts,
    waitingToSync,
    syncConflicts,
    syncFailedValidation,
    syncNeedsReview,
    syncFailed,
    reviewerWork,
  ] = await Promise.all([
    prisma.admission.count({ where: activeAdmissionWhere }),
    prisma.admission.groupBy({ by: ['patientId'], where: activeAdmissionWhere }),
    prisma.syncEvent.count({ where: { ...scopeWhere, status: 'LOCAL_DRAFT' } }),
    prisma.syncEvent.count({ where: { ...scopeWhere, status: 'WAITING_TO_SYNC' } }),
    prisma.syncEvent.count({ where: { ...scopeWhere, status: 'CONFLICT' } }),
    prisma.syncEvent.count({ where: { ...scopeWhere, status: 'FAILED_VALIDATION' } }),
    prisma.syncEvent.count({ where: { ...scopeWhere, status: 'NEEDS_REVIEW' } }),
    prisma.syncEvent.count({ where: { ...scopeWhere, status: 'FAILED' } }),
    includeReviewerCounts ? countReviewerWork({ facilityId, facilityIds }) : Promise.resolve(hiddenReviewerWork),
  ]);

  const syncAttentionTotal = syncConflicts + syncFailedValidation + syncNeedsReview + syncFailed;

  return {
    patientActivity: {
      activePatients: activePatientRows.length,
      activeAdmissions,
    },
    drafts: {
      localDrafts,
      waitingToSync,
    },
    sync: {
      waitingToSync,
      conflicts: syncConflicts,
      failedValidation: syncFailedValidation,
      needsReview: syncNeedsReview,
      failed: syncFailed,
      attentionTotal: syncAttentionTotal,
    },
    review: reviewerWork.review,
    dataset: reviewerWork.dataset,
  };
};

export const getHomeSummary = async (userId, { facilityId } = {}) => {
  requireUserId(userId);

  const memberships = await getApprovedMemberships(userId);
  const isPlatformAdmin = hasPlatformAdminMembership(memberships);
  const availableFacilities = isPlatformAdmin
    ? await allFacilityOptions()
    : buildAvailableFacilities(memberships);
  const context = await resolveHomeFacilityContext({
    userId,
    requestedFacilityId: facilityId,
    memberships,
    availableFacilities,
  });

  if (context.selectionRequired) {
    return buildFacilitySelectionHomeSummary({
      userId,
      availableFacilities,
      reason: context.reason,
    });
  }

  if (!context.activeRole) {
    throw forbidden('An approved facility role is required for Home summaries');
  }

  const counts = await getHomeCounts({
    facilityId: context.facility.id?.startsWith('__') ? undefined : context.facility.id,
    facilityIds: context.facilityIds,
    includeReviewerCounts: canSeeReviewCounts(context.activeRole),
  });

  return buildScopedHomeSummary({
    userId,
    activeRole: context.activeRole,
    facility: context.facility,
    availableFacilities,
    counts,
  });
};
