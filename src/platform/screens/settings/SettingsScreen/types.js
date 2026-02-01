/**
 * SettingsScreen types/constants
 * File: types.js
 */
const SETTINGS_TEST_IDS = {
  screen: 'settings-screen',
  title: 'settings-title',
  themeSection: 'settings-theme-section',
  themeLabel: 'settings-theme-label',
  themeSelector: 'settings-theme-selector',
  densitySection: 'settings-density-section',
  densityLabel: 'settings-density-label',
  densitySelector: 'settings-density-selector',
  languageSection: 'settings-language-section',
  languageLabel: 'settings-language-label',
  languageSelector: 'settings-language-selector',
};

const DENSITY_MODES = {
  COMPACT: 'compact',
  COMFORTABLE: 'comfortable',
};

const DENSITY_MODE_VALUES = Object.values(DENSITY_MODES);

export { SETTINGS_TEST_IDS, DENSITY_MODES, DENSITY_MODE_VALUES };
