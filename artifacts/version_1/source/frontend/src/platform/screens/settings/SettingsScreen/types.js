/**
 * SettingsScreen types/constants
 * File: types.js
 */
const SETTINGS_TEST_IDS = {
  screen: 'settings-screen',
  title: 'settings-title',
  accountSection: 'settings-account-section',
  accountNameInput: 'settings-account-name-input',
  accountPhoneInput: 'settings-account-phone-input',
  accountSaveButton: 'settings-account-save-button',
  activeFacilitySelector: 'settings-active-facility-selector',
  activeRoleSelector: 'settings-active-role-selector',
  themeSection: 'settings-theme-section',
  themeLabel: 'settings-theme-label',
  themeSelector: 'settings-theme-selector',
  densitySection: 'settings-density-section',
  densityLabel: 'settings-density-label',
  densitySelector: 'settings-density-selector',
  languageSection: 'settings-language-section',
  languageLabel: 'settings-language-label',
  languageSelector: 'settings-language-selector',
  footerToggle: 'settings-footer-toggle',
  syncSection: 'settings-sync-section',
  offlineModeToggle: 'settings-offline-mode-toggle',
  wifiOnlyToggle: 'settings-wifi-only-toggle',
  autoSyncToggle: 'settings-auto-sync-toggle',
  backgroundSyncToggle: 'settings-background-sync-toggle',
  retrySyncToggle: 'settings-retry-sync-toggle',
  syncIntervalSelector: 'settings-sync-interval-selector',
  purgeDraftsSelector: 'settings-purge-drafts-selector',
  privacySection: 'settings-privacy-section',
  hideIdentifiersToggle: 'settings-hide-identifiers-toggle',
  requireUnlockToggle: 'settings-require-unlock-toggle',
  diagnosticsToggle: 'settings-diagnostics-toggle',
  analyticsToggle: 'settings-analytics-toggle',
  trainingContributionToggle: 'settings-training-contribution-toggle',
  governanceSection: 'settings-governance-section',
  referenceScopeSelector: 'settings-reference-scope-selector',
  referenceVersionToggle: 'settings-reference-version-toggle',
  clinicalOverrideToggle: 'settings-clinical-override-toggle',
  criticalReviewerToggle: 'settings-critical-reviewer-toggle',
  deidentifiedExportsToggle: 'settings-deidentified-exports-toggle',
  modelVisibilityStatus: 'settings-model-visibility-status',
  statusMessage: 'settings-status-message',
};

const DENSITY_MODES = {
  COMPACT: 'compact',
  COMFORTABLE: 'comfortable',
};

const DENSITY_MODE_VALUES = Object.values(DENSITY_MODES);

export { SETTINGS_TEST_IDS, DENSITY_MODES, DENSITY_MODE_VALUES };
