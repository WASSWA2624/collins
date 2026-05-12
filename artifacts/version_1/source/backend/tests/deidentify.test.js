import test from 'node:test';
import assert from 'node:assert/strict';
import { deidentifyPayload } from '../src/utils/deidentify.js';

test('removes patient identifiers and raw notes from nested export payloads', () => {
  const result = deidentifyPayload({
    optionalName: 'Patient Name',
    hospitalNumber: 'H123',
    rawNote: 'Free text note',
    patient: {
      id: 'patient-id',
      appPatientCode: 'COL-P-123',
      ageYears: 44,
      phone: '+256...',
      sexForSizeCalculations: 'MALE',
    },
    admission: {
      id: 'admission-id',
      appAdmissionCode: 'COL-A-123',
      status: 'ACTIVE',
    },
    abgTests: [{ id: 'abg-id', admissionId: 'admission-id', deviceId: 'device-id', ph: 7.31, notes: 'identifier details' }],
  });

  assert.equal(result.optionalName, undefined);
  assert.equal(result.hospitalNumber, undefined);
  assert.equal(result.rawNote, undefined);
  assert.equal(result.admission.id, undefined);
  assert.equal(result.admission.appAdmissionCode, undefined);
  assert.equal(result.admission.status, 'ACTIVE');
  assert.equal(result.patient.id, undefined);
  assert.equal(result.patient.appPatientCode, undefined);
  assert.equal(result.patient.phone, undefined);
  assert.equal(result.patient.ageYears, 44);
  assert.equal(result.abgTests[0].id, undefined);
  assert.equal(result.abgTests[0].admissionId, undefined);
  assert.equal(result.abgTests[0].deviceId, undefined);
  assert.equal(result.abgTests[0].notes, undefined);
});
