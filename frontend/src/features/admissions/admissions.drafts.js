/**
 * Admission Draft Storage
 * Stores normalized admission drafts with facility, idempotency, and client timing metadata.
 * File: admissions.drafts.js
 */
import { z } from 'zod';
import { handleError } from '@errors';
import { async as asyncStorage } from '@services/storage';
import { admissionDraftSchema, normalizeAdmissionDraft } from './admissions.model';

const ADMISSION_DRAFTS_STORAGE_KEY = 'admissions.drafts.v1';
const admissionDraftListSchema = z.array(admissionDraftSchema);

const normalizeDraftError = (error, fallbackCode) => {
  const normalized = handleError(error, { scope: 'features.admissions.drafts' });
  return normalized?.code || fallbackCode;
};

const loadAdmissionDrafts = async () => {
  try {
    const raw = await asyncStorage.getItem(ADMISSION_DRAFTS_STORAGE_KEY);
    if (!raw) return Object.freeze({ ok: true, drafts: Object.freeze([]), errorCode: null });

    if (!Array.isArray(raw)) {
      await asyncStorage.removeItem(ADMISSION_DRAFTS_STORAGE_KEY);
      return Object.freeze({ ok: false, drafts: Object.freeze([]), errorCode: 'ADMISSION_DRAFTS_CORRUPT' });
    }

    const parsed = admissionDraftListSchema.safeParse(raw);
    if (!parsed.success) {
      await asyncStorage.removeItem(ADMISSION_DRAFTS_STORAGE_KEY);
      return Object.freeze({ ok: false, drafts: Object.freeze([]), errorCode: 'ADMISSION_DRAFTS_CORRUPT' });
    }

    return Object.freeze({ ok: true, drafts: Object.freeze([...parsed.data]), errorCode: null });
  } catch (error) {
    return Object.freeze({
      ok: false,
      drafts: Object.freeze([]),
      errorCode: normalizeDraftError(error, 'ADMISSION_DRAFTS_LOAD_FAILED'),
    });
  }
};

const saveAdmissionDraft = async (draftInput, options = {}) => {
  try {
    const draft = normalizeAdmissionDraft(draftInput, options);
    const current = await loadAdmissionDrafts();
    const drafts = Array.isArray(current.drafts) ? current.drafts : [];
    const next = [
      draft,
      ...drafts.filter((item) => item.idempotencyKey !== draft.idempotencyKey && item.clientRecordId !== draft.clientRecordId),
    ].slice(0, options.maxDrafts || 25);
    const ok = await asyncStorage.setItem(ADMISSION_DRAFTS_STORAGE_KEY, next);
    return Object.freeze({
      ok: Boolean(ok),
      draft: Object.freeze(draft),
      errorCode: ok ? null : 'ADMISSION_DRAFT_SAVE_FAILED',
    });
  } catch (error) {
    return Object.freeze({
      ok: false,
      draft: null,
      errorCode: normalizeDraftError(error, 'ADMISSION_DRAFT_SAVE_FAILED'),
    });
  }
};

const removeAdmissionDraft = async (idempotencyKey) => {
  try {
    const key = typeof idempotencyKey === 'string' ? idempotencyKey.trim() : '';
    if (!key) return Object.freeze({ ok: true, errorCode: null });
    const current = await loadAdmissionDrafts();
    const drafts = Array.isArray(current.drafts) ? current.drafts : [];
    const next = drafts.filter((draft) => draft.idempotencyKey !== key && draft.clientRecordId !== key);
    const ok = await asyncStorage.setItem(ADMISSION_DRAFTS_STORAGE_KEY, next);
    return Object.freeze({ ok: Boolean(ok), errorCode: ok ? null : 'ADMISSION_DRAFT_DELETE_FAILED' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errorCode: normalizeDraftError(error, 'ADMISSION_DRAFT_DELETE_FAILED'),
    });
  }
};

const clearAdmissionDrafts = async () => {
  try {
    const ok = await asyncStorage.removeItem(ADMISSION_DRAFTS_STORAGE_KEY);
    return Object.freeze({ ok: Boolean(ok), errorCode: ok ? null : 'ADMISSION_DRAFTS_CLEAR_FAILED' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errorCode: normalizeDraftError(error, 'ADMISSION_DRAFTS_CLEAR_FAILED'),
    });
  }
};

export {
  ADMISSION_DRAFTS_STORAGE_KEY,
  loadAdmissionDrafts,
  saveAdmissionDraft,
  removeAdmissionDraft,
  clearAdmissionDrafts,
};
