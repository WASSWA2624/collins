/**
 * Dataset Capture Draft Storage
 * Persists one scoped structured dataset draft locally until backend save succeeds.
 * File: datasetCapture.drafts.js
 */
import { z } from 'zod';
import { handleError } from '@errors';
import { async as asyncStorage } from '@services/storage';
import { DATASET_CAPTURE_SCHEMA_VERSION, createDatasetCaptureClientRecordId } from './datasetCapture.model';

const DATASET_CAPTURE_DRAFT_STORAGE_KEY = 'dataset.capture.draft.v1';

const fieldValuesSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]));

const datasetCaptureDraftSchema = z.object({
  schemaVersion: z.literal(DATASET_CAPTURE_SCHEMA_VERSION).default(DATASET_CAPTURE_SCHEMA_VERSION),
  clientRecordId: z.string().trim().min(1),
  idempotencyKey: z.string().trim().min(8).max(160),
  fieldValues: fieldValuesSchema.default({}),
  activeStepIndex: z.number().int().min(0).default(0),
  lastCompletedStepIndex: z.number().int().min(0).default(0),
  userId: z.string().nullable().optional().default(null),
  facilityId: z.string().nullable().optional().default(null),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const normalizeScopePart = (value) => {
  if (value == null) return null;
  const normalized = String(value).trim().replace(/[^a-zA-Z0-9_-]+/g, '_');
  return normalized || null;
};

const resolveDatasetCaptureDraftKey = (scope = {}) => {
  const userId = normalizeScopePart(scope?.userId);
  const facilityId = normalizeScopePart(scope?.facilityId || scope?.activeFacilityId);
  if (!userId && !facilityId) return DATASET_CAPTURE_DRAFT_STORAGE_KEY;
  return `${DATASET_CAPTURE_DRAFT_STORAGE_KEY}.${userId || 'anonymous'}.${facilityId || 'no-facility'}`;
};

const normalizeDraftError = (error, fallbackCode) => {
  const normalized = handleError(error, { scope: 'features.datasetCapture.drafts' });
  return normalized?.code || fallbackCode;
};

const createDatasetCaptureDraftIdentity = () => {
  const clientRecordId = createDatasetCaptureClientRecordId();
  return Object.freeze({
    clientRecordId,
    idempotencyKey: clientRecordId,
  });
};

const createDatasetCaptureDraft = (draft = {}, scope = {}) => {
  const now = new Date().toISOString();
  const identity = createDatasetCaptureDraftIdentity();

  return {
    schemaVersion: DATASET_CAPTURE_SCHEMA_VERSION,
    clientRecordId: draft.clientRecordId || identity.clientRecordId,
    idempotencyKey: draft.idempotencyKey || identity.idempotencyKey,
    fieldValues: draft.fieldValues || {},
    activeStepIndex: Number.isInteger(draft.activeStepIndex) ? draft.activeStepIndex : 0,
    lastCompletedStepIndex: Number.isInteger(draft.lastCompletedStepIndex) ? draft.lastCompletedStepIndex : 0,
    userId: scope.userId || draft.userId || null,
    facilityId: scope.facilityId || scope.activeFacilityId || draft.facilityId || null,
    createdAt: draft.createdAt || now,
    updatedAt: draft.updatedAt || now,
  };
};

const loadDatasetCaptureDraft = async (scope) => {
  const key = resolveDatasetCaptureDraftKey(scope);
  try {
    const raw = await asyncStorage.getItem(key);
    if (!raw) return Object.freeze({ ok: true, draft: null, errorCode: null });

    const parsed = datasetCaptureDraftSchema.safeParse(raw);
    if (parsed.success) {
      return Object.freeze({ ok: true, draft: Object.freeze(parsed.data), errorCode: null });
    }

    await asyncStorage.removeItem(key);
    return Object.freeze({ ok: false, draft: null, errorCode: 'DATASET_CAPTURE_DRAFT_CORRUPT' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      draft: null,
      errorCode: normalizeDraftError(error, 'DATASET_CAPTURE_DRAFT_LOAD_FAILED'),
    });
  }
};

const saveDatasetCaptureDraft = async (draftInput, scope) => {
  const key = resolveDatasetCaptureDraftKey(scope);
  try {
    const draft = createDatasetCaptureDraft(
      {
        ...draftInput,
        updatedAt: new Date().toISOString(),
      },
      scope
    );
    const parsed = datasetCaptureDraftSchema.safeParse(draft);
    if (!parsed.success) return Object.freeze({ ok: false, draft: null, errorCode: 'DATASET_CAPTURE_DRAFT_INVALID' });

    const ok = await asyncStorage.setItem(key, parsed.data);
    return Object.freeze({
      ok: Boolean(ok),
      draft: Object.freeze(parsed.data),
      errorCode: ok ? null : 'DATASET_CAPTURE_DRAFT_SAVE_FAILED',
    });
  } catch (error) {
    return Object.freeze({
      ok: false,
      draft: null,
      errorCode: normalizeDraftError(error, 'DATASET_CAPTURE_DRAFT_SAVE_FAILED'),
    });
  }
};

const clearDatasetCaptureDraft = async (scope) => {
  const key = resolveDatasetCaptureDraftKey(scope);
  try {
    const ok = await asyncStorage.removeItem(key);
    return Object.freeze({ ok: Boolean(ok), errorCode: ok ? null : 'DATASET_CAPTURE_DRAFT_CLEAR_FAILED' });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errorCode: normalizeDraftError(error, 'DATASET_CAPTURE_DRAFT_CLEAR_FAILED'),
    });
  }
};

export {
  DATASET_CAPTURE_DRAFT_STORAGE_KEY,
  clearDatasetCaptureDraft,
  createDatasetCaptureDraft,
  createDatasetCaptureDraftIdentity,
  loadDatasetCaptureDraft,
  resolveDatasetCaptureDraftKey,
  saveDatasetCaptureDraft,
};
