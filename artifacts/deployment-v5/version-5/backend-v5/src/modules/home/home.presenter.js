import { MEMBERSHIP_ROLES } from '../../constants/roles.js';

const CLINICAL_WRITE_ROLE_SET = new Set([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.CLINICIAN,
  MEMBERSHIP_ROLES.ICU_NURSE,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
]);

const REVIEW_ROLE_SET = new Set([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
  MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
]);

const FACILITY_ADMIN_ROLE_SET = new Set([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
]);

const toFacilityContext = (facility) => facility ? ({
  id: facility.id,
  registryCode: facility.registryCode,
  name: facility.name,
  district: facility.district,
  region: facility.region,
  type: facility.type,
  ownership: facility.ownership,
  verificationStatus: facility.verificationStatus,
  abgAvailability: facility.abgAvailability,
}) : null;

export const canSeeReviewCounts = (role) => REVIEW_ROLE_SET.has(role);

export const buildAvailableFacilities = (memberships = []) => {
  const byFacilityId = new Map();

  for (const membership of memberships) {
    if (!membership.facilityId || !membership.facility) continue;
    const existing = byFacilityId.get(membership.facilityId);
    const roles = new Set([...(existing?.roles || []), membership.role]);

    byFacilityId.set(membership.facilityId, {
      facility: toFacilityContext(membership.facility),
      roles: [...roles],
    });
  }

  return [...byFacilityId.values()]
    .map((item) => ({ ...item.facility, roles: item.roles }))
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));
};

const emptyCountSummary = Object.freeze({
  patientActivity: {
    activePatients: 0,
    activeAdmissions: 0,
  },
  drafts: {
    localDrafts: 0,
    waitingToSync: 0,
  },
  sync: {
    waitingToSync: 0,
    conflicts: 0,
    failedValidation: 0,
    needsReview: 0,
    failed: 0,
    attentionTotal: 0,
  },
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
});

export const buildHomeNavigationStatus = ({ activeRole, facility, counts }) => {
  const hasActiveFacility = Boolean(facility?.id);
  const facilitySuspended = facility?.verificationStatus === 'SUSPENDED';
  const canOpenFacilityRoutes = hasActiveFacility && !facilitySuspended;
  const canReview = canOpenFacilityRoutes && REVIEW_ROLE_SET.has(activeRole);
  const syncAttention = counts?.sync?.attentionTotal || 0;

  const notices = [];
  if (!hasActiveFacility) {
    notices.push({
      code: 'FACILITY_SELECTION_REQUIRED',
      severity: 'info',
      message: 'Select an active facility before opening facility-scoped workflows.',
    });
  } else if (facilitySuspended) {
    notices.push({
      code: 'FACILITY_SUSPENDED',
      severity: 'warning',
      message: 'Facility workflows are paused until facility access is restored.',
    });
  } else if (facility.verificationStatus !== 'VERIFIED') {
    notices.push({
      code: 'FACILITY_NOT_VERIFIED',
      severity: 'info',
      message: 'Facility verification is not complete.',
    });
  }

  if (syncAttention > 0) {
    notices.push({
      code: 'SYNC_ATTENTION',
      severity: 'warning',
      message: 'One or more sync items need review or conflict resolution.',
      count: syncAttention,
    });
  }

  return {
    status: !hasActiveFacility
      ? 'needs_facility_selection'
      : facilitySuspended
        ? 'facility_suspended'
        : 'ready',
    canOpenAdmissions: canOpenFacilityRoutes,
    canCreateAdmission: canOpenFacilityRoutes && CLINICAL_WRITE_ROLE_SET.has(activeRole),
    canOpenReviewQueue: canReview,
    canManageFacility: canOpenFacilityRoutes && FACILITY_ADMIN_ROLE_SET.has(activeRole),
    canResolveSyncConflicts: canOpenFacilityRoutes && (canReview || FACILITY_ADMIN_ROLE_SET.has(activeRole)),
    notices,
  };
};

const buildStatusSummaries = (counts = emptyCountSummary) => {
  const summaries = [
    {
      code: 'ACTIVE_PATIENTS',
      status: 'active',
      label: 'Active patients',
      count: counts.patientActivity.activePatients,
    },
    {
      code: 'WAITING_TO_SYNC',
      status: counts.sync.waitingToSync > 0 ? 'pending' : 'clear',
      label: 'Waiting to sync',
      count: counts.sync.waitingToSync,
    },
  ];

  if (counts.sync.attentionTotal > 0) {
    summaries.push({
      code: 'SYNC_ATTENTION',
      status: 'needs_review',
      label: 'Sync conflicts or failures',
      count: counts.sync.attentionTotal,
    });
  }

  if (counts.review.visible) {
    summaries.push({
      code: 'NEEDS_REVIEW',
      status: counts.review.pendingTotal > 0 ? 'needs_review' : 'clear',
      label: 'Records needing review',
      count: counts.review.pendingTotal,
    });
  }

  return summaries;
};

export const buildFacilitySelectionHomeSummary = ({ userId, availableFacilities, reason }) => ({
  user: {
    id: userId,
    activeRole: null,
    availableRoles: [...new Set(availableFacilities.flatMap((facility) => facility.roles || []))],
  },
  activeFacility: null,
  availableFacilities,
  counts: null,
  statusSummaries: [],
  navigation: {
    ...buildHomeNavigationStatus({ activeRole: null, facility: null, counts: emptyCountSummary }),
    reason,
  },
  privacy: 'Home summaries are facility-scoped and exclude patient identifiers.',
});

export const buildScopedHomeSummary = ({ userId, activeRole, facility, availableFacilities, counts }) => ({
  user: {
    id: userId,
    activeRole,
    availableRoles: [...new Set(availableFacilities.flatMap((item) => item.roles || []))],
  },
  activeFacility: toFacilityContext(facility),
  availableFacilities,
  counts,
  statusSummaries: buildStatusSummaries(counts),
  navigation: buildHomeNavigationStatus({ activeRole, facility, counts }),
  privacy: 'Home summaries are facility-scoped and exclude patient identifiers.',
});
