/**
 * AssessmentScreen Types
 * File: types.js
 */

const STEPS = Object.freeze({
  PATIENT_REASON: 0,
  OXYGEN_ABG_VENTILATOR: 1,
  SAVE_REVIEW: 2,
});

const STEP_KEYS = Object.freeze([
  'patientReason',
  'oxygenAbgVentilator',
  'saveReview',
]);

const PATIENT_PATHWAY_OPTIONS = Object.freeze([
  { value: 'NEONATE', labelKey: 'neonate' },
  { value: 'INFANT', labelKey: 'infant' },
  { value: 'CHILD', labelKey: 'child' },
  { value: 'ADOLESCENT', labelKey: 'adolescent' },
  { value: 'ADULT', labelKey: 'adult' },
  { value: 'OBSTETRIC', labelKey: 'obstetric' },
  { value: 'BURNS', labelKey: 'burns' },
  { value: 'TRAUMA', labelKey: 'trauma' },
  { value: 'PERI_OPERATIVE', labelKey: 'periOperative' },
  { value: 'MEDICAL', labelKey: 'medical' },
  { value: 'SURGICAL', labelKey: 'surgical' },
  { value: 'UNKNOWN', labelKey: 'unknown' },
  { value: 'OTHER', labelKey: 'other' },
]);

const SEX_OPTIONS = Object.freeze([
  { value: 'MALE', labelKey: 'male' },
  { value: 'FEMALE', labelKey: 'female' },
  { value: 'UNKNOWN', labelKey: 'unknown' },
]);

const OXYGEN_SUPPORT_OPTIONS = Object.freeze([
  { value: 'ROOM_AIR', labelKey: 'roomAir' },
  { value: 'NASAL_CANNULA', labelKey: 'nasalCannula' },
  { value: 'FACE_MASK', labelKey: 'faceMask' },
  { value: 'NON_REBREATHER_MASK', labelKey: 'nonRebreatherMask' },
  { value: 'HIGH_FLOW_NASAL_CANNULA', labelKey: 'highFlowNasalCannula' },
  { value: 'CPAP', labelKey: 'cpap' },
  { value: 'NIV_BIPAP', labelKey: 'nivBipap' },
  { value: 'INVASIVE_VENTILATION', labelKey: 'invasiveVentilation' },
  { value: 'OTHER', labelKey: 'other' },
]);

const VENTILATOR_MODE_OPTIONS = Object.freeze([
  { value: 'ACV', labelKey: 'acv' },
  { value: 'SIMV', labelKey: 'simv' },
  { value: 'PSV', labelKey: 'psv' },
  { value: 'CPAP', labelKey: 'cpap' },
  { value: 'BIPAP', labelKey: 'bipap' },
  { value: 'OTHER', labelKey: 'other' },
]);

const PERMITTED_MISSING_FIELD_OPTIONS = Object.freeze([
  { value: 'actualWeightKg/referenceWeightKg', labelKey: 'weight' },
  { value: 'SpO2', labelKey: 'spo2' },
  { value: 'FiO2', labelKey: 'fio2' },
  { value: 'PaO2', labelKey: 'pao2' },
  { value: 'tidalVolumeMl', labelKey: 'tidalVolume' },
  { value: 'PEEP', labelKey: 'peep' },
]);

const ASSESSMENT_TEST_IDS = Object.freeze({
  screen: 'assessment-screen',
  progressBar: 'assessment-progress',
  summary: 'assessment-summary',
  summaryExpand: 'assessment-summary-expand',
  stepContent: 'assessment-step-content',
  backButton: 'assessment-back',
  nextButton: 'assessment-next',
  generateButton: 'assessment-generate',
  missingTests: 'assessment-missing-tests',
  readiness: 'assessment-readiness',
  recommendation: 'assessment-recommendation',
  syncStatus: 'assessment-sync-status',
});

export {
  STEPS,
  STEP_KEYS,
  PATIENT_PATHWAY_OPTIONS,
  SEX_OPTIONS,
  OXYGEN_SUPPORT_OPTIONS,
  VENTILATOR_MODE_OPTIONS,
  PERMITTED_MISSING_FIELD_OPTIONS,
  ASSESSMENT_TEST_IDS,
};
