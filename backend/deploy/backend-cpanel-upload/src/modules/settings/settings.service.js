import { prisma } from '../../config/prisma.js';
import { FACILITY_ADMIN_ROLES, READ_ROLES, assertFacilityRole, requireUserId } from '../../utils/authorization.js';
import { writeAudit } from '../../utils/audit.js';
import { badRequest, forbidden, notFound } from '../../utils/errors.js';
import { stripUndefined } from '../../utils/object.js';

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

const membershipSelect = {
  id: true,
  facilityId: true,
  role: true,
  status: true,
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
};

const facilitySelect = {
  id: true,
  name: true,
  registryCode: true,
  district: true,
  region: true,
  type: true,
  ownership: true,
  verificationStatus: true,
  createdAt: true,
  updatedAt: true,
};

const DEFAULT_ROLE_VISIBILITY = Object.freeze({
  activeRole: null,
  visibleRoles: [],
  showFacilitySwitcher: true,
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

const APPROVED_REFERENCE_GOVERNANCE_STATUSES = new Set([
  'APPROVED',
  'VERIFIED',
  'ACTIVE',
  'APPROVED_FOR_DECISION_SUPPORT',
  'VERIFIED_FOR_DECISION_SUPPORT',
]);
const VERIFIED_REFERENCE_STATUS = 'VERIFIED';

const unique = (items) => [...new Set(items.filter((item) => item !== undefined && item !== null))];

const mergeSettings = (defaults, current = null, patch = null) => stripUndefined({
  ...defaults,
  ...(current || {}),
  ...(patch || {}),
});

const approvedMembershipsForUser = (userId, tx = prisma) => tx.facilityMembership.findMany({
  where: { userId, status: 'APPROVED' },
  select: membershipSelect,
  orderBy: { createdAt: 'desc' },
});

const resolveActiveFacilityId = (settings, memberships) => {
  const savedFacilityId = settings?.activeFacilityId || null;
  if (savedFacilityId && memberships.some((membership) => membership.facilityId === savedFacilityId)) {
    return savedFacilityId;
  }
  return memberships.length === 1 ? memberships[0].facilityId : null;
};

const rolesForFacility = (memberships, facilityId) => memberships
  .filter((membership) => !facilityId || membership.facilityId === facilityId)
  .map((membership) => membership.role);

const assertActiveFacilityAllowed = (activeFacilityId, memberships) => {
  if (!activeFacilityId) return;
  if (!memberships.some((membership) => membership.facilityId === activeFacilityId)) {
    throw forbidden('Active facility must be one of the user approved memberships');
  }
};

const assertRoleVisibilityAllowed = (roleVisibility, memberships, activeFacilityId) => {
  if (!roleVisibility) return;

  const approvedRoles = new Set(memberships.map((membership) => membership.role));
  const activeFacilityRoles = new Set(rolesForFacility(memberships, activeFacilityId));

  for (const role of roleVisibility.visibleRoles || []) {
    if (!approvedRoles.has(role)) {
      throw forbidden('Role visibility can only include roles from approved memberships');
    }
  }

  if (roleVisibility.activeRole) {
    const roleSet = activeFacilityId ? activeFacilityRoles : approvedRoles;
    if (!roleSet.has(roleVisibility.activeRole)) {
      throw forbidden('Active role must be approved for the active facility');
    }
  }
};

const normalizeRoleVisibility = (settings, memberships, activeFacilityId) => {
  const approvedRoles = unique(memberships.map((membership) => membership.role));
  const current = mergeSettings(DEFAULT_ROLE_VISIBILITY, settings?.roleVisibilityJson);
  const visibleRoles = unique((current.visibleRoles?.length ? current.visibleRoles : approvedRoles)
    .filter((role) => approvedRoles.includes(role)));
  const activeFacilityRoles = rolesForFacility(memberships, activeFacilityId);
  const allowedActiveRoles = activeFacilityId ? activeFacilityRoles : approvedRoles;
  const activeRole = allowedActiveRoles.includes(current.activeRole)
    ? current.activeRole
    : allowedActiveRoles[0] || null;

  return {
    ...current,
    visibleRoles,
    activeRole,
  };
};

const buildUserSettingsPayload = async (userId, tx = prisma) => {
  requireUserId(userId);

  const [user, settings, memberships] = await Promise.all([
    tx.user.findUnique({ where: { id: userId }, select: userSelect }),
    tx.userSettings.findUnique({ where: { userId } }),
    approvedMembershipsForUser(userId, tx),
  ]);

  if (!user) throw notFound('User not found');

  const activeFacilityId = resolveActiveFacilityId(settings, memberships);

  return {
    account: user,
    activeFacilityId,
    memberships,
    roleVisibility: normalizeRoleVisibility(settings, memberships, activeFacilityId),
    offlineSyncPreferences: mergeSettings(
      DEFAULT_OFFLINE_SYNC_PREFERENCES,
      settings?.offlineSyncPreferencesJson,
    ),
    privacyControls: mergeSettings(DEFAULT_USER_PRIVACY_CONTROLS, settings?.privacyControlsJson),
    settingsUpdatedAt: settings?.updatedAt || null,
  };
};

const updatedUserSections = (payload) => [
  payload.account ? 'account' : null,
  payload.activeFacilityId !== undefined ? 'active_facility' : null,
  payload.roleVisibility ? 'role_visibility' : null,
  payload.offlineSyncPreferences ? 'offline_sync_preferences' : null,
  payload.privacyControls ? 'privacy_controls' : null,
].filter(Boolean);

export const getUserSettings = (userId) => buildUserSettingsPayload(userId);

export const updateUserSettings = async (userId, payload, auditContext = {}) => {
  requireUserId(userId);

  const [before, existingSettings, memberships] = await Promise.all([
    buildUserSettingsPayload(userId),
    prisma.userSettings.findUnique({ where: { userId } }),
    approvedMembershipsForUser(userId),
  ]);

  const nextActiveFacilityId = payload.activeFacilityId !== undefined
    ? payload.activeFacilityId
    : before.activeFacilityId;

  assertActiveFacilityAllowed(nextActiveFacilityId, memberships);
  assertRoleVisibilityAllowed(payload.roleVisibility, memberships, nextActiveFacilityId);

  const nextRoleVisibility = payload.roleVisibility
    ? mergeSettings(DEFAULT_ROLE_VISIBILITY, existingSettings?.roleVisibilityJson, payload.roleVisibility)
    : undefined;
  const nextOfflineSyncPreferences = payload.offlineSyncPreferences
    ? mergeSettings(
      DEFAULT_OFFLINE_SYNC_PREFERENCES,
      existingSettings?.offlineSyncPreferencesJson,
      payload.offlineSyncPreferences,
    )
    : undefined;
  const nextPrivacyControls = payload.privacyControls
    ? mergeSettings(DEFAULT_USER_PRIVACY_CONTROLS, existingSettings?.privacyControlsJson, payload.privacyControls)
    : undefined;

  const accountData = payload.account ? stripUndefined({
    name: payload.account.name,
    phone: payload.account.phone,
  }) : null;

  const settingsData = stripUndefined({
    activeFacilityId: payload.activeFacilityId !== undefined ? payload.activeFacilityId : undefined,
    roleVisibilityJson: nextRoleVisibility,
    offlineSyncPreferencesJson: nextOfflineSyncPreferences,
    privacyControlsJson: nextPrivacyControls,
  });

  await prisma.$transaction(async (tx) => {
    let settings = null;

    if (accountData && Object.keys(accountData).length > 0) {
      await tx.user.update({ where: { id: userId }, data: accountData, select: userSelect });
    }

    if (Object.keys(settingsData).length > 0) {
      settings = await tx.userSettings.upsert({
        where: { userId },
        update: settingsData,
        create: { userId, ...settingsData },
      });
    }

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: nextActiveFacilityId,
      action: 'USER_SETTINGS_UPDATE',
      entityType: 'UserSettings',
      entityId: settings?.id || existingSettings?.id || userId,
      beforeJson: before,
      afterJson: {
        updatedSections: updatedUserSections(payload),
        activeFacilityId: nextActiveFacilityId,
        account: accountData || undefined,
        roleVisibility: nextRoleVisibility,
        offlineSyncPreferences: nextOfflineSyncPreferences,
        privacyControls: nextPrivacyControls,
      },
      reason: payload.reason || null,
    });
  });

  return buildUserSettingsPayload(userId);
};

