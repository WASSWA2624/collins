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
  aiSection: 'settings-ai-section',
  aiEnableToggle: 'settings-ai-enable-toggle',
  aiApiKeyInput: 'settings-ai-api-key-input',
  aiApiKeySave: 'settings-ai-api-key-save',
  aiApiKeyClear: 'settings-ai-api-key-clear',
  aiModelSelector: 'settings-ai-model-selector',
};

const DENSITY_MODES = {
  COMPACT: 'compact',
  COMFORTABLE: 'comfortable',
};

const DENSITY_MODE_VALUES = Object.values(DENSITY_MODES);

const AI_MODEL_OPTIONS = [
  { value: 'gpt-4o-mini', labelKey: 'settings.ai.models.gpt-4o-mini' },
  { value: 'gpt-4o', labelKey: 'settings.ai.models.gpt-4o' },
];

export { SETTINGS_TEST_IDS, DENSITY_MODES, DENSITY_MODE_VALUES, AI_MODEL_OPTIONS };
