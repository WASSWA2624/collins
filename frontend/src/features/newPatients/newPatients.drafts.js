/**
 * New Patient Draft Storage
 * Stores normalized New Patient drafts with facility, idempotency, and client timing metadata.
 * File: newPatients.drafts.js
 */
import { z } from 'zod';
import { handleError } from '@errors';
import { async as asyncStorage } from '@services/storage';
import { newPatientDraftSchema, normalizeNewPatientDraft } from './newPatients.model';

const NEW_PATIENT_DRAFTS_STORAGE_KEY = 'new-patients.drafts.v1';
const newPatientDraftListSchema = z.array(newPatientDraftSchema);

const normalizeDraftError = (error, fallbackCode) => {
  const normalized = handleError(error, { scope: 'features.newPatients.drafts' });
  return normalized?.code || fallbackCode;
};

const loadNewPatientDrafts = async () => {
  try {
    const raw = await asyncStorage.getItem(NEW_PATIENT_DRAFTS_STORAGE_KEY);
    if (!raw) return Object.freeze({ ok: true, drafts: Object.freeze([]), errorCode: null });

    if (!Array.isArray(raw)) {
      await asyncStorage.removeItem(NEW_PATIENT_DRAFTS_STORAGE_KEY);
      return Object.freeze({ ok: false, drafts: Object.freeze([]), errorCode: 'NEW_PATIENT_DRAFTS_CORRUPT' });
    }

    const parsed = newPatientDraftListSchema.safeParse(raw);
    if (!parsed.success) {
      await asyncStorage.removeItem(NEW_PATIENT_DRAFTS_STORAGE_KEY);
      return Object.freeze({ ok: false, drafts: Object.freeze([]), errorCode: 'NEW_PATIENT_DRAFTS_CORRUPT' });
    }

    return Object.freeze({ ok: true, drafts: Object.freeze([...parsed.data]), errorCode: null });
  } catch (error) {
    return Object.freeze({
      ok: false,
      drafts: Object.freeze([]),
      errorCode: normalizeDraftError(error, 'NEW_PATIENT_DRAFTS_LOAD_FAILED'),
    });
  }
};

const saveNewPatientDraft = async (draftInput, options = {}) => {
  try {
    const draft = normalizeNewPatientDraft(draftInput, options);
    const current = await loadNewPatientDrafts();
    const drafts = Array.isArray(current.drafts) ? current.drafts : [];
    const next = [
      draft,
      ...drafts.filter((item) => item.idempotencyKey !== draft.idempotencyKey && item.clientRecordId !== draft.clientRecordId),
    ].slice(0, options.maxDrafts || 25);
    const ok = await asyncStorage.setItem(NEW_PATIENT_DRAFTS_STORAGE_KEY, next);
    return Object.freeze({
      ok: Boolean(ok),
      draft: Object.freeze(draft),
      errorCode: ok ? null : 'NEW_PATIENT_DRAFT_SAVE_FAILED',
    });
  } catch (error) {
    return Object.freeze({
      ok: false,
      draft: null,
      errorCode: normalizeDraftError(error, 'NEW_PATIENT_DRAFT_SAVE_FAILED'),
    });
  }
};

const removeNewPatientDraft = async (idempotencyKey) => {
  try {
    const key = typeof idempotencyKey === 'string' ? idempotencyKey.trim() : '';
    if (!key) return Object.freeze({ ok: true, errorCode: null });
    const current = await loadNewPatientDrafts();
    const drafts = Array.isArray(current.drafts) ? current.drafts : [];
    const next = drafts.filter((draft) => draft.idempotencyKey !== key && draft.clientRecordId !== key);
    const ok = await asyncStorage.setItem(NEW_PATIENT_DRAFTS_STORAGE_KEY, next);
    return Object.freeze({ ok: Boolean(ok), errorCode: ok ? null : 'NEW_PATIENT_DRAFT_DELETE_FAILED' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errorCode: normalizeDraftError(error, 'NEW_PATIENT_DRAFT_DELETE_FAILED'),
    });
  }
};

const clearNewPatientDrafts = async () => {
  try {
    const ok = await asyncStorage.removeItem(NEW_PATIENT_DRAFTS_STORAGE_KEY);
    return Object.freeze({ ok: Boolean(ok), errorCode: ok ? null : 'NEW_PATIENT_DRAFTS_CLEAR_FAILED' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errorCode: normalizeDraftError(error, 'NEW_PATIENT_DRAFTS_CLEAR_FAILED'),
    });
  }
};

export {
  NEW_PATIENT_DRAFTS_STORAGE_KEY,
  loadNewPatientDrafts,
  saveNewPatientDraft,
  removeNewPatientDraft,
  clearNewPatientDrafts,
};
