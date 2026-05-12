import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveIdempotency } from '../src/utils/idempotency.js';
import { sha256 } from '../src/utils/crypto.js';

test('idempotency ignores volatile client update timestamps while preserving payload conflicts', async () => {
  const operation = 'admission.create';
  const existingPayload = {
    idempotencyKey: 'new-patient-1:patient-reason',
    clientRecordId: 'new-patient-1',
    clientUpdatedAt: '2026-05-11T08:00:00.000Z',
    patient: {
      firstName: 'Jane',
      patientPathway: 'ADULT',
    },
  };
  const existing = {
    operation,
    requestHash: sha256({
      operation,
      payload: {
        idempotencyKey: 'new-patient-1:patient-reason',
        clientRecordId: 'new-patient-1',
        patient: {
          firstName: 'Jane',
          patientPathway: 'ADULT',
        },
      },
    }),
    responseJson: { admission: { id: 'admission-1' } },
  };
  const tx = {
    idempotencyRecord: {
      findUnique: async () => existing,
    },
  };

  const duplicate = await resolveIdempotency({
    tx,
    userId: 'user-1',
    key: 'new-patient-1:patient-reason',
    operation,
    payload: {
      ...existingPayload,
      clientUpdatedAt: '2026-05-11T08:05:00.000Z',
    },
  });

  assert.equal(duplicate.shouldRun, false);
  assert.deepEqual(duplicate.responseJson, existing.responseJson);

  await assert.rejects(
    () => resolveIdempotency({
      tx,
      userId: 'user-1',
      key: 'new-patient-1:patient-reason',
      operation,
      payload: {
        ...existingPayload,
        patient: {
          firstName: 'Grace',
          patientPathway: 'ADULT',
        },
      },
    }),
    /Idempotency key conflict/
  );
});
