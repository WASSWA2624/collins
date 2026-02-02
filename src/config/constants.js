/**
 * Application Constants
 * File: constants.js
 */

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const TIMEOUTS = {
  API_REQUEST: 30000,
  NETWORK_CHECK: 5000,
};

export const AUTH = {
  REGISTER_ROLES: ['admin'],
};

/** Key name for AI API key in SecureStore (value never in Redux/logs). */
export const VENTILATION_AI_API_KEY_STORAGE_KEY = 'VENTILATION_AI_API_KEY';
export const AI_API_KEY_CONFIGURED_ASYNC_KEY = 'ai_api_key_configured';

/** Default AI model when none selected. */
export const AI_DEFAULT_MODEL_ID = 'gpt-4o-mini';

/** Available AI models (OpenAI-compatible). id = API model id; labelKey = i18n key. */
export const AI_MODELS = Object.freeze([
  { id: 'gpt-4o-mini', labelKey: 'gpt4oMini', provider: 'OpenAI' },
  { id: 'gpt-4o', labelKey: 'gpt4o', provider: 'OpenAI' },
  { id: 'gpt-4-turbo', labelKey: 'gpt4Turbo', provider: 'OpenAI' },
]);

