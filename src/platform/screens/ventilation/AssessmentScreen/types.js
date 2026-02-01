/**
 * AssessmentScreen Types
 * File: types.js
 */

const STEPS = Object.freeze({
  PATIENT_PROFILE: 0,
  CLINICAL_PARAMS: 1,
  OBSERVATIONS: 2,
  TIME_SERIES: 3,
  REVIEW: 4,
});

const STEP_KEYS = Object.freeze([
  'patientProfile',
  'clinicalParams',
  'observations',
  'timeSeries',
  'review',
]);

/** Option value + i18n label key (resolve with t('ventilation.assessment.conditions.' + labelKey) or patientProfile.' + labelKey) */
const CONDITION_OPTIONS = Object.freeze([
  { value: 'ARDS', labelKey: 'ARDS' },
  { value: 'asthma', labelKey: 'asthma' },
  { value: 'COPD', labelKey: 'COPD' },
  { value: 'heart failure', labelKey: 'heartFailure' },
  { value: 'pneumonia', labelKey: 'pneumonia' },
  { value: 'sepsis', labelKey: 'sepsis' },
  { value: 'trauma', labelKey: 'trauma' },
  { value: 'other', labelKey: 'other' },
]);

const GENDER_OPTIONS = Object.freeze([
  { value: 'male', labelKey: 'genderMale' },
  { value: 'female', labelKey: 'genderFemale' },
  { value: 'other', labelKey: 'genderOther' },
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
});

export { STEPS, STEP_KEYS, CONDITION_OPTIONS, GENDER_OPTIONS, ASSESSMENT_TEST_IDS };
