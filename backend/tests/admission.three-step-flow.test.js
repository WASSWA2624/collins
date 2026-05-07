import test from 'node:test';
import assert from 'node:assert/strict';
import {
  admissionAbgVentilatorUpdateSchema,
  admissionOxygenAbgVentilatorStepSchema,
  admissionPatientReasonStepSchema,
} from '../src/modules/admissions/admissions.validators.js';
import { buildAdmissionReadiness, buildClinicalSummary } from '../src/modules/admissions/admissions.service.js';

test('patient and reason step accepts minimal patient data without explicit facility or bed', () => {
  const parsed = admissionPatientReasonStepSchema.parse({
    body: {
      patient: {
        patientPathway: 'adult',
        sexForSizeCalculations: 'male',
        ageYears: '54',
        actualWeightKg: null,
        heightOrLengthCm: '170',
      },
      permittedMissingFields: ['PaO2', 'actualWeightKg/referenceWeightKg'],
      idempotencyKey: 'patient-step-1',
    },
    params: {},
    query: {},
  });

  assert.equal(parsed.body.patient.patientPathway, 'ADULT');
  assert.equal(parsed.body.patient.sexForSizeCalculations, 'MALE');
  assert.equal(parsed.body.patient.ageYears, 54);
  assert.equal(parsed.body.patient.actualWeightKg, null);
  assert.equal(parsed.body.patient.heightOrLengthCm, 170);
  assert.equal(parsed.body.facilityId, undefined);
  assert.equal(parsed.body.bedNumber, undefined);
  assert.equal(parsed.body.reasonForSupport, undefined);
  assert.deepEqual(parsed.body.permittedMissingFields, ['PaO2', 'actualWeightKg/referenceWeightKg']);
});

test('oxygen, ABG, and ventilator step accepts unknown values and explicit uncertainty', () => {
  const parsed = admissionOxygenAbgVentilatorStepSchema.parse({
    body: {
      oxygen: {
        oxygenSupportType: 'NIV',
        spo2: '94',
        fio2: 'not_available',
      },
      abg: {
        ph: '7.31',
        pao2: null,
        fio2AtSample: '0.50',
      },
      ventilator: {
        mode: 'VC',
        tidalVolumeMl: '420',
        peep: '8',
        source: 'manual',
      },
      uncertainty: {
        fields: ['FiO2'],
        reason: 'Blender value not visible at entry time',
      },
      deviceContext: {
        deviceId: 'device-1',
        source: 'manual',
      },
      idempotencyKey: 'oxygen-step-2',
    },
    params: { id: 'admission-1' },
    query: {},
  });

  assert.equal(parsed.body.oxygen.spo2, 94);
  assert.equal(parsed.body.oxygen.fio2, null);
  assert.equal(parsed.body.abg.pao2, null);
  assert.equal(parsed.body.ventilator.peep, 8);
  assert.equal(parsed.body.uncertainty.fields[0], 'FiO2');
});

test('ABG and ventilator settings update accepts only update records and sync metadata', () => {
  const parsed = admissionAbgVentilatorUpdateSchema.parse({
    body: {
      abgTest: {
        ph: '7.31',
        pao2: '82',
        fio2AtSample: '0.40',
        source: 'abg_vent_update',
      },
      ventilatorSetting: {
        mode: 'VC',
        peep: '8',
        fio2: '0.40',
        source: 'abg_vent_update',
      },
      clientRecordId: 'client-update-1',
      clientCreatedAt: '2026-05-05T07:30:00.000Z',
      clientUpdatedAt: '2026-05-05T07:30:00.000Z',
      idempotencyKey: 'abg-vent-update-1',
    },
    params: { id: 'admission-1' },
    query: {},
  });

  assert.equal(parsed.body.abgTest.ph, 7.31);
  assert.equal(parsed.body.ventilatorSetting.peep, 8);
  assert.equal(parsed.body.uncertainty, undefined);
});

test('ABG and ventilator settings update rejects uncertainty-only payloads', () => {
  assert.throws(() =>
    admissionAbgVentilatorUpdateSchema.parse({
      body: {
        uncertainty: {
          fields: ['FiO2'],
          reason: 'Not part of this workflow',
        },
        idempotencyKey: 'abg-vent-update-2',
      },
      params: { id: 'admission-1' },
      query: {},
    })
  );
});

test('readiness keeps missing-data warnings advisory and honors permitted fields', () => {
  const readiness = buildAdmissionReadiness({
    patient: {
      patientPathway: 'ADULT',
      sexForSizeCalculations: 'UNKNOWN',
    },
    clinicalSnapshots: [{
      spo2: 94,
      fio2: 0.5,
      comorbiditiesJson: {
        admissionFlow: {
          permittedMissingFields: ['PaO2', 'actualWeightKg/referenceWeightKg'],
          uncertainty: {
            fields: ['FiO2'],
            reason: 'Ventilator display was intermittently unavailable',
          },
        },
      },
    }],
    abgTests: [],
    ventilatorSettings: [{
      tidalVolumeMl: 420,
      peep: 8,
      fio2: 0.5,
    }],
    humidificationDecisions: [],
  });

  assert.equal(readiness.isReadyToSave, true);
  assert.ok(readiness.warnings.some((warning) => warning.code === 'PERMITTED_MISSING_DATA' && warning.field === 'PaO2'));
  assert.ok(readiness.warnings.some((warning) => warning.code === 'EXPLICIT_UNCERTAINTY'));
  assert.ok(readiness.warnings.every((warning) => !/diagnos|autonomous|increase|decrease|set peep|set fio2/i.test(warning.message)));
});

test('readiness blocks impossible values until correction or documented override', () => {
  const readiness = buildAdmissionReadiness({
    patient: {
      patientPathway: 'ADULT',
      sexForSizeCalculations: 'MALE',
      heightOrLengthCm: 170,
    },
    clinicalSnapshots: [{ spo2: 92, fio2: 0.5 }],
    abgTests: [{ pao2: 80, fio2AtSample: 0.5 }],
    ventilatorSettings: [{
      tidalVolumeMl: 420,
      peep: 45,
      fio2: 0.5,
    }],
    humidificationDecisions: [],
  });

  assert.equal(readiness.isReadyToSave, false);
  assert.ok(readiness.blockers.some((blocker) => blocker.code === 'IMPOSSIBLE_VALUE'));
});

test('clinical summary ignores metadata-only snapshots when checking current missing data', () => {
  const summary = buildClinicalSummary({
    patient: {
      patientPathway: 'ADULT',
      sexForSizeCalculations: 'MALE',
      actualWeightKg: 76,
    },
    clinicalSnapshots: [
      {
        measuredAt: new Date('2026-05-07T20:09:00.000Z'),
        comorbiditiesJson: {
          admissionFlow: {
            flowVersion: 'three-step-admission-flow@2026-05-05',
          },
        },
      },
      {
        measuredAt: new Date('2026-05-07T08:20:00.000Z'),
        spo2: 91,
        fio2: 0.5,
        respiratoryRate: 24,
        heartRate: 98,
      },
    ],
    abgTests: [{ pao2: 82, fio2AtSample: 0.5 }],
    ventilatorSettings: [{
      tidalVolumeMl: 427,
      peep: 0,
      fio2: 0.35,
    }],
    humidificationDecisions: [],
  });

  assert.equal(summary.missingData.includes('SpO2'), false);
  assert.equal(summary.missingData.includes('FiO2'), false);
  assert.equal(summary.missingData.includes('PaO2'), false);
  assert.equal(summary.missingData.includes('PEEP'), false);
});
