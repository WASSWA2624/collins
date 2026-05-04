import test from 'node:test';
import assert from 'node:assert/strict';
import { deidentifyPayload } from '../src/utils/deidentify.js';

test('removes patient identifiers and raw notes from nested export payloads', () => {
  const result = deidentifyPayload({
    optionalName: 'Patient Name',
    hospitalNumber: 'H123',
    rawNote: 'Free text note',
    patient: {
      ageYears: 44,
      phone: '+256...',
      sexForSizeCalculations: 'MALE',
    },
    abgTests: [{ ph: 7.31, notes: 'identifier details' }],
  });

  assert.equal(result.optionalName, undefined);
  assert.equal(result.hospitalNumber, undefined);
  assert.equal(result.rawNote, undefined);
  assert.equal(result.patient.phone, undefined);
  assert.equal(result.patient.ageYears, 44);
  assert.equal(result.abgTests[0].notes, undefined);
});
