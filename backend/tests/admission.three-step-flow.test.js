import test from 'node:test';
import assert from 'node:assert/strict';
import {
  admissionOxygenAbgVentilatorStepSchema,
  admissionPatientReasonStepSchema,
} from '../src/modules/admissions/admissions.validators.js';
import { buildAdmissionReadiness } from '../src/modules/admissions/admissions.service.js';

test('patient and reason step accepts minimal pathway data and permitted missing fields', () => {
  const parsed = admissionPatientReasonStepSchema.parse({
    body: {
      facilityId: 'facility-1',
      bedNumber: 'ICU-04',
      reasonForSupport: 'Pneumonia with oxygen support',
      patient: {
        patientPathway: 'adult',
        sexForSizeCalculations: 'male',
        actualWeightKg: null,
      },
      permittedMissingFields: ['PaO2', 'actualWeightKg/referenceWeightKg'],
      idempotencyKey: 'patient-step-1',
    },
    params: {},
    query: {},
  });

  assert.equal(parsed.body.patient.patientPathway, 'ADULT');
  assert.equal(parsed.body.patient.sexForSizeCalculations, 'MALE');
  assert.equal(parsed.body.patient.actualWeightKg, null);
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
