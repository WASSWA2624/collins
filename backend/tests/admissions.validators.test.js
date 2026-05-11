import test from 'node:test';
import assert from 'node:assert/strict';
import {
  abgTestSchema,
  createNewPatientSchema,
  humidificationSchema,
  patchNewPatientSchema,
  ventilatorSettingSchema,
} from '../src/modules/newPatients/newPatients.validators.js';

test('normalizes admission missing-data sentinels and pathway aliases', () => {
  const result = createNewPatientSchema.safeParse({
    body: {
      appAdmissionCode: null,
      admittedAt: '',
      patient: {
        firstName: 'Patient',
        lastName: 'One',
        patientPathway: 'obstetric/post-partum',
        sexForSizeCalculations: 'not_available',
        ageYears: 'unknown',
        actualWeightKg: null,
        pathwayDetailsJson: {
          pregnancyStatus: 'post_partum',
          gestationWeeksAtDelivery: null,
        },
      },
      clinicalSnapshot: {
        measuredAt: 'not_available',
        spo2: 'unknown',
      },
      abgTest: {
        ph: 'not_available',
        pao2: null,
      },
      ventilatorSetting: {
        tidalVolumeMl: 'unknown',
        peep: '5',
      },
      idempotencyKey: 'offline-admission-1',
    },
    params: {},
    query: {},
  });

  assert.equal(result.success, true);
  assert.equal(result.data.body.facilityId, undefined);
  assert.equal(result.data.body.appAdmissionCode, null);
  assert.equal(result.data.body.admittedAt, undefined);
  assert.equal(result.data.body.patient.patientPathway, 'OBSTETRIC');
  assert.equal(result.data.body.patient.firstName, 'Patient');
  assert.equal(result.data.body.patient.lastName, 'One');
  assert.equal(result.data.body.patient.sexForSizeCalculations, 'UNKNOWN');
  assert.equal(result.data.body.patient.ageYears, null);
  assert.equal(result.data.body.patient.actualWeightKg, null);
  assert.deepEqual(result.data.body.patient.pathwayDetailsJson, {
    pregnancyStatus: 'post_partum',
    gestationWeeksAtDelivery: null,
  });
  assert.equal(result.data.body.clinicalSnapshot.measuredAt, undefined);
  assert.equal(result.data.body.clinicalSnapshot.spo2, null);
  assert.equal(result.data.body.abgTest.ph, null);
  assert.equal(result.data.body.ventilatorSetting.tidalVolumeMl, null);
  assert.equal(result.data.body.ventilatorSetting.peep, 5);
});

test('supports audited patient registration edits in admission patch payloads', () => {
  const result = patchNewPatientSchema.safeParse({
    body: {
      patient: {
        optionalName: null,
        patientPathway: 'not_available',
        heightOrLengthCm: 'unknown',
      },
      status: 'TRANSFERRED',
      clientUpdatedAt: null,
      idempotencyKey: 'offline-admission-update-1',
      overrideReason: 'Clinician corrected registration details.',
    },
    params: { id: 'admission-1' },
    query: {},
  });

  assert.equal(result.success, true);
  assert.equal(result.data.body.patient.optionalName, null);
  assert.equal(result.data.body.patient.patientPathway, 'UNKNOWN');
  assert.equal(result.data.body.patient.heightOrLengthCm, null);
  assert.equal(result.data.body.clientUpdatedAt, null);
});

test('parses string boolean false without treating it as true', () => {
  const result = humidificationSchema.safeParse({
    body: {
      thickSecretions: 'false',
      expectedLongVentilation: 'yes',
    },
    params: { id: 'admission-1' },
    query: {},
  });

  assert.equal(result.success, true);
  assert.equal(result.data.body.thickSecretions, false);
  assert.equal(result.data.body.expectedLongVentilation, true);
});

test('validates ABG append metadata and rejects client-calculated fields', () => {
  const accepted = abgTestSchema.safeParse({
    body: {
      ph: '7.31',
      pao2: '82',
      source: 'point-of-care-analyzer',
      clientRecordId: 'client-abg-1',
      clientCreatedAt: '2026-05-05T07:00:00.000Z',
      clientUpdatedAt: '2026-05-05T07:01:00.000Z',
      idempotencyKey: 'abg-append-key-1',
    },
    params: { id: 'admission-1' },
    query: {},
  });

  assert.equal(accepted.success, true);
  assert.equal(accepted.data.body.ph, 7.31);
  assert.equal(accepted.data.body.source, 'point-of-care-analyzer');
  assert.equal(accepted.data.body.clientUpdatedAt.toISOString(), '2026-05-05T07:01:00.000Z');

  const rejected = abgTestSchema.safeParse({
    body: {
      ph: 7.31,
      clinicalFlagsJson: [{ code: 'CLIENT_FLAG' }],
    },
    params: { id: 'admission-1' },
    query: {},
  });

  assert.equal(rejected.success, false);
});

test('validates ventilator append metadata and empty query contract', () => {
  const accepted = ventilatorSettingSchema.safeParse({
    body: {
      mode: 'VC',
      tidalVolumeMl: '420',
      respiratoryRateSet: '20',
      peep: '8',
      plateauPressure: '24',
      source: 'bedside-entry',
      clientUpdatedAt: '2026-05-05T07:05:00.000Z',
      idempotencyKey: 'vent-append-key-1',
    },
    params: { id: 'admission-1' },
    query: {},
  });

  assert.equal(accepted.success, true);
  assert.equal(accepted.data.body.tidalVolumeMl, 420);
  assert.equal(accepted.data.body.source, 'bedside-entry');

  const rejected = ventilatorSettingSchema.safeParse({
    body: {
      tidalVolumeMl: 420,
      minuteVolumeLMin: 8.4,
    },
    params: { id: 'admission-1' },
    query: { includeOrders: 'true' },
  });

  assert.equal(rejected.success, false);
});

test('rejects FiO2 fields from New Patient request payloads', () => {
  const createResult = createNewPatientSchema.safeParse({
    body: {
      patient: { firstName: 'Patient', patientPathway: 'ADULT' },
      clinicalSnapshot: { spo2: 94, fio2: 0.5 },
      idempotencyKey: 'new-patient-fio2-create',
    },
    params: {},
    query: {},
  });

  const abgResult = abgTestSchema.safeParse({
    body: {
      ph: 7.31,
      fio2AtSample: 0.4,
    },
    params: { id: 'admission-1' },
    query: {},
  });

  const ventilatorResult = ventilatorSettingSchema.safeParse({
    body: {
      mode: 'VC',
      fio2: 0.5,
    },
    params: { id: 'admission-1' },
    query: {},
  });

  assert.equal(createResult.success, false);
  assert.equal(abgResult.success, false);
  assert.equal(ventilatorResult.success, false);
});
