/**
 * Ventilation API
 * Online augmentation: minimal payload, SecureStore key, single AI entry point.
 * File: ventilation.api.js
 */

import { getAiProviderConfig } from '@config/constants';
import { aiSdk } from '@services';
import { secure as secureStorage } from '@services/storage';

const VENTILATION_API_ERROR_CODES = Object.freeze({
  OFFLINE_MODE: 'VENTILATION_ONLINE_AUGMENTATION_OFFLINE_MODE',
  OFFLINE: 'VENTILATION_ONLINE_AUGMENTATION_OFFLINE',
  FEATURE_DISABLED: 'VENTILATION_ONLINE_AUGMENTATION_FEATURE_DISABLED',
  INVALID_INPUT: 'VENTILATION_ONLINE_AUGMENTATION_INVALID_INPUT',
  AI_SDK_FAILED: 'VENTILATION_ONLINE_AUGMENTATION_AI_SDK_FAILED',
  NO_API_KEY: 'VENTILATION_ONLINE_AUGMENTATION_NO_API_KEY',
});

/** Minimal clinical payload only (no identifiers, session IDs, or names). */
const buildMinimalCasePayload = (caseInput) => {
  if (!caseInput || typeof caseInput !== 'object') return null;
  const allowed = [
    'condition',
    'spo2',
    'pao2',
    'paco2',
    'ph',
    'respiratoryRate',
    'heartRate',
    'bloodPressure',
    'observations',
    'timeSeries',
  ];
  const out = {};
  allowed.forEach((key) => {
    if (caseInput[key] !== undefined && caseInput[key] !== null) {
      if (Array.isArray(caseInput[key])) out[key] = caseInput[key];
      else if (typeof caseInput[key] === 'object') out[key] = caseInput[key];
      else out[key] = caseInput[key];
    }
  });
  return Object.keys(out).length ? out : null;
};

/**
 * Optional online augmentation. API key from SecureStore; never in Redux or logs.
 * Returns aiOutput: null when disabled/offline/no key; { ok: false, errorCode } on failure.
 */
const augmentVentilationCaseApi = async ({ caseInput, isOnline, flags } = {}) => {
  const enabled = flags?.AI_AUGMENTATION_ENABLED === true;
  if (!enabled) {
    return { ok: true, aiOutput: null, errorCode: VENTILATION_API_ERROR_CODES.FEATURE_DISABLED };
  }
  if (flags?.OFFLINE_MODE === true) {
    return { ok: true, aiOutput: null, errorCode: VENTILATION_API_ERROR_CODES.OFFLINE_MODE };
  }
  if (isOnline !== true) {
    return { ok: true, aiOutput: null, errorCode: VENTILATION_API_ERROR_CODES.OFFLINE };
  }
  const minimalPayload = buildMinimalCasePayload(caseInput);
  if (!minimalPayload) {
    return { ok: false, aiOutput: null, errorCode: VENTILATION_API_ERROR_CODES.INVALID_INPUT };
  }
  const providerId = flags?.aiProviderId && typeof flags.aiProviderId === 'string' ? flags.aiProviderId.trim() : 'openai';
  const providerConfig = getAiProviderConfig(providerId);
  if (!providerConfig) {
    return { ok: true, aiOutput: null, errorCode: VENTILATION_API_ERROR_CODES.NO_API_KEY };
  }
  const apiKey = await secureStorage.getItem(providerConfig.storageKey);
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    return { ok: true, aiOutput: null, errorCode: VENTILATION_API_ERROR_CODES.NO_API_KEY };
  }
  const model = flags?.model && typeof flags.model === 'string' ? flags.model.trim() : undefined;
  try {
    const aiOutput = await aiSdk.requestCaseAnalysis(minimalPayload, { apiKey: apiKey.trim(), model });
    return { ok: true, aiOutput: aiOutput ?? null, errorCode: null };
  } catch {
    return { ok: false, aiOutput: null, errorCode: VENTILATION_API_ERROR_CODES.AI_SDK_FAILED };
  }
};

export { VENTILATION_API_ERROR_CODES, augmentVentilationCaseApi };
