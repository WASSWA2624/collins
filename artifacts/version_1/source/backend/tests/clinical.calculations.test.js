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
import {
  DEVELOPMENT_REFERENCE_RANGES,
  REFERENCE_VERIFICATION_STATUS,
  getVerifiedReferenceRanges,
  validateReferenceRangeDataset,
} from '../src/clinical/referenceRanges.js';

const allClinicalText = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allClinicalText);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allClinicalText);
  return [];
};

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
  assert.ok(summary.flags.every((flag) => flag.advisory === true));
  assert.ok(summary.uncertainty.some((item) => item.code === 'SF_RATIO_UNAVAILABLE'));
  assert.equal(summary.safetyStatement, 'Decision support only. Clinician must confirm final interpretation and settings.');
});

test('humidification caution flags HME risks', () => {
  const flags = calculateHumidificationFlags({ thickSecretions: true });
  assert.equal(flags[0].code, 'HME_CAUTION');
});

test('development reference ranges are valid verified range records', () => {
  const validation = validateReferenceRangeDataset(DEVELOPMENT_REFERENCE_RANGES);

  assert.equal(validation.valid, true);
  assert.equal(getVerifiedReferenceRanges(DEVELOPMENT_REFERENCE_RANGES).length, DEVELOPMENT_REFERENCE_RANGES.length);
  assert.ok(DEVELOPMENT_REFERENCE_RANGES.every((range) => range.lowerBound !== undefined && range.upperBound !== undefined));
  assert.ok(DEVELOPMENT_REFERENCE_RANGES.every((range) => range.auditTrail.length > 0));
});

test('unverified reference ranges are ignored for decision support', () => {
  const unverifiedVtRange = {
    ...DEVELOPMENT_REFERENCE_RANGES.find((range) => range.parameterName === 'vtMlPerKgReferenceWeight'),
    id: 'test-unverified-vt-range',
    upperBound: 20,
    verificationStatus: REFERENCE_VERIFICATION_STATUS.PENDING_REVIEW,
    verifiedBy: 'pending-reviewer',
    verifiedAt: '2026-05-04T00:00:00.000Z',
  };

  const summary = calculateVentilationSummary({
    patient: { patientPathway: 'ADULT', sexForSizeCalculations: 'MALE', heightOrLengthCm: 170 },
    ventilator: { tidalVolumeMl: 700, respiratoryRateSet: 20, peep: 10, plateauPressure: 24, fio2: 0.5 },
    referenceRanges: [unverifiedVtRange],
  });

  assert.ok(summary.flags.some((flag) => flag.code === 'MISSING_VERIFIED_REFERENCE_RANGE' && flag.parameterName === 'vtMlPerKgReferenceWeight'));
  assert.ok(!summary.flags.some((flag) => flag.code === 'HIGH_VT_PER_KG'));
});

test('non-adult pathways expose missing pathway references instead of adult guardrails', () => {
  const summary = calculateVentilationSummary({
    patient: { patientPathway: 'CHILD', actualWeightKg: 12 },
    ventilator: { tidalVolumeMl: 180, respiratoryRateSet: 24, peep: 6, plateauPressure: 20, fio2: 0.4 },
    latestAbg: { ph: 7.31, paco2: 50, pao2: 70, fio2AtSample: 0.4 },
  });

  assert.equal(summary.referenceWeight.method, 'child_actual_weight_pending_local_reference');
  assert.ok(summary.flags.some((flag) => flag.code === 'MISSING_VERIFIED_REFERENCE_RANGE' && flag.parameterName === 'vtMlPerKgReferenceWeight'));
  assert.ok(!summary.flags.some((flag) => flag.code === 'HIGH_VT_PER_KG'));
  assert.equal(summary.oxygenCaution.status, 'missing_reference');
});

test('clinical decision support avoids forbidden directive wording', () => {
  const summary = calculateVentilationSummary({
    patient: { patientPathway: 'ADULT', sexForSizeCalculations: 'MALE', heightOrLengthCm: 170 },
    ventilator: { tidalVolumeMl: 700, respiratoryRateSet: 20, peep: 10, plateauPressure: 31, fio2: 0.8 },
    latestAbg: { ph: 7.18, paco2: 72, pao2: 70, fio2AtSample: 0.8 },
  });

  const text = allClinicalText(summary).join(' ');
  assert.doesNotMatch(text, /diagnosed|set\s+(peep|fio2|tidal volume)\s+to|intubate now|extubate now/i);
});
