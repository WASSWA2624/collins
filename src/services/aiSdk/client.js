/**
 * AI SDK Client
 * Stateless wrapper for optional online AI augmentation (OpenAI-compatible).
 * Rules: no business logic; no logging of payload/API key/tokens; errors normalized.
 * File: client.js
 */

const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_MAX_RETRIES = 3;
const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';

const AI_ERROR_CODES = Object.freeze({
  TIMEOUT: 'AI_TIMEOUT',
  UNAUTHORIZED: 'AI_UNAUTHORIZED',
  FORBIDDEN: 'AI_FORBIDDEN',
  RATE_LIMIT: 'AI_RATE_LIMIT',
  MODEL_UNAVAILABLE: 'AI_MODEL_UNAVAILABLE',
  MALFORMED_RESPONSE: 'AI_MALFORMED_RESPONSE',
  NETWORK: 'AI_UNAVAILABLE',
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Request ventilator recommendation hints from OpenAI-compatible API.
 * @param {object} minimalPayload - Minimal clinical input (no identifiers).
 * @param {{ apiKey: string, model?: string, timeoutMs?: number, maxRetries?: number }} options
 * @returns {Promise<{ hints?: string[] }|null>}
 */
const requestCaseAnalysis = async (minimalPayload, options = {}) => {
  if (!minimalPayload || typeof minimalPayload !== 'object') return null;
  const apiKey = options?.apiKey;
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) return null;

  const model = options?.model && typeof options.model === 'string' ? options.model.trim() : DEFAULT_MODEL;
  const timeoutMs = typeof options?.timeoutMs === 'number' && options.timeoutMs > 0 ? options.timeoutMs : DEFAULT_TIMEOUT_MS;
  const maxRetries = typeof options?.maxRetries === 'number' && options.maxRetries >= 0 ? options.maxRetries : DEFAULT_MAX_RETRIES;

  const systemPrompt = 'You are a clinical decision-support assistant. Respond only with a JSON object containing a single key "hints" (array of short clinical hint codes, e.g. VENTILATION_*). No explanations.';
  const userContent = JSON.stringify(minimalPayload);

  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(OPENAI_CHAT_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
          max_tokens: 256,
        }),
      });
      clearTimeout(timeoutId);

      if (res.status === 401) {
        const err = new Error('AI_UNAUTHORIZED');
        err.code = AI_ERROR_CODES.UNAUTHORIZED;
        err.status = 401;
        throw err;
      }
      if (res.status === 403) {
        const err = new Error('AI_FORBIDDEN');
        err.code = AI_ERROR_CODES.FORBIDDEN;
        err.status = 403;
        throw err;
      }
      if (res.status === 429) {
        lastError = new Error('AI_RATE_LIMIT');
        lastError.code = AI_ERROR_CODES.RATE_LIMIT;
        lastError.status = 429;
        if (attempt < maxRetries) {
          await sleep(Math.min(1000 * Math.pow(2, attempt), 10000));
          continue;
        }
        throw lastError;
      }
      if (res.status === 404 || res.status === 503) {
        lastError = new Error('AI_MODEL_UNAVAILABLE');
        lastError.code = AI_ERROR_CODES.MODEL_UNAVAILABLE;
        lastError.status = res.status;
        if (attempt < maxRetries) {
          await sleep(Math.min(1000 * Math.pow(2, attempt), 10000));
          continue;
        }
        throw lastError;
      }
      if (!res.ok) {
        const err = new Error('AI_MODEL_UNAVAILABLE');
        err.code = AI_ERROR_CODES.MODEL_UNAVAILABLE;
        err.status = res.status;
        throw err;
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== 'string' || !content.trim()) {
        const err = new Error('AI_MALFORMED_RESPONSE');
        err.code = AI_ERROR_CODES.MALFORMED_RESPONSE;
        throw err;
      }
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        const err = new Error('AI_MALFORMED_RESPONSE');
        err.code = AI_ERROR_CODES.MALFORMED_RESPONSE;
        throw err;
      }
      const hints = Array.isArray(parsed?.hints) ? parsed.hints.filter((h) => typeof h === 'string' && h.trim()) : [];
      return Object.freeze({ hints: Object.freeze([...hints]) });
    } catch (e) {
      if (e?.name === 'AbortError') {
        const err = new Error('AI_TIMEOUT');
        err.code = AI_ERROR_CODES.TIMEOUT;
        throw err;
      }
      if (e?.code && Object.values(AI_ERROR_CODES).includes(e.code)) throw e;
      if (e?.message?.toLowerCase?.().includes('fetch') || e?.message?.toLowerCase?.().includes('network')) {
        lastError = new Error('AI_UNAVAILABLE');
        lastError.code = AI_ERROR_CODES.NETWORK;
        if (attempt < maxRetries) {
          await sleep(Math.min(1000 * Math.pow(2, attempt), 10000));
          continue;
        }
        throw lastError;
      }
      lastError = e;
      if (attempt < maxRetries) {
        await sleep(Math.min(1000 * Math.pow(2, attempt), 10000));
        continue;
      }
      const err = new Error('AI_MALFORMED_RESPONSE');
      err.code = AI_ERROR_CODES.MALFORMED_RESPONSE;
      throw err;
    }
  }
  if (lastError?.code) throw lastError;
  const err = new Error('AI_MALFORMED_RESPONSE');
  err.code = AI_ERROR_CODES.MALFORMED_RESPONSE;
  throw err;
};

export { requestCaseAnalysis, AI_ERROR_CODES, DEFAULT_MODEL };
