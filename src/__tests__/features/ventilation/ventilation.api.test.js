/**
 * Ventilation API Tests
 * File: ventilation.api.test.js
 */
jest.mock('@services', () => ({
  aiSdk: {
    requestCaseAnalysis: jest.fn(),
  },
}));

import { VENTILATION_API_ERROR_CODES, augmentVentilationCaseApi } from '@features/ventilation';
import { aiSdk } from '@services';
 
describe('ventilation.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it('calls AI SDK when enabled + online', async () => {
    aiSdk.requestCaseAnalysis.mockResolvedValue({ hints: ['VENTILATION_AI_HINT_1'] });

    const res = await augmentVentilationCaseApi({
      caseInput: { condition: 'ARDS', spo2: 88 },
      isOnline: true,
      flags: { OFFLINE_MODE: false, AI_AUGMENTATION_ENABLED: true },
    });

    expect(aiSdk.requestCaseAnalysis).toHaveBeenCalledWith({ condition: 'ARDS', spo2: 88 });
    expect(res).toEqual({ ok: true, aiOutput: { hints: ['VENTILATION_AI_HINT_1'] }, errorCode: null });
  });
});
