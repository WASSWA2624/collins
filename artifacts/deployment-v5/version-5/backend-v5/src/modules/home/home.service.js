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

const resolveHomeFacilityContext = async ({ userId, requestedFacilityId, memberships, availableFacilities }) => {
  if (requestedFacilityId) {
    const membership = await assertFacilityRole(userId, requestedFacilityId, READ_ROLES);
    const facility = await prisma.facility.findUnique({ where: { id: requestedFacilityId }, select: facilitySelect });
    if (!facility) throw notFound('Facility not found');

    return {
      facility,
      activeRole: findActiveMembershipRole(memberships, requestedFacilityId, membership.role),
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
      selectionRequired: true,
      reason: 'multiple_active_facilities',
    };
  }

  const [onlyFacility] = availableFacilities;
  const facility = await prisma.facility.findUnique({ where: { id: onlyFacility.id }, select: facilitySelect });
  if (!facility) throw notFound('Facility not found');

  return {
    facility,
    activeRole: findActiveMembershipRole(memberships, onlyFacility.id, onlyFacility.roles?.[0]),
  };
};

const countReviewerWork = async (facilityId) => {
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
    prisma.admission.count({ where: { facilityId, reviewStatus: 'PENDING' } }),
    prisma.admission.count({ where: { facilityId, reviewStatus: 'CORRECTION_REQUESTED' } }),
    prisma.abgTest.count({ where: { admission: { facilityId }, reviewStatus: 'PENDING' } }),
    prisma.abgTest.count({ where: { admission: { facilityId }, reviewStatus: 'CORRECTION_REQUESTED' } }),
    prisma.ventilatorSetting.count({ where: { admission: { facilityId }, reviewStatus: 'PENDING' } }),
    prisma.ventilatorSetting.count({ where: { admission: { facilityId }, reviewStatus: 'CORRECTION_REQUESTED' } }),
    prisma.datasetCase.count({ where: { facilityId, reviewStatus: 'DRAFT' } }),
    prisma.datasetCase.count({ where: { facilityId, reviewStatus: 'SUBMITTED' } }),
    prisma.datasetCase.count({ where: { facilityId, reviewStatus: 'NEEDS_CORRECTION' } }),
    prisma.datasetCase.count({ where: { facilityId, reviewStatus: 'REVIEWED' } }),
    prisma.datasetCase.count({ where: { facilityId, reviewStatus: 'APPROVED_FOR_DATASET' } }),
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

const getHomeCounts = async ({ facilityId, includeReviewerCounts }) => {
  const activeAdmissionWhere = { facilityId, status: 'ACTIVE' };
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
    prisma.syncEvent.count({ where: { facilityId, status: 'LOCAL_DRAFT' } }),
    prisma.syncEvent.count({ where: { facilityId, status: 'WAITING_TO_SYNC' } }),
    prisma.syncEvent.count({ where: { facilityId, status: 'CONFLICT' } }),
    prisma.syncEvent.count({ where: { facilityId, status: 'FAILED_VALIDATION' } }),
    prisma.syncEvent.count({ where: { facilityId, status: 'NEEDS_REVIEW' } }),
    prisma.syncEvent.count({ where: { facilityId, status: 'FAILED' } }),
    includeReviewerCounts ? countReviewerWork(facilityId) : Promise.resolve(hiddenReviewerWork),
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
  const availableFacilities = buildAvailableFacilities(memberships);
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
    facilityId: context.facility.id,
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
