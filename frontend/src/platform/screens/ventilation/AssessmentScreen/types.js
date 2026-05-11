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

const PATIENT_AGE_GROUP_OPTIONS = Object.freeze([
  { value: 'NEONATE', labelKey: 'neonate', rangeKey: 'neonate' },
  { value: 'INFANT', labelKey: 'infant', rangeKey: 'infant' },
  { value: 'CHILD', labelKey: 'child', rangeKey: 'child' },
  { value: 'ADOLESCENT', labelKey: 'adolescent', rangeKey: 'adolescent' },
  { value: 'ADULT', labelKey: 'adult', rangeKey: 'adult' },
]);

const PATIENT_AGE_GROUP_VALUES = Object.freeze(
  PATIENT_AGE_GROUP_OPTIONS.map((option) => option.value)
);

const NEONATE_MAX_AGE_YEARS = 28 / 365;

const isPatientAgeGroupValue = (value) =>
  PATIENT_AGE_GROUP_VALUES.includes(String(value || '').toUpperCase());

const resolvePatientAgeGroupFromAgeYears = (ageYears) => {
  const age = Number(ageYears);
  if (!Number.isFinite(age) || age < 0) return null;
  if (age <= NEONATE_MAX_AGE_YEARS) return 'NEONATE';
  if (age < 1) return 'INFANT';
  if (age < 13) return 'CHILD';
  if (age < 18) return 'ADOLESCENT';
  return 'ADULT';
};

const SEX_OPTIONS = Object.freeze([
  { value: 'MALE', labelKey: 'male' },
  { value: 'FEMALE', labelKey: 'female' },
  { value: 'UNKNOWN', labelKey: 'unknown' },
]);

const REASON_FOR_SUPPORT_OPTIONS = Object.freeze([
  { valueKey: 'acuteHypoxemicRespiratoryFailure', labelKey: 'acuteHypoxemicRespiratoryFailure' },
  { valueKey: 'acuteHypercapnicRespiratoryFailure', labelKey: 'acuteHypercapnicRespiratoryFailure' },
  { valueKey: 'ardsOrSeverePneumonia', labelKey: 'ardsOrSeverePneumonia' },
  { valueKey: 'sepsisWithRespiratoryFailure', labelKey: 'sepsisWithRespiratoryFailure' },
  { valueKey: 'postOperativeVentilatorySupport', labelKey: 'postOperativeVentilatorySupport' },
  { valueKey: 'traumaRelatedRespiratoryFailure', labelKey: 'traumaRelatedRespiratoryFailure' },
  { valueKey: 'airwayProtection', labelKey: 'airwayProtection' },
  { valueKey: 'neuromuscularWeakness', labelKey: 'neuromuscularWeakness' },
  { valueKey: 'copdOrAsthmaExacerbation', labelKey: 'copdOrAsthmaExacerbation' },
  { valueKey: 'neonatalRespiratoryDistress', labelKey: 'neonatalRespiratoryDistress' },
  { valueKey: 'burnOrInhalationInjury', labelKey: 'burnOrInhalationInjury' },
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
  { value: 'VC_AC', labelKey: 'vcAc' },
  { value: 'PC_AC', labelKey: 'pcAc' },
  { value: 'PRVC', labelKey: 'prvc' },
  { value: 'SIMV_VC', labelKey: 'simvVc' },
  { value: 'SIMV_PC', labelKey: 'simvPc' },
  { value: 'ACV', labelKey: 'acv' },
  { value: 'SIMV', labelKey: 'simv' },
  { value: 'PSV', labelKey: 'psv' },
  { value: 'CPAP', labelKey: 'cpap' },
  { value: 'BIPAP', labelKey: 'bipap' },
  { value: 'APRV', labelKey: 'aprv' },
  { value: 'HFOV', labelKey: 'hfov' },
  { value: 'NAVA', labelKey: 'nava' },
  { value: 'VOLUME_GUARANTEE', labelKey: 'volumeGuarantee' },
  { value: 'OTHER', labelKey: 'other' },
]);

const PERMITTED_MISSING_FIELD_OPTIONS = Object.freeze([
  { value: 'actualWeightKg/referenceWeightKg', labelKey: 'weight' },
  { value: 'SpO2', labelKey: 'spo2' },
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
  PATIENT_AGE_GROUP_OPTIONS,
  PATIENT_AGE_GROUP_VALUES,
  isPatientAgeGroupValue,
  resolvePatientAgeGroupFromAgeYears,
  SEX_OPTIONS,
  REASON_FOR_SUPPORT_OPTIONS,
  OXYGEN_SUPPORT_OPTIONS,
  VENTILATOR_MODE_OPTIONS,
  PERMITTED_MISSING_FIELD_OPTIONS,
  ASSESSMENT_TEST_IDS,
};
