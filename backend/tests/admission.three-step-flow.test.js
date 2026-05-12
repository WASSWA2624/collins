import test from 'node:test';
import assert from 'node:assert/strict';
import {
  newPatientCurrentReadingsSchema,
  newPatientOxygenAbgVentilatorStepSchema,
  newPatientReasonStepSchema,
  newPatientVentilatorRecommendationSchema,
} from '../src/modules/newPatients/newPatients.validators.js';
import {
  buildNewPatientReadiness,
  buildClinicalSummary,
  buildCurrentReadingsProgressAssessment,
  createAppRecordCode,
  normalizeAppRecordCode,
} from '../src/modules/newPatients/newPatients.service.js';

test('app patient and admission codes use stored six-character app codes', () => {
  for (let index = 0; index < 25; index += 1) {
    assert.match(createAppRecordCode(), /^[A-Z0-9]{6}$/);
  }

  assert.equal(normalizeAppRecordCode(' ab12cd '), 'AB12CD');
  assert.equal(normalizeAppRecordCode('COL-P-123'), null);
  assert.equal(normalizeAppRecordCode(null), null);
});

test('patient and reason step accepts minimal patient data without explicit facility or bed', () => {
  const parsed = newPatientReasonStepSchema.parse({
    body: {
      patient: {
        firstName: 'Patient',
        lastName: 'One',
        patientPathway: 'adult',
        sexForSizeCalculations: 'male',
        ageDays: '14',
        actualWeightKg: null,
        heightOrLengthCm: '170',
      },
      permittedMissingFields: ['actualWeightKg/referenceWeightKg'],
      idempotencyKey: 'patient-step-1',
    },
    params: {},
    query: {},
  });

  assert.equal(parsed.body.patient.patientPathway, 'ADULT');
  assert.equal(parsed.body.patient.firstName, 'Patient');
  assert.equal(parsed.body.patient.lastName, 'One');
  assert.equal(parsed.body.patient.optionalName, undefined);
  assert.equal(parsed.body.patient.sexForSizeCalculations, 'MALE');
  assert.equal(parsed.body.patient.ageDays, 14);
  assert.equal(parsed.body.patient.ageYears, undefined);
  assert.equal(parsed.body.patient.actualWeightKg, null);
  assert.equal(parsed.body.patient.heightOrLengthCm, 170);
  assert.equal(parsed.body.facilityId, undefined);
  assert.equal(parsed.body.bedNumber, undefined);
  assert.equal(parsed.body.reasonForSupport, undefined);
  assert.deepEqual(parsed.body.permittedMissingFields, ['actualWeightKg/referenceWeightKg']);
});

test('patient and reason step requires one age value or date of birth', () => {
  assert.throws(() =>
    newPatientReasonStepSchema.parse({
      body: {
        patient: {
          patientPathway: 'adult',
          sexForSizeCalculations: 'male',
          actualWeightKg: '70',
          heightOrLengthCm: '170',
        },
        idempotencyKey: 'patient-step-no-age',
      },
      params: {},
      query: {},
    })
  );
});

