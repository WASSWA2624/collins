/**
 * Dataset Capture Draft Tests
 * File: datasetCapture.drafts.test.js
 */
/* eslint-disable import/first */
const storage = {};

jest.mock('@services/storage', () => ({
  async: {
    getItem: jest.fn((key) => Promise.resolve(storage[key] ?? null)),
    setItem: jest.fn((key, value) => {
      storage[key] = value;
      return Promise.resolve(true);
    }),
    removeItem: jest.fn((key) => {
      delete storage[key];
      return Promise.resolve(true);
    }),
  },
}));

jest.mock('@errors', () => ({
  handleError: jest.fn((error) => ({ code: error?.code || 'UNKNOWN_ERROR' })),
}));

import {
  clearDatasetCaptureDraft,
  createDatasetCaptureDraft,
  loadDatasetCaptureDraft,
  resolveDatasetCaptureDraftKey,
  saveDatasetCaptureDraft,
} from '@features/dataset-capture';
import { async as asyncStorage } from '@services/storage';

describe('datasetCapture.drafts', () => {
  beforeEach(() => {
    Object.keys(storage).forEach((key) => delete storage[key]);
    jest.clearAllMocks();
  });

  it('saves and reloads a scoped draft with step position and stable submission identity', async () => {
    const scope = { userId: 'user-1', facilityId: 'facility-1' };
    const draft = createDatasetCaptureDraft({
      clientRecordId: 'capture-1',
      idempotencyKey: 'capture-idem-1',
      fieldValues: {
        'caseContext.primaryDiagnosis': 'COPD',
        'patient.ageYears': '54',
      },
      activeStepIndex: 3,
      lastCompletedStepIndex: 2,
      createdAt: '2026-05-05T08:00:00.000Z',
    }, scope);

    const saved = await saveDatasetCaptureDraft(draft, scope);
    const loaded = await loadDatasetCaptureDraft(scope);

    expect(saved.ok).toBe(true);
    expect(loaded.ok).toBe(true);
    expect(loaded.draft.clientRecordId).toBe('capture-1');
    expect(loaded.draft.idempotencyKey).toBe('capture-idem-1');
    expect(loaded.draft.activeStepIndex).toBe(3);
    expect(loaded.draft.lastCompletedStepIndex).toBe(2);
    expect(loaded.draft.fieldValues['patient.ageYears']).toBe('54');
    expect(asyncStorage.setItem).toHaveBeenCalledWith(resolveDatasetCaptureDraftKey(scope), saved.draft);
  });

  it('clears only the scoped dataset capture draft', async () => {
    const scope = { userId: 'user-1', facilityId: 'facility-1' };
    await saveDatasetCaptureDraft({
      clientRecordId: 'capture-1',
      idempotencyKey: 'capture-idem-1',
      fieldValues: { 'patient.ageYears': '54' },
      createdAt: '2026-05-05T08:00:00.000Z',
    }, scope);

    const cleared = await clearDatasetCaptureDraft(scope);
    const loaded = await loadDatasetCaptureDraft(scope);

    expect(cleared.ok).toBe(true);
    expect(loaded.draft).toBeNull();
    expect(asyncStorage.removeItem).toHaveBeenCalledWith(resolveDatasetCaptureDraftKey(scope));
  });
});
