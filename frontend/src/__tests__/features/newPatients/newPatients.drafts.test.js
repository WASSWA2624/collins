/**
 * New Patient Draft Tests
 * File: newPatients.drafts.test.js
 */
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
  NEW_PATIENT_DRAFTS_STORAGE_KEY,
  loadNewPatientDrafts,
  removeNewPatientDraft,
  saveNewPatientDraft,
} from '@features/newPatients';
import { async as asyncStorage } from '@services/storage';

const now = () => new Date('2026-05-05T08:00:00.000Z');

describe('newPatients.drafts', () => {
  beforeEach(() => {
    Object.keys(storage).forEach((key) => delete storage[key]);
    jest.clearAllMocks();
  });

  it('saves normalized drafts with facility and offline metadata', async () => {
    const result = await saveNewPatientDraft({
      facilityId: 'facility-1',
      patient: {
        patientPathway: 'trauma',
        actualWeightKg: 'unknown',
      },
    }, { now, nonce: 'draft-1' });

    expect(result.ok).toBe(true);
    expect(result.draft.facilityId).toBe('facility-1');
    expect(result.draft.patient.patientPathway).toBe('TRAUMA');
    expect(result.draft.patient.actualWeightKg).toBeNull();
    expect(result.draft.clientCreatedAt).toBe('2026-05-05T08:00:00.000Z');
    expect(result.draft.idempotencyKey).toMatch(/^new-patient:facility-1:/);
    expect(asyncStorage.setItem).toHaveBeenCalledWith(NEW_PATIENT_DRAFTS_STORAGE_KEY, [result.draft]);
  });

  it('loads, replaces, and removes drafts by idempotency key', async () => {
    const first = await saveNewPatientDraft({
      facilityId: 'facility-1',
      patient: { patientPathway: 'adult' },
      idempotencyKey: 'offline-admission-1',
    }, { now });
    await saveNewPatientDraft({
      ...first.draft,
      patient: { patientPathway: 'medical' },
      idempotencyKey: 'offline-admission-1',
    }, { now });

    const loaded = await loadNewPatientDrafts();
    expect(loaded.ok).toBe(true);
    expect(loaded.drafts).toHaveLength(1);
    expect(loaded.drafts[0].patient.patientPathway).toBe('MEDICAL');

    const removed = await removeNewPatientDraft('offline-admission-1');
    expect(removed.ok).toBe(true);
    expect((await loadNewPatientDrafts()).drafts).toEqual([]);
  });

  it('clears corrupt draft storage', async () => {
    storage[NEW_PATIENT_DRAFTS_STORAGE_KEY] = [{ facilityId: 'facility-1' }];

    const loaded = await loadNewPatientDrafts();

    expect(loaded.ok).toBe(false);
    expect(loaded.errorCode).toBe('NEW_PATIENT_DRAFTS_CORRUPT');
    expect(asyncStorage.removeItem).toHaveBeenCalledWith(NEW_PATIENT_DRAFTS_STORAGE_KEY);
  });
});
