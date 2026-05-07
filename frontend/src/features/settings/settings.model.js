/**
 * Settings model helpers
 * Keep defaults aligned with the backend settings service.
 */

const MEMBERSHIP_ROLES = Object.freeze({
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  FACILITY_ADMIN: 'FACILITY_ADMIN',
  CLINICIAN: 'CLINICIAN',
  ICU_NURSE: 'ICU_NURSE',
  SPECIALIST_REVIEWER: 'SPECIALIST_REVIEWER',
  RESEARCH_GOVERNANCE_OFFICER: 'RESEARCH_GOVERNANCE_OFFICER',
  MODEL_GOVERNANCE_OFFICER: 'MODEL_GOVERNANCE_OFFICER',
  READ_ONLY_REVIEWER: 'READ_ONLY_REVIEWER',
});

const FACILITY_ADMIN_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
]);

const GOVERNANCE_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
  MEMBERSHIP_ROLES.MODEL_GOVERNANCE_OFFICER,
]);

const ROLE_LABELS = Object.freeze({
  [MEMBERSHIP_ROLES.PLATFORM_ADMIN]: 'Platform admin',
  [MEMBERSHIP_ROLES.FACILITY_ADMIN]: 'Facility admin',
  [MEMBERSHIP_ROLES.CLINICIAN]: 'Clinician',
  [MEMBERSHIP_ROLES.ICU_NURSE]: 'ICU nurse',
  [MEMBERSHIP_ROLES.SPECIALIST_REVIEWER]: 'Specialist reviewer',
  [MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER]: 'Research governance officer',
  [MEMBERSHIP_ROLES.MODEL_GOVERNANCE_OFFICER]: 'Model governance officer',
  [MEMBERSHIP_ROLES.READ_ONLY_REVIEWER]: 'Read-only reviewer',
});

const DEFAULT_ROLE_VISIBILITY = Object.freeze({
  activeRole: null,
  visibleRoles: [],
  showFacilitySwitcher: true,
});

const DEFAULT_DISPLAY_PREFERENCES = Object.freeze({
  themePreference: 'light',
});

const DEFAULT_OFFLINE_SYNC_PREFERENCES = Object.freeze({
  offlineModeEnabled: true,
  syncOnWifiOnly: false,
  autoSyncEnabled: true,
  backgroundSyncEnabled: true,
  retryFailedSyncAutomatically: true,
  syncIntervalMinutes: 15,
  purgeSyncedDraftsAfterDays: 30,
  conflictResolutionMode: 'manual_review',
  deviceLabel: null,
});

const DEFAULT_USER_PRIVACY_CONTROLS = Object.freeze({
  hidePatientIdentifiersInLists: false,
  requireUnlockForIdentifiers: true,
  shareUsageDiagnostics: false,
  allowDeidentifiedAnalytics: true,
  allowDeidentifiedTrainingDatasetContribution: false,
});

const DEFAULT_REFERENCE_SETTINGS = Object.freeze({
  activeReferenceRuleIds: [],
  requireVerifiedReferenceRules: true,
  defaultReferenceRuleScope: 'global',
  showReferenceVersionToClinicians: true,
});

const DEFAULT_WORKFLOW_SETTINGS = Object.freeze({
  requireReasonForClinicalOverride: true,
  requireSecondReviewerForCriticalFlags: false,
  requireReviewBeforeDatasetUse: true,
  lockReviewedClinicalRecords: true,
});

const DEFAULT_FACILITY_PRIVACY_CONTROLS = Object.freeze({
  allowDeidentifiedExports: false,
  requireExportAuditReason: true,
  exportPatientIdentifiers: false,
  allowRawNotesInExports: false,
});

const DEFAULT_GOVERNANCE_SETTINGS = Object.freeze({
  datasetExportsRequireEthicsApproval: true,
  datasetExportsRequireReview: true,
  allowUnreviewedDatasetExports: false,
});

const DEFAULT_MODEL_VISIBILITY = Object.freeze({
  liveClinicalPredictionEnabled: false,
  clinicianVisibleModelVersionIds: [],
  showShadowModelOutputsToClinicians: false,
});

const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});
const asArray = (value) => (Array.isArray(value) ? value : []);

const mergeDefaults = (defaults, value) => ({
  ...defaults,
  ...asObject(value),
});

const normalizeUserSettings = (settings) => {
  const source = asObject(settings);
  const memberships = asArray(source.memberships);

  return {
    account: asObject(source.account),
    activeFacilityId: source.activeFacilityId ?? null,
    memberships,
    roleVisibility: mergeDefaults(DEFAULT_ROLE_VISIBILITY, source.roleVisibility),
    displayPreferences: mergeDefaults(DEFAULT_DISPLAY_PREFERENCES, source.displayPreferences),
    offlineSyncPreferences: mergeDefaults(
      DEFAULT_OFFLINE_SYNC_PREFERENCES,
      source.offlineSyncPreferences,
    ),
    privacyControls: mergeDefaults(DEFAULT_USER_PRIVACY_CONTROLS, source.privacyControls),
    settingsUpdatedAt: source.settingsUpdatedAt ?? null,
  };
};

const normalizeFacilitySettings = (settings) => {
  const source = asObject(settings);

  return {
    facility: asObject(source.facility),
    referenceSettings: mergeDefaults(DEFAULT_REFERENCE_SETTINGS, source.referenceSettings),
    workflowSettings: mergeDefaults(DEFAULT_WORKFLOW_SETTINGS, source.workflowSettings),
    privacyControls: mergeDefaults(DEFAULT_FACILITY_PRIVACY_CONTROLS, source.privacyControls),
    governanceSettings: mergeDefaults(DEFAULT_GOVERNANCE_SETTINGS, source.governanceSettings),
    modelVisibility: {
      ...DEFAULT_MODEL_VISIBILITY,
      ...asObject(source.modelVisibility),
      liveClinicalPredictionEnabled: false,
      clinicianVisibleModelVersionIds: [],
      showShadowModelOutputsToClinicians: false,
    },
    safetyStatement:
      source.safetyStatement ||
      'Settings do not contain clinical decision outputs, treatment orders, or live predictive model controls.',
    settingsUpdatedAt: source.settingsUpdatedAt ?? null,
  };
};

const getRoleLabel = (role) => ROLE_LABELS[role] || String(role || '').replaceAll('_', ' ');

const canManageFacilitySettings = (roles = []) =>
  asArray(roles).some((role) => FACILITY_ADMIN_ROLES.includes(role));

const canSeeGovernanceSettings = (roles = []) =>
  asArray(roles).some((role) => GOVERNANCE_ROLES.includes(role));

export {
  MEMBERSHIP_ROLES,
  FACILITY_ADMIN_ROLES,
  GOVERNANCE_ROLES,
  ROLE_LABELS,
  DEFAULT_DISPLAY_PREFERENCES,
  DEFAULT_OFFLINE_SYNC_PREFERENCES,
  DEFAULT_USER_PRIVACY_CONTROLS,
  normalizeUserSettings,
  normalizeFacilitySettings,
  getRoleLabel,
  canManageFacilitySettings,
  canSeeGovernanceSettings,
};