const referenceRuleIsApprovedForSettings = (rule, now = new Date()) => {
  const status = String(rule.governanceStatus || '').trim().toUpperCase();
  const startsInFuture = rule.activeFrom && rule.activeFrom > now;
  const alreadyEnded = rule.activeTo && rule.activeTo < now;
  return rule.verificationStatus === VERIFIED_REFERENCE_STATUS
    && APPROVED_REFERENCE_GOVERNANCE_STATUSES.has(status)
    && Boolean(rule.approvedByUserId)
    && Boolean(rule.verifiedByUserId)
    && Boolean(rule.verifiedAt)
    && !startsInFuture
    && !alreadyEnded;
};

export const getReferenceRuleSettingsStatus = (rule, now = new Date()) => ({
  id: rule.id,
  approvedForSettings: referenceRuleIsApprovedForSettings(rule, now),
});

const assertReferenceRulesCanBeActivated = async (referenceSettings) => {
  if (!referenceSettings?.activeReferenceRuleIds) return;

  const requestedIds = unique(referenceSettings.activeReferenceRuleIds);
  const rules = await prisma.referenceRule.findMany({
    where: { id: { in: requestedIds } },
    select: {
      id: true,
      name: true,
      version: true,
      verificationStatus: true,
      governanceStatus: true,
      approvedByUserId: true,
      verifiedByUserId: true,
      verifiedAt: true,
      activeFrom: true,
      activeTo: true,
    },
  });

  const foundIds = new Set(rules.map((rule) => rule.id));
  const missingIds = requestedIds.filter((id) => !foundIds.has(id));
  if (missingIds.length > 0) {
    throw badRequest('Reference settings include unknown reference rule ids', missingIds.map((id) => ({
      path: 'body.referenceSettings.activeReferenceRuleIds',
      message: `Reference rule ${id} was not found`,
    })));
  }

  const rejectedRules = rules.filter((rule) => !referenceRuleIsApprovedForSettings(rule));
  if (rejectedRules.length > 0) {
    throw badRequest('Only approved and currently active reference rules can be activated through settings', rejectedRules.map((rule) => ({
      path: 'body.referenceSettings.activeReferenceRuleIds',
      message: `${rule.name} ${rule.version} is not approved and active for settings`,
    })));
  }
};

