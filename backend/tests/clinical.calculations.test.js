import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAdultPredictedBodyWeight,
  calculateDrivingPressure,
  calculateMinuteVentilation,
  calculatePfRatio,
  calculateReferenceWeight,
  calculateSfRatio,
  calculateVtPerKg,
} from '../src/clinical/calculations.js';
import { calculateHumidificationFlags, calculateVentilationSummary, interpretAbg } from '../src/clinical/flags.js';

test('calculates adult predicted body weight by sex and height', () => {
  assert.equal(calculateAdultPredictedBodyWeight({ sexForSizeCalculations: 'MALE', heightOrLengthCm: 170 }), 66);
  assert.equal(calculateAdultPredictedBodyWeight({ sexForSizeCalculations: 'FEMALE', heightOrLengthCm: 160 }), 52.4);
});

test('does not apply adult PBW to neonatal or unknown pathways', () => {
  const neonate = calculateReferenceWeight({ patientPathway: 'NEONATE', actualWeightKg: 3.2, heightOrLengthCm: 50, sexForSizeCalculations: 'MALE' });
  assert.equal(neonate.method, 'neonate_actual_weight_pending_local_reference');
  assert.equal(neonate.value, 3.2);

  const unknown = calculateReferenceWeight({ patientPathway: 'UNKNOWN', heightOrLengthCm: 170, sexForSizeCalculations: 'MALE' });
  assert.equal(unknown.value, null);
  assert.equal(unknown.status, 'not_available');
});

test('calculates VT/kg, minute ventilation, P/F, S/F, and driving pressure', () => {
  assert.equal(calculateVtPerKg({ tidalVolumeMl: 420, referenceWeightKg: 66 }).value, 6.4);
  assert.equal(calculateMinuteVentilation({ tidalVolumeMl: 420, respiratoryRate: 20 }).value, 8.4);
  assert.equal(calculatePfRatio({ pao2: 58, fio2: 0.4 }).value, 145);
  assert.equal(calculateSfRatio({ spo2: 94, fio2: 0.5 }).value, 188);
  assert.equal(calculateDrivingPressure({ plateauPressure: 24, peep: 10 }).value, 14);
});

test('flags respiratory acidosis and avoids diagnosis wording', () => {
  const result = interpretAbg({ ph: 7.21, paco2: 67, pao2: 58, fio2AtSample: 0.4 }, { patientPathway: 'ADULT' });
  assert.equal(result.pfRatio.value, 145);
  assert.ok(result.flags.some((flag) => flag.code === 'RESPIRATORY_ACIDOSIS_PATTERN'));
  assert.ok(result.flags.every((flag) => !/diagnosed/i.test(flag.message)));
});

test('ventilation summary recalculates server-side safety values', () => {
  const summary = calculateVentilationSummary({
    patient: { patientPathway: 'ADULT', sexForSizeCalculations: 'MALE', heightOrLengthCm: 170 },
    ventilator: { tidalVolumeMl: 700, respiratoryRateSet: 20, peep: 10, plateauPressure: 31, fio2: 0.8 },
    latestAbg: { ph: 7.18, paco2: 72, pao2: 70, fio2AtSample: 0.8 },
  });

  assert.equal(summary.referenceWeight.value, 66);
  assert.equal(summary.minuteVentilation.value, 14);
  assert.ok(summary.flags.some((flag) => flag.code === 'HIGH_VT_PER_KG'));
  assert.ok(summary.flags.some((flag) => flag.code === 'HIGH_PLATEAU_PRESSURE'));
  assert.equal(summary.safetyStatement, 'Decision support only. Clinician must confirm final interpretation and settings.');
});

test('humidification caution flags HME risks', () => {
  const flags = calculateHumidificationFlags({ thickSecretions: true });
  assert.equal(flags[0].code, 'HME_CAUTION');
});
