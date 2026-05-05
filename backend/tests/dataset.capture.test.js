import test from 'node:test';
import assert from 'node:assert/strict';
import { createDatasetImportSchema } from '../src/modules/dataset/dataset.validators.js';
import {
  assertDatasetSourceTypeAllowed,
  buildReviewedAdmissionDatasetPayload,
} from '../src/modules/dataset/dataset.service.js';

test('dataset import contract rejects demo and existing training source types', () => {
  const result = createDatasetImportSchema.safeParse({
    body: {
      facilityId: 'facility-1',
      sourceType: 'demo_training_seed',
      structuredPreviewJson: { patient: { ageYears: 45 } },
    },
    params: {},
    query: {},
  });

  assert.equal(result.success, false);
});

test('dataset source policy blocks unsafe source types before approval or export', () => {
  assert.throws(
    () => assertDatasetSourceTypeAllowed('sample_fixture'),
    /cannot enter approved dataset flows/i,
  );
  assert.doesNotThrow(() => assertDatasetSourceTypeAllowed('structured_import'));
});

test('reviewed admission dataset payload keeps approved child records only and strips identifiers', () => {
  const payload = buildReviewedAdmissionDatasetPayload({
    id: 'admission-1',
    appAdmissionCode: 'ADM-001',
    admittedAt: new Date('2026-05-01T00:00:00.000Z'),
    status: 'ACTIVE',
    reasonForVentilation: 'Respiratory failure',
    patient: {
      id: 'patient-1',
      appPatientCode: 'PAT-001',
      optionalName: 'Patient Name',
      hospitalNumber: 'H123',
      patientPathway: 'ADULT',
      ageYears: 54,
      sexForSizeCalculations: 'MALE',
    },
    clinicalSnapshots: [{ id: 'snapshot-1', admissionId: 'admission-1', spo2: 94 }],
    abgTests: [
      { id: 'abg-approved', admissionId: 'admission-1', reviewStatus: 'APPROVED', ph: 7.34 },
      { id: 'abg-pending', admissionId: 'admission-1', reviewStatus: 'PENDING', ph: 7.2 },
    ],
    ventilatorSettings: [
      { id: 'vent-approved', admissionId: 'admission-1', reviewStatus: 'APPROVED', peep: 6 },
      { id: 'vent-pending', admissionId: 'admission-1', reviewStatus: 'PENDING', peep: 10 },
    ],
    airwayDevices: [{ id: 'airway-1', admissionId: 'admission-1', notes: 'Raw note' }],
    humidificationDecisions: [],
    dailyReviews: [],
    outcomes: [{ id: 'outcome-1', admissionId: 'admission-1', notes: 'Outcome note' }],
  });

  assert.equal(payload.admission.id, undefined);
  assert.equal(payload.admission.appAdmissionCode, undefined);
  assert.equal(payload.patient.id, undefined);
  assert.equal(payload.patient.appPatientCode, undefined);
  assert.equal(payload.patient.optionalName, undefined);
  assert.equal(payload.patient.hospitalNumber, undefined);
  assert.equal(payload.patient.ageYears, 54);
  assert.deepEqual(payload.abgTests.map((record) => record.ph), [7.34]);
  assert.deepEqual(payload.ventilatorSettings.map((record) => record.peep), [6]);
  assert.equal(payload.clinicalSnapshots[0].id, undefined);
  assert.equal(payload.clinicalSnapshots[0].admissionId, undefined);
  assert.equal(payload.airwayDevices[0].notes, undefined);
  assert.equal(payload.outcomes[0].notes, undefined);
});