const assertModelVisibilitySafe = (modelVisibility) => {
  if (!modelVisibility) return;

  if (modelVisibility.liveClinicalPredictionEnabled === true) {
    throw badRequest('Live clinical prediction visibility cannot be enabled through settings');
  }

  if ((modelVisibility.clinicianVisibleModelVersionIds || []).length > 0) {
    throw badRequest('Clinician-visible model versions cannot be activated through settings');
  }

  if (modelVisibility.showShadowModelOutputsToClinicians === true) {
    throw badRequest('Shadow model outputs cannot be exposed to clinicians through settings');
  }
};

const normalizeModelVisibility = (current = null) => ({
  ...DEFAULT_MODEL_VISIBILITY,
  ...(current || {}),
  liveClinicalPredictionEnabled: false,
  clinicianVisibleModelVersionIds: [],
  showShadowModelOutputsToClinicians: false,
});

const buildFacilitySettingsPayload = async (facilityId, tx = prisma) => {
  const [facility, settings] = await Promise.all([
    tx.facility.findUnique({ where: { id: facilityId }, select: facilitySelect }),
    tx.facilitySettings.findUnique({ where: { facilityId } }),
  ]);

  if (!facility) throw notFound('Facility not found');

  return {
    facility,
    referenceSettings: mergeSettings(DEFAULT_REFERENCE_SETTINGS, settings?.referenceSettingsJson),
    workflowSettings: mergeSettings(DEFAULT_WORKFLOW_SETTINGS, settings?.workflowSettingsJson),
    privacyControls: mergeSettings(DEFAULT_FACILITY_PRIVACY_CONTROLS, settings?.privacyControlsJson),
    governanceSettings: mergeSettings(DEFAULT_GOVERNANCE_SETTINGS, settings?.governanceSettingsJson),
    modelVisibility: normalizeModelVisibility(settings?.modelVisibilityJson),
    safetyStatement: 'Settings do not contain clinical decision outputs, treatment orders, or live predictive model controls.',
    settingsUpdatedAt: settings?.updatedAt || null,
  };
};

