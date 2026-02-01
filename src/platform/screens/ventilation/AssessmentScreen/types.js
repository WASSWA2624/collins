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

const CONDITION_OPTIONS = Object.freeze([
  { value: 'ARDS', label: 'ARDS' },
  { value: 'asthma', label: 'Asthma' },
  { value: 'COPD', label: 'COPD' },
  { value: 'heart failure', label: 'Heart failure' },
  { value: 'pneumonia', label: 'Pneumonia' },
  { value: 'sepsis', label: 'Sepsis' },
  { value: 'trauma', label: 'Trauma' },
  { value: 'other', label: 'Other' },
]);

const GENDER_OPTIONS = Object.freeze([
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
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
