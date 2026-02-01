/**
 * AI SDK Client Tests
 * File: aiSdk.test.js
 */
jest.mock('@errors', () => ({ handleError: jest.fn() }));

import { requestCaseAnalysis, AI_ERROR_CODES, DEFAULT_MODEL } from '@services/aiSdk';

describe('aiSdk client', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('returns null when minimalPayload is null', async () => {
    await expect(requestCaseAnalysis(null, { apiKey: 'key' })).resolves.toBeNull();
    await expect(requestCaseAnalysis(undefined, { apiKey: 'key' })).resolves.toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns null when apiKey is missing or empty', async () => {
    await expect(requestCaseAnalysis({ condition: 'ARDS' }, {})).resolves.toBeNull();
    await expect(requestCaseAnalysis({ condition: 'ARDS' }, { apiKey: '' })).resolves.toBeNull();
    await expect(requestCaseAnalysis({ condition: 'ARDS' }, { apiKey: '   ' })).resolves.toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('exports DEFAULT_MODEL and AI_ERROR_CODES', () => {
    expect(DEFAULT_MODEL).toBe('gpt-4o-mini');
    expect(AI_ERROR_CODES.TIMEOUT).toBe('AI_TIMEOUT');
    expect(AI_ERROR_CODES.UNAUTHORIZED).toBe('AI_UNAUTHORIZED');
  });

  it('returns hints from successful OpenAI-compatible response', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({ hints: ['VENTILATION_HINT_1', 'VENTILATION_HINT_2'] }),
            },
          },
        ],
      }),
    });

    const result = await requestCaseAnalysis(
      { condition: 'ARDS', spo2: 88 },
      { apiKey: 'sk-test' }
    );
    expect(result).toEqual({ hints: ['VENTILATION_HINT_1', 'VENTILATION_HINT_2'] });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer sk-test',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('throws AI_UNAUTHORIZED on 401', async () => {
    global.fetch.mockResolvedValueOnce({ status: 401 });
    await expect(
      requestCaseAnalysis({ condition: 'ARDS' }, { apiKey: 'bad' })
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.UNAUTHORIZED });
  });

  it('throws AI_FORBIDDEN on 403', async () => {
    global.fetch.mockResolvedValueOnce({ status: 403 });
    await expect(
      requestCaseAnalysis({ condition: 'ARDS' }, { apiKey: 'x' })
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.FORBIDDEN });
  });

  it('uses default model when not provided', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ hints: [] }) } }],
      }),
    });
    await requestCaseAnalysis({ condition: 'x' }, { apiKey: 'k' });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.model).toBe(DEFAULT_MODEL);
  });

  it('uses custom model when provided', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ hints: [] }) } }],
      }),
    });
    await requestCaseAnalysis({ condition: 'x' }, { apiKey: 'k', model: 'gpt-4o' });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.model).toBe('gpt-4o');
  });
});
