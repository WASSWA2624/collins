import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createAdmissionSchema,
  humidificationSchema,
  patchAdmissionSchema,
} from '../src/modules/admissions/admissions.validators.js';

test('normalizes admission missing-data sentinels and pathway aliases', () => {
  const result = createAdmissionSchema.safeParse({
    body: {
      facilityId: 'facility-1',
      appAdmissionCode: null,
      admittedAt: '',
      patient: {
        patientPathway: 'obstetric/post-partum',
        sexForSizeCalculations: 'not_available',
        ageYears: 'unknown',
        actualWeightKg: null,
      },
      clinicalSnapshot: {
        measuredAt: 'not_available',
        spo2: 'unknown',
        fio2: null,
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
  assert.equal(result.data.body.appAdmissionCode, null);
  assert.equal(result.data.body.admittedAt, undefined);
  assert.equal(result.data.body.patient.patientPathway, 'OBSTETRIC');
  assert.equal(result.data.body.patient.sexForSizeCalculations, 'UNKNOWN');
  assert.equal(result.data.body.patient.ageYears, null);
  assert.equal(result.data.body.patient.actualWeightKg, null);
  assert.equal(result.data.body.clinicalSnapshot.measuredAt, undefined);
  assert.equal(result.data.body.clinicalSnapshot.spo2, null);
  assert.equal(result.data.body.abgTest.ph, null);
  assert.equal(result.data.body.ventilatorSetting.tidalVolumeMl, null);
  assert.equal(result.data.body.ventilatorSetting.peep, 5);
});

test('supports audited patient registration edits in admission patch payloads', () => {
  const result = patchAdmissionSchema.safeParse({
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