test('oxygen, ABG, and ventilator step accepts unknown values and explicit uncertainty', () => {
  const parsed = newPatientOxygenAbgVentilatorStepSchema.parse({
    body: {
      oxygen: {
        spo2: '94',
      },
      abg: {
        pao2: null,
      },
      ventilator: {
        mode: 'VC',
        tidalVolumeMl: '420',
        peep: '8',
        source: 'manual',
      },
      uncertainty: {
        fields: ['PaO2'],
        reason: 'ABG oxygen value not available at entry time',
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
  assert.equal(parsed.body.oxygen.oxygenSupportType, undefined);
  assert.equal(parsed.body.abg.ph, undefined);
  assert.equal(parsed.body.abg.pao2, null);
  assert.equal(parsed.body.ventilator.peep, 8);
  assert.equal(parsed.body.uncertainty.fields[0], 'PaO2');
});

test('oxygen, ABG, and ventilator step rejects oxygen support type in the New Patient flow', () => {
  assert.throws(() =>
    newPatientOxygenAbgVentilatorStepSchema.parse({
      body: {
        oxygen: { oxygenSupportType: 'NIV', spo2: 94 },
        idempotencyKey: 'oxygen-step-support-type',
      },
      params: { id: 'admission-1' },
      query: {},
    })
  );
});

test('oxygen, ABG, and ventilator step rejects FiO2 fields in the New Patient flow', () => {
  assert.throws(() =>
    newPatientOxygenAbgVentilatorStepSchema.parse({
      body: {
        oxygen: { spo2: 94, fio2: 0.5 },
        abg: { ph: 7.31, fio2AtSample: 0.5 },
        ventilator: { mode: 'VC', fio2: 0.5 },
        idempotencyKey: 'oxygen-step-fio2',
      },
      params: { id: 'admission-1' },
      query: {},
    })
  );
});

test('current readings update accepts vital signs, ABG, ventilator records, and sync metadata', () => {
  const parsed = newPatientCurrentReadingsSchema.parse({
    body: {
      clinicalSnapshot: {
        spo2: '94',
        respiratoryRate: '24',
        heartRate: '104',
        source: 'patient_monitor',
      },
      abgTest: {
        ph: '7.31',
        pao2: '82',
        fio2AtSample: '0.4',
        source: 'current_readings',
      },
      ventilatorSetting: {
        mode: 'VC',
        peep: '8',
        fio2: '0.4',
        source: 'current_readings',
      },
      clientRecordId: 'client-update-1',
      clientCreatedAt: '2026-05-05T07:30:00.000Z',
      clientUpdatedAt: '2026-05-05T07:30:00.000Z',
      idempotencyKey: 'current-readings-1',
    },
    params: { id: 'admission-1' },
    query: {},
  });

  assert.equal(parsed.body.clinicalSnapshot.spo2, 94);
  assert.equal(parsed.body.clinicalSnapshot.respiratoryRate, 24);
  assert.equal(parsed.body.abgTest.ph, 7.31);
  assert.equal(parsed.body.abgTest.fio2AtSample, 0.4);
  assert.equal(parsed.body.ventilatorSetting.peep, 8);
  assert.equal(parsed.body.ventilatorSetting.fio2, 0.4);
  assert.equal(parsed.body.uncertainty, undefined);
});

test('current readings update rejects uncertainty-only payloads', () => {
  assert.throws(() =>
    newPatientCurrentReadingsSchema.parse({
      body: {
        uncertainty: {
          fields: ['FiO2'],
          reason: 'Not part of this workflow',
        },
        idempotencyKey: 'current-readings-2',
      },
      params: { id: 'admission-1' },
      query: {},
    })
  );
});

test('current readings progress assessment compares saved readings over time', () => {
  const assessment = buildCurrentReadingsProgressAssessment({
    patient: { patientPathway: 'ADULT' },
    clinicalSnapshots: [
      {
        measuredAt: '2026-05-05T08:00:00.000Z',
        spo2: 88,
        respiratoryRate: 34,
        heartRate: 124,
      },
      {
        measuredAt: '2026-05-05T07:00:00.000Z',
        spo2: 94,
        respiratoryRate: 24,
        heartRate: 104,
      },
    ],
    abgTests: [
      {
        collectedAt: '2026-05-05T08:00:00.000Z',
        ph: 7.21,
        paco2: 72,
        fio2AtSample: 0.8,
      },
      {
        collectedAt: '2026-05-05T07:00:00.000Z',
        ph: 7.34,
        paco2: 48,
        fio2AtSample: 0.4,
      },
    ],
    ventilatorSettings: [
      {
        measuredAt: '2026-05-05T08:00:00.000Z',
        fio2: 0.8,
        peep: 12,
      },
      {
        measuredAt: '2026-05-05T07:00:00.000Z',
        fio2: 0.4,
        peep: 8,
      },
    ],
  });

  assert.equal(assessment.status, 'deteriorating');
  assert.equal(assessment.action, 'suggest_new_settings');
  assert.ok(assessment.reasons.some((reason) => reason.includes('SpO2 worsened')));
  assert.ok(assessment.reasons.some((reason) => reason.includes('FiO2 requirement worsened')));
});

test('readiness keeps missing-data warnings advisory and honors permitted fields', () => {
  const readiness = buildNewPatientReadiness({
    patient: {
      patientPathway: 'ADULT',
      sexForSizeCalculations: 'UNKNOWN',
    },
    clinicalSnapshots: [{
      spo2: 94,
      fio2: 0.5,
      comorbiditiesJson: {
        newPatientFlow: {
          permittedMissingFields: ['actualWeightKg/referenceWeightKg'],
          uncertainty: {
            fields: ['PaO2'],
            reason: 'ABG oxygen value was unavailable',
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
  assert.ok(readiness.warnings.some((warning) => warning.code === 'PERMITTED_MISSING_DATA' && warning.field === 'actualWeightKg/referenceWeightKg'));
  assert.equal(readiness.missingData.includes('PaO2'), false);
  assert.equal(readiness.missingData.includes('FiO2'), false);
  assert.ok(readiness.warnings.some((warning) => warning.code === 'EXPLICIT_UNCERTAINTY'));
  assert.ok(readiness.warnings.every((warning) => !/diagnos|autonomous|increase|decrease|set peep|set fio2/i.test(warning.message)));
});

test('readiness keeps impossible value flags advisory so save review is not blocked', () => {
  const readiness = buildNewPatientReadiness({
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

  assert.equal(readiness.isReadyToSave, true);
  assert.equal(readiness.blockers.length, 0);
  assert.ok(readiness.warnings.some((warning) => warning.code === 'IMPOSSIBLE_VALUE'));
});

test('backend recommendation request accepts optional ABG values and no FiO2', () => {
  const parsed = newPatientVentilatorRecommendationSchema.parse({
    body: {
      facilityId: 'facility-1',
      admissionId: 'admission-1',
      input: {
        condition: 'ARDS with hypoxaemia',
        patientPathway: 'adult',
        ageYears: '54',
        ageMonths: null,
        ageDays: '7',
        actualWeightKg: '70',
        heightOrLengthCm: '172',
        spo2: '88',
        respiratoryRate: '28',
        heartRate: '110',
        ph: '7.31',
        pao2: null,
        paco2: null,
        mode: 'ACV',
        tidalVolumeMl: '420',
        respiratoryRateSet: '18',
        respiratoryRateMeasured: '28',
        peep: '8',
        pressureSupport: null,
        inspiratoryPressure: null,
        peakPressure: null,
        plateauPressure: '24',
        ieRatio: '1:2',
      },
    },
    params: {},
    query: {},
  });

  assert.equal(parsed.body.input.patientPathway, 'ADULT');
  assert.equal(parsed.body.input.ageDays, 7);
  assert.equal(parsed.body.input.ph, 7.31);
  assert.equal(parsed.body.input.pao2, null);
  assert.equal(parsed.body.input.paco2, null);
  assert.equal(parsed.body.input.tidalVolumeMl, 420);
  assert.equal(parsed.body.input.peep, 8);
  assert.equal(parsed.body.input.plateauPressure, 24);
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
          newPatientFlow: {
            flowVersion: 'three-step-new-patient-flow@2026-05-10',
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
