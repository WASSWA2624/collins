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

const normalizeScopePart = (value) => {
  if (value == null) return null;
  const normalized = String(value).trim().replace(/[^a-zA-Z0-9_-]+/g, '_');
  return normalized || null;
};

const buildScopeSuffix = (scope = {}) => {
  const userId = normalizeScopePart(scope?.userId);
  const facilityId = normalizeScopePart(scope?.facilityId || scope?.activeFacilityId);
  if (!userId && !facilityId) return '';
  return [userId || 'anonymous', facilityId || 'no-facility'].join('.');
};

const resolveStorageKeys = (scope) => {
  const suffix = buildScopeSuffix(scope);
  if (!suffix) return STORAGE_KEYS;
  return Object.freeze({
    draft: `${STORAGE_KEYS.draft}.${suffix}`,
    history: `${STORAGE_KEYS.history}.${suffix}`,
  });
};

const sessionDraftSchema = z
  .object({
    sessionId: z.string().min(1),
    inputs: jsonObjectSchema.nullable().optional().default(null),
    recommendationSummary: jsonObjectSchema.nullable().optional().default(null),
    assessmentCurrentStep: z.number().int().min(0).optional().default(0),
    assessmentRecommendationSource: z.enum(['local', 'online_ai']).optional().default('local'),
    monitoringTimeSeries: z.array(z.any()).optional().default([]),
    userId: z.string().nullable().optional().default(null),
    facilityId: z.string().nullable().optional().default(null),
    updatedAt: z.number().int().nonnegative(),
  })
  .passthrough();

const historySchema = z.array(sessionDraftSchema).default([]);

const normalizeStorageFailure = (error, fallbackCode) => {
  const normalized = handleError(error, { scope: 'services.storage.ventilation.session' });
  return normalized?.code || fallbackCode || 'UNKNOWN_ERROR';
};

const loadDraft = async (scope) => {
  const keys = resolveStorageKeys(scope);
  try {
    const raw = await getItem(keys.draft);
    if (!raw) return Object.freeze({ ok: true, draft: null, errorCode: null });

    const parsed = sessionDraftSchema.safeParse(raw);
    if (parsed.success) {
      return Object.freeze({ ok: true, draft: Object.freeze(parsed.data), errorCode: null });
    }

    // Corruption: clear to keep app recoverable.
    await removeItem(keys.draft);
    return Object.freeze({ ok: false, draft: null, errorCode: 'VENTILATION_SESSION_DRAFT_CORRUPT' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      draft: null,
      errorCode: normalizeStorageFailure(error, 'VENTILATION_SESSION_DRAFT_LOAD_FAILED'),
    });
  }
};

const saveDraft = async (draft, scope) => {
  const keys = resolveStorageKeys(scope);
  try {
    const parsed = sessionDraftSchema.safeParse(draft);
    if (!parsed.success) return Object.freeze({ ok: false, errorCode: 'VENTILATION_SESSION_DRAFT_INVALID' });

    const ok = await setItem(keys.draft, parsed.data);
    return Object.freeze({ ok: Boolean(ok), errorCode: ok ? null : 'VENTILATION_SESSION_DRAFT_SAVE_FAILED' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errorCode: normalizeStorageFailure(error, 'VENTILATION_SESSION_DRAFT_SAVE_FAILED'),
    });
  }
};

const clearDraft = async (scope) => {
  const keys = resolveStorageKeys(scope);
  try {
    const ok = await removeItem(keys.draft);
    return Object.freeze({ ok: Boolean(ok), errorCode: ok ? null : 'VENTILATION_SESSION_DRAFT_CLEAR_FAILED' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errorCode: normalizeStorageFailure(error, 'VENTILATION_SESSION_DRAFT_CLEAR_FAILED'),
    });
  }
};

const loadHistory = async (scope) => {
  const keys = resolveStorageKeys(scope);
  try {
    const raw = await getItem(keys.history);
    const parsed = historySchema.safeParse(raw ?? []);
    if (parsed.success) {
      return Object.freeze({ ok: true, history: Object.freeze([...parsed.data]), errorCode: null });
    }

    // Corruption: clear and return empty history.
    await removeItem(keys.history);
    return Object.freeze({ ok: false, history: Object.freeze([]), errorCode: 'VENTILATION_SESSION_HISTORY_CORRUPT' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      history: Object.freeze([]),
      errorCode: normalizeStorageFailure(error, 'VENTILATION_SESSION_HISTORY_LOAD_FAILED'),
    });
  }
};

const appendHistory = async (entry, options = {}) => {
  const { maxEntries = 25, scope, ...scopeParts } = options || {};
  const storageScope = scope || scopeParts;
  const keys = resolveStorageKeys(storageScope);
  try {
    const parsedEntry = sessionDraftSchema.safeParse(entry);
    if (!parsedEntry.success) {
      return Object.freeze({ ok: false, errorCode: 'VENTILATION_SESSION_HISTORY_ENTRY_INVALID' });
    }

    const current = await loadHistory(storageScope);
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

    const ok = await setItem(keys.history, merged);
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

const removeHistoryEntry = async (sessionId, scope) => {
  const keys = resolveStorageKeys(scope);
  try {
    const current = await loadHistory(scope);
    const list = Array.isArray(current.history) ? current.history : [];
    const id = typeof sessionId === 'string' ? sessionId.trim() : '';
    if (!id) return Object.freeze({ ok: true, errorCode: null });

    const filtered = list.filter((item) => item.sessionId !== id);
    if (filtered.length === list.length) return Object.freeze({ ok: true, errorCode: null });

    const ok = await setItem(keys.history, filtered);
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

export {
  STORAGE_KEYS,
  buildScopeSuffix,
  resolveStorageKeys,
  loadDraft,
  saveDraft,
  clearDraft,
  loadHistory,
  appendHistory,
  removeHistoryEntry,
};