const updatedFacilitySections = (payload) => [
  payload.referenceSettings ? 'reference_settings' : null,
  payload.workflowSettings ? 'clinical_workflow' : null,
  payload.privacyControls ? 'privacy_controls' : null,
  payload.governanceSettings ? 'governance' : null,
  payload.modelVisibility ? 'model_visibility' : null,
].filter(Boolean);

export const getFacilitySettings = async (userId, facilityId) => {
  await assertFacilityRole(userId, facilityId, READ_ROLES);
  return buildFacilitySettingsPayload(facilityId);
};

export const updateFacilitySettings = async (userId, facilityId, payload, auditContext = {}) => {
  await assertFacilityRole(userId, facilityId, FACILITY_ADMIN_ROLES);
  await assertReferenceRulesCanBeActivated(payload.referenceSettings);
  assertModelVisibilitySafe(payload.modelVisibility);

  const [before, existingSettings] = await Promise.all([
    buildFacilitySettingsPayload(facilityId),
    prisma.facilitySettings.findUnique({ where: { facilityId } }),
  ]);

  const nextReferenceSettings = payload.referenceSettings
    ? mergeSettings(DEFAULT_REFERENCE_SETTINGS, existingSettings?.referenceSettingsJson, payload.referenceSettings)
    : undefined;
  const nextWorkflowSettings = payload.workflowSettings
    ? mergeSettings(DEFAULT_WORKFLOW_SETTINGS, existingSettings?.workflowSettingsJson, payload.workflowSettings)
    : undefined;
  const nextPrivacyControls = payload.privacyControls
    ? mergeSettings(DEFAULT_FACILITY_PRIVACY_CONTROLS, existingSettings?.privacyControlsJson, payload.privacyControls)
    : undefined;
  const nextGovernanceSettings = payload.governanceSettings
    ? mergeSettings(DEFAULT_GOVERNANCE_SETTINGS, existingSettings?.governanceSettingsJson, payload.governanceSettings)
    : undefined;
  const nextModelVisibility = payload.modelVisibility
    ? normalizeModelVisibility(mergeSettings(DEFAULT_MODEL_VISIBILITY, existingSettings?.modelVisibilityJson, payload.modelVisibility))
    : undefined;

  const settingsData = stripUndefined({
    referenceSettingsJson: nextReferenceSettings,
    workflowSettingsJson: nextWorkflowSettings,
    privacyControlsJson: nextPrivacyControls,
    governanceSettingsJson: nextGovernanceSettings,
    modelVisibilityJson: nextModelVisibility,
  });

  await prisma.$transaction(async (tx) => {
    const settings = await tx.facilitySettings.upsert({
      where: { facilityId },
      update: settingsData,
      create: { facilityId, ...settingsData },
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId,
      action: 'FACILITY_SETTINGS_UPDATE',
      entityType: 'FacilitySettings',
      entityId: settings.id,
      beforeJson: before,
      afterJson: {
        updatedSections: updatedFacilitySections(payload),
        referenceSettings: nextReferenceSettings,
        workflowSettings: nextWorkflowSettings,
        privacyControls: nextPrivacyControls,
        governanceSettings: nextGovernanceSettings,
        modelVisibility: nextModelVisibility,
      },
      reason: payload.reason || null,
    });
  });

  return buildFacilitySettingsPayload(facilityId);
};
