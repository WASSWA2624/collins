/**
 * Ventilation Session Storage (non-sensitive)
 * Persists/resumes ventilation assessment sessions locally.
 *
 * Storage boundary only (no UI/business logic).
 * File: ventilation.session.js
 */
import { z } from 'zod';
import { getItem, removeItem, setItem } from '@services/storage/async';
import { handleError } from '@errors';

const STORAGE_KEYS = Object.freeze({
  draft: 'ventilation.session.draft.v1',
  history: 'ventilation.session.history.v1',
});

const jsonObjectSchema = z.record(z.string(), z.any());

const sessionDraftSchema = z
  .object({
    sessionId: z.string().min(1),
    inputs: jsonObjectSchema.nullable().optional().default(null),
    recommendationSummary: jsonObjectSchema.nullable().optional().default(null),
    assessmentCurrentStep: z.number().int().min(0).optional().default(0),
    assessmentRecommendationSource: z.enum(['local', 'online_ai']).optional().default('local'),
    monitoringTimeSeries: z.array(z.any()).optional().default([]),
    updatedAt: z.number().int().nonnegative(),
  })
  .passthrough();

const historySchema = z.array(sessionDraftSchema).default([]);

const normalizeStorageFailure = (error, fallbackCode) => {
  const normalized = handleError(error, { scope: 'services.storage.ventilation.session' });
  return normalized?.code || fallbackCode || 'UNKNOWN_ERROR';
};

const loadDraft = async () => {
  try {
    const raw = await getItem(STORAGE_KEYS.draft);
    if (!raw) return Object.freeze({ ok: true, draft: null, errorCode: null });

    const parsed = sessionDraftSchema.safeParse(raw);
    if (parsed.success) {
      return Object.freeze({ ok: true, draft: Object.freeze(parsed.data), errorCode: null });
    }

    // Corruption: clear to keep app recoverable.
    await removeItem(STORAGE_KEYS.draft);
    return Object.freeze({ ok: false, draft: null, errorCode: 'VENTILATION_SESSION_DRAFT_CORRUPT' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      draft: null,
      errorCode: normalizeStorageFailure(error, 'VENTILATION_SESSION_DRAFT_LOAD_FAILED'),
    });
  }
};

const saveDraft = async (draft) => {
  try {
    const parsed = sessionDraftSchema.safeParse(draft);
    if (!parsed.success) return Object.freeze({ ok: false, errorCode: 'VENTILATION_SESSION_DRAFT_INVALID' });

    const ok = await setItem(STORAGE_KEYS.draft, parsed.data);
    return Object.freeze({ ok: Boolean(ok), errorCode: ok ? null : 'VENTILATION_SESSION_DRAFT_SAVE_FAILED' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errorCode: normalizeStorageFailure(error, 'VENTILATION_SESSION_DRAFT_SAVE_FAILED'),
    });
  }
};

const clearDraft = async () => {
  try {
    const ok = await removeItem(STORAGE_KEYS.draft);
    return Object.freeze({ ok: Boolean(ok), errorCode: ok ? null : 'VENTILATION_SESSION_DRAFT_CLEAR_FAILED' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errorCode: normalizeStorageFailure(error, 'VENTILATION_SESSION_DRAFT_CLEAR_FAILED'),
    });
  }
};

const loadHistory = async () => {
  try {
    const raw = await getItem(STORAGE_KEYS.history);
    const parsed = historySchema.safeParse(raw ?? []);
    if (parsed.success) {
      return Object.freeze({ ok: true, history: Object.freeze([...parsed.data]), errorCode: null });
    }

    // Corruption: clear and return empty history.
    await removeItem(STORAGE_KEYS.history);
    return Object.freeze({ ok: false, history: Object.freeze([]), errorCode: 'VENTILATION_SESSION_HISTORY_CORRUPT' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      history: Object.freeze([]),
      errorCode: normalizeStorageFailure(error, 'VENTILATION_SESSION_HISTORY_LOAD_FAILED'),
    });
  }
};

const appendHistory = async (entry, { maxEntries = 25 } = {}) => {
  try {
    const parsedEntry = sessionDraftSchema.safeParse(entry);
    if (!parsedEntry.success) {
      return Object.freeze({ ok: false, errorCode: 'VENTILATION_SESSION_HISTORY_ENTRY_INVALID' });
    }

    const current = await loadHistory();
    const list = Array.isArray(current.history) ? current.history : [];

    const normalizedMax = Number.isInteger(maxEntries) && maxEntries > 0 ? maxEntries : 25;

    // Keep newest per sessionId, ordered by updatedAt desc.
    const next = [parsedEntry.data, ...list].reduce((acc, item) => {
      const existing = acc.byId.get(item.sessionId);
      if (!existing || item.updatedAt > existing.updatedAt) {
        acc.byId.set(item.sessionId, item);
      }
      return acc;
    }, ({ byId: new Map() }));

    const merged = Array.from(next.byId.values()).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, normalizedMax);

    const ok = await setItem(STORAGE_KEYS.history, merged);
    return Object.freeze({
      ok: Boolean(ok),
      errorCode: ok ? null : 'VENTILATION_SESSION_HISTORY_SAVE_FAILED',
    });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errorCode: normalizeStorageFailure(error, 'VENTILATION_SESSION_HISTORY_SAVE_FAILED'),
    });
  }
};

const removeHistoryEntry = async (sessionId) => {
  try {
    const current = await loadHistory();
    const list = Array.isArray(current.history) ? current.history : [];
    const id = typeof sessionId === 'string' ? sessionId.trim() : '';
    if (!id) return Object.freeze({ ok: true, errorCode: null });

    const filtered = list.filter((item) => item.sessionId !== id);
    if (filtered.length === list.length) return Object.freeze({ ok: true, errorCode: null });

    const ok = await setItem(STORAGE_KEYS.history, filtered);
    return Object.freeze({
      ok: Boolean(ok),
      errorCode: ok ? null : 'VENTILATION_SESSION_HISTORY_DELETE_FAILED',
    });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errorCode: normalizeStorageFailure(error, 'VENTILATION_SESSION_HISTORY_DELETE_FAILED'),
    });
  }
};

export { STORAGE_KEYS, loadDraft, saveDraft, clearDraft, loadHistory, appendHistory, removeHistoryEntry };

