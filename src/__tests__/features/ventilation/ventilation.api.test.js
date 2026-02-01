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
  secure: {
    getItem: jest.fn(),
  },
}));

import { VENTILATION_API_ERROR_CODES, augmentVentilationCaseApi } from '@features/ventilation';
import { aiSdk } from '@services';
import { secure } from '@services/storage';

describe('ventilation.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    secure.getItem.mockResolvedValue('test-api-key');
  });

  it('skips when OFFLINE_MODE is enabled', async () => {
    const res = await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS' },
      isOnline: true,
      flags: { OFFLINE_MODE: true, AI_AUGMENTATION_ENABLED: true },
    });

    expect(res).toEqual({
      ok: true,
      aiOutput: null,
      errorCode: VENTILATION_API_ERROR_CODES.OFFLINE_MODE,
    });
    expect(aiSdk.requestCaseAnalysis).not.toHaveBeenCalled();
  });

  it('skips when AI_AUGMENTATION_ENABLED is disabled', async () => {
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

  it('skips when offline', async () => {
    const res = await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS' },
      isOnline: false,
      flags: { OFFLINE_MODE: false, AI_AUGMENTATION_ENABLED: true },
    });

    expect(res.ok).toBe(true);
    expect(res.aiOutput).toBeNull();
    expect(res.errorCode).toBe(VENTILATION_API_ERROR_CODES.OFFLINE);
    expect(aiSdk.requestCaseAnalysis).not.toHaveBeenCalled();
  });

  it('returns invalid-input when caseInput is missing', async () => {
    const res = await augmentVentilationCaseApi({
      caseInput: null,
      isOnline: true,
      flags: { OFFLINE_MODE: false, AI_AUGMENTATION_ENABLED: true },
    });

    expect(res).toEqual({
      ok: false,
      aiOutput: null,
      errorCode: VENTILATION_API_ERROR_CODES.INVALID_INPUT,
    });
    expect(aiSdk.requestCaseAnalysis).not.toHaveBeenCalled();
  });

  it('skips when no API key in SecureStore', async () => {
    secure.getItem.mockResolvedValueOnce(null);
    const res = await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS', spo2: 88 },
      isOnline: true,
      flags: { OFFLINE_MODE: false, AI_AUGMENTATION_ENABLED: true },
    });
    expect(res.ok).toBe(true);
    expect(res.aiOutput).toBeNull();
    expect(res.errorCode).toBe(VENTILATION_API_ERROR_CODES.NO_API_KEY);
    expect(aiSdk.requestCaseAnalysis).not.toHaveBeenCalled();
  });

  it('calls AI SDK with minimal payload when enabled + online + key set', async () => {
    aiSdk.requestCaseAnalysis.mockResolvedValue({ hints: ['VENTILATION_AI_HINT_1'] });

    const res = await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS', spo2: 88, sessionId: 's1' },
      isOnline: true,
      flags: { OFFLINE_MODE: false, AI_AUGMENTATION_ENABLED: true },
    });

    expect(aiSdk.requestCaseAnalysis).toHaveBeenCalledWith(
      expect.objectContaining({ condition: 'ARDS', spo2: 88 }),
      expect.objectContaining({ apiKey: 'test-api-key' })
    );
    expect(res).toEqual({ ok: true, aiOutput: { hints: ['VENTILATION_AI_HINT_1'] }, errorCode: null });
  });

  it('passes model from flags to AI SDK', async () => {
    aiSdk.requestCaseAnalysis.mockResolvedValue({ hints: [] });
    await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS' },
      isOnline: true,
      flags: { AI_AUGMENTATION_ENABLED: true, model: 'gpt-4o' },
    });
    expect(aiSdk.requestCaseAnalysis).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ model: 'gpt-4o' })
    );
  });
});
