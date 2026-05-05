/**
 * Ventilation API Tests
 * File: ventilation.api.test.js
 */
jest.mock('@services', () => ({
  aiSdk: {
    requestCaseAnalysis: jest.fn(),
  },
}));

jest.mock('@services/storage', () => ({
  aiKeyStorage: {
    getItem: jest.fn(),
  },
}));

import { VENTILATION_API_ERROR_CODES, augmentVentilationCaseApi } from '@features/ventilation';
import { aiSdk } from '@services';
import { aiKeyStorage } from '@services/storage';

describe('ventilation.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    aiKeyStorage.getItem.mockResolvedValue('test-api-key');
  });

  it('returns feature-disabled when OFFLINE_MODE is enabled', async () => {
    const res = await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS' },
      isOnline: true,
      flags: { OFFLINE_MODE: true, AI_AUGMENTATION_ENABLED: true },
    });

    expect(res).toEqual({
      ok: true,
      aiOutput: null,
      errorCode: VENTILATION_API_ERROR_CODES.FEATURE_DISABLED,
    });
    expect(aiSdk.requestCaseAnalysis).not.toHaveBeenCalled();
  });

  it('returns feature-disabled when AI_AUGMENTATION_ENABLED is disabled', async () => {
    const res = await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS' },
      isOnline: true,
      flags: { OFFLINE_MODE: false, AI_AUGMENTATION_ENABLED: false },
    });

    expect(res.ok).toBe(true);
    expect(res.aiOutput).toBeNull();
    expect(res.errorCode).toBe(VENTILATION_API_ERROR_CODES.FEATURE_DISABLED);
    expect(aiSdk.requestCaseAnalysis).not.toHaveBeenCalled();
  });

  it('returns feature-disabled when offline', async () => {
    const res = await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS' },
      isOnline: false,
      flags: { OFFLINE_MODE: false, AI_AUGMENTATION_ENABLED: true },
    });

    expect(res.ok).toBe(true);
    expect(res.aiOutput).toBeNull();
    expect(res.errorCode).toBe(VENTILATION_API_ERROR_CODES.FEATURE_DISABLED);
    expect(aiSdk.requestCaseAnalysis).not.toHaveBeenCalled();
  });

  it('keeps normal clinical workflows rule-based even when input is present', async () => {
    const res = await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS', patientName: 'Patient Example' },
      isOnline: true,
      flags: { OFFLINE_MODE: false, AI_AUGMENTATION_ENABLED: true },
    });

    expect(res).toEqual({
      ok: true,
      aiOutput: null,
      errorCode: VENTILATION_API_ERROR_CODES.FEATURE_DISABLED,
    });
    expect(aiSdk.requestCaseAnalysis).not.toHaveBeenCalled();
  });

  it('does not read API keys in clinical recommendation flows', async () => {
    aiKeyStorage.getItem.mockResolvedValueOnce(null);
    const res = await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS', spo2: 88 },
      isOnline: true,
      flags: { OFFLINE_MODE: false, AI_AUGMENTATION_ENABLED: true },
    });
    expect(res.ok).toBe(true);
    expect(res.aiOutput).toBeNull();
    expect(res.errorCode).toBe(VENTILATION_API_ERROR_CODES.FEATURE_DISABLED);
    expect(aiKeyStorage.getItem).not.toHaveBeenCalled();
    expect(aiSdk.requestCaseAnalysis).not.toHaveBeenCalled();
  });

  it('does not call AI SDK when enabled flags are supplied', async () => {
    aiSdk.requestCaseAnalysis.mockResolvedValue({ hints: ['VENTILATION_AI_HINT_1'] });

    const res = await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS', spo2: 88, sessionId: 's1' },
      isOnline: true,
      flags: { OFFLINE_MODE: false, AI_AUGMENTATION_ENABLED: true },
    });

    expect(aiSdk.requestCaseAnalysis).not.toHaveBeenCalled();
    expect(res).toEqual({
      ok: true,
      aiOutput: null,
      errorCode: VENTILATION_API_ERROR_CODES.FEATURE_DISABLED,
    });
  });

  it('ignores model flags for normal clinical workflows', async () => {
    aiSdk.requestCaseAnalysis.mockResolvedValue({ hints: [] });
    const res = await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS' },
      isOnline: true,
      flags: { AI_AUGMENTATION_ENABLED: true, model: 'gpt-4o' },
    });
    expect(res.errorCode).toBe(VENTILATION_API_ERROR_CODES.FEATURE_DISABLED);
    expect(aiSdk.requestCaseAnalysis).not.toHaveBeenCalled();
  });
});
