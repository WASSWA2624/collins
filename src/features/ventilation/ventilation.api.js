/**
 * Ventilation API
 * Online augmentation hook point for future phases.
 * File: ventilation.api.js
 */

import { featureFlags as configFeatureFlags } from '@config';
import { aiSdk } from '@services';

const VENTILATION_API_ERROR_CODES = Object.freeze({
  OFFLINE_MODE: 'VENTILATION_ONLINE_AUGMENTATION_OFFLINE_MODE',
  OFFLINE: 'VENTILATION_ONLINE_AUGMENTATION_OFFLINE',
  FEATURE_DISABLED: 'VENTILATION_ONLINE_AUGMENTATION_FEATURE_DISABLED',
  INVALID_INPUT: 'VENTILATION_ONLINE_AUGMENTATION_INVALID_INPUT',
  AI_SDK_FAILED: 'VENTILATION_ONLINE_AUGMENTATION_AI_SDK_FAILED',
});

const resolveFlags = (flags) => (flags && typeof flags === 'object' ? flags : configFeatureFlags);

/**
 * Optional online augmentation call.
 *
 * Contract:
 * - Never required for core dataset path.
 * - Returns `aiOutput: null` when disabled/offline.
 * - Returns `{ ok:false, errorCode }` only for clearly invalid input or AI SDK failure.
 */
const augmentVentilationCaseApi = async ({ caseInput, isOnline, flags } = {}) => {
  const featureFlags = resolveFlags(flags);

  if (featureFlags?.OFFLINE_MODE === true) {
    return { ok: true, aiOutput: null, errorCode: VENTILATION_API_ERROR_CODES.OFFLINE_MODE };
  }

  if (featureFlags?.AI_AUGMENTATION_ENABLED !== true) {
    return { ok: true, aiOutput: null, errorCode: VENTILATION_API_ERROR_CODES.FEATURE_DISABLED };
  }

  if (isOnline !== true) {
    return { ok: true, aiOutput: null, errorCode: VENTILATION_API_ERROR_CODES.OFFLINE };
  }

  if (!caseInput || typeof caseInput !== 'object') {
    return { ok: false, aiOutput: null, errorCode: VENTILATION_API_ERROR_CODES.INVALID_INPUT };
  }

  try {
    const aiOutput = await aiSdk.requestCaseAnalysis(caseInput);
    return { ok: true, aiOutput: aiOutput ?? null, errorCode: null };
  } catch {
    return { ok: false, aiOutput: null, errorCode: VENTILATION_API_ERROR_CODES.AI_SDK_FAILED };
  }
};

export { VENTILATION_API_ERROR_CODES, augmentVentilationCaseApi };
