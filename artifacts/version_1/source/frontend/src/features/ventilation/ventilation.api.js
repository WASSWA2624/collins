/**
 * Ventilation API
 * External model augmentation is disabled for normal clinical workflows.
 * File: ventilation.api.js
 */

const VENTILATION_API_ERROR_CODES = Object.freeze({
  OFFLINE_MODE: 'VENTILATION_ONLINE_AUGMENTATION_OFFLINE_MODE',
  OFFLINE: 'VENTILATION_ONLINE_AUGMENTATION_OFFLINE',
  FEATURE_DISABLED: 'VENTILATION_ONLINE_AUGMENTATION_FEATURE_DISABLED',
  INVALID_INPUT: 'VENTILATION_ONLINE_AUGMENTATION_INVALID_INPUT',
  AI_SDK_FAILED: 'VENTILATION_ONLINE_AUGMENTATION_AI_SDK_FAILED',
  NO_API_KEY: 'VENTILATION_ONLINE_AUGMENTATION_NO_API_KEY',
});

/**
 * Phase 16 keeps normal clinical recommendations rule-based. Governance-approved
 * model work is handled by backend shadow-mode routes, not direct client calls.
 */
const augmentVentilationCaseApi = async () => ({
  ok: true,
  aiOutput: null,
  errorCode: VENTILATION_API_ERROR_CODES.FEATURE_DISABLED,
});

export { VENTILATION_API_ERROR_CODES, augmentVentilationCaseApi };
