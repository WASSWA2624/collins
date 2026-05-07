import { z } from 'zod';
import { MEMBERSHIP_ROLE_VALUES } from '../../constants/roles.js';

const membershipRole = z.enum(MEMBERSHIP_ROLE_VALUES);

const accountSettings = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  phone: z.string().trim().max(40).nullable().optional(),
}).strict();

const roleVisibilitySettings = z.object({
  activeRole: membershipRole.optional(),
  visibleRoles: z.array(membershipRole).min(1).max(8).optional(),
  showFacilitySwitcher: z.boolean().optional(),
}).strict();

const displayPreferences = z.object({
  themePreference: z.enum(['system', 'light', 'dark', 'high-contrast']).optional(),
}).strict();

const offlineSyncPreferences = z.object({
  offlineModeEnabled: z.boolean().optional(),
  syncOnWifiOnly: z.boolean().optional(),
  autoSyncEnabled: z.boolean().optional(),
  backgroundSyncEnabled: z.boolean().optional(),
  retryFailedSyncAutomatically: z.boolean().optional(),
  syncIntervalMinutes: z.number().int().min(5).max(1440).optional(),
  purgeSyncedDraftsAfterDays: z.number().int().min(1).max(365).optional(),
  conflictResolutionMode: z.literal('manual_review').optional(),
  deviceLabel: z.string().trim().max(120).optional(),
}).strict();

const userPrivacyControls = z.object({
  hidePatientIdentifiersInLists: z.boolean().optional(),
  requireUnlockForIdentifiers: z.boolean().optional(),
  shareUsageDiagnostics: z.boolean().optional(),
  allowDeidentifiedAnalytics: z.boolean().optional(),
  allowDeidentifiedTrainingDatasetContribution: z.boolean().optional(),
}).strict();

const referenceSettings = z.object({
  activeReferenceRuleIds: z.array(z.string().trim().min(1)).max(50).optional(),
  requireVerifiedReferenceRules: z.literal(true).optional(),
  defaultReferenceRuleScope: z.enum(['global', 'facility']).optional(),
  showReferenceVersionToClinicians: z.boolean().optional(),
}).strict();

const workflowSettings = z.object({
  requireReasonForClinicalOverride: z.boolean().optional(),
  requireSecondReviewerForCriticalFlags: z.boolean().optional(),
  requireReviewBeforeDatasetUse: z.literal(true).optional(),
  lockReviewedClinicalRecords: z.literal(true).optional(),
}).strict();

const facilityPrivacyControls = z.object({
  allowDeidentifiedExports: z.boolean().optional(),
  requireExportAuditReason: z.literal(true).optional(),
  exportPatientIdentifiers: z.literal(false).optional(),
  allowRawNotesInExports: z.literal(false).optional(),
}).strict();

const governanceSettings = z.object({
  datasetExportsRequireEthicsApproval: z.literal(true).optional(),
  datasetExportsRequireReview: z.literal(true).optional(),
  allowUnreviewedDatasetExports: z.literal(false).optional(),
}).strict();

const modelVisibilitySettings = z.object({
  liveClinicalPredictionEnabled: z.literal(false).optional(),
  clinicianVisibleModelVersionIds: z.array(z.string().trim().min(1)).max(0).optional(),
  showShadowModelOutputsToClinicians: z.literal(false).optional(),
}).strict();

const hasSettingsPatch = (payload, settingKeys) => settingKeys.some((key) => payload[key] !== undefined);

export const userSettingsSchema = z.object({
  body: z.object({
    account: accountSettings.optional(),
    activeFacilityId: z.string().trim().min(1).nullable().optional(),
    roleVisibility: roleVisibilitySettings.optional(),
    displayPreferences: displayPreferences.optional(),
    offlineSyncPreferences: offlineSyncPreferences.optional(),
    privacyControls: userPrivacyControls.optional(),
    reason: z.string().trim().max(1000).optional(),
  }).strict().refine(
    (payload) => hasSettingsPatch(payload, [
      'account',
      'activeFacilityId',
      'roleVisibility',
      'displayPreferences',
      'offlineSyncPreferences',
      'privacyControls',
    ]),
    { message: 'At least one settings section is required' },
  ),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const facilitySettingsIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ facilityId: z.string().min(1) }),
  query: z.object({}).optional(),
});

export const facilitySettingsSchema = z.object({
  body: z.object({
    referenceSettings: referenceSettings.optional(),
    workflowSettings: workflowSettings.optional(),
    privacyControls: facilityPrivacyControls.optional(),
    governanceSettings: governanceSettings.optional(),
    modelVisibility: modelVisibilitySettings.optional(),
    reason: z.string().trim().max(1000).optional(),
  }).strict().refine(
    (payload) => hasSettingsPatch(payload, [
      'referenceSettings',
      'workflowSettings',
      'privacyControls',
      'governanceSettings',
      'modelVisibility',
    ]),
    { message: 'At least one settings section is required' },
  ),
  params: z.object({ facilityId: z.string().min(1) }),
  query: z.object({}).optional(),
});
