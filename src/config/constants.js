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

