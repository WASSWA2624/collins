/**
 * Dataset Capture Model
 * Structured clinician-entered ventilation dataset candidates.
 * File: datasetCapture.model.js
 */

const DATASET_CAPTURE_SOURCE_TYPE = 'clinical_case_capture';
const DATASET_CAPTURE_SCHEMA_VERSION = 'clinical_case_v1';

const DATASET_CAPTURE_ROLES = Object.freeze([
  'platform_admin',
  'facility_admin',
  'clinician',
  'icu_nurse',
  'specialist_reviewer',
  'research_governance_officer',
]);

const DATASET_TRAINING_APPROVAL_ROLES = Object.freeze([
  'platform_admin',
  'research_governance_officer',
]);

const DATASET_OUTCOME_REFERENCE_CATEGORIES = Object.freeze({
  POSITIVE_REFERENCE: {
    value: 'POSITIVE_REFERENCE',
    sentiment: 'positive',
    recommendationUse: 'eligible_positive_reference_after_review',
    excludeFromRecommendations: false,
  },
  NEGATIVE_OR_HARMFUL: {
    value: 'NEGATIVE_OR_HARMFUL',
    sentiment: 'negative',
    recommendationUse: 'negative_or_harmful_reference_after_review',
    excludeFromRecommendations: false,
  },
  NEUTRAL_REVIEW_ONLY: {
    value: 'NEUTRAL_REVIEW_ONLY',
    sentiment: 'neutral',
    recommendationUse: 'review_only_context',
    excludeFromRecommendations: true,
  },
  EXCLUDE_FROM_RECOMMENDATION: {
    value: 'EXCLUDE_FROM_RECOMMENDATION',
    sentiment: 'excluded',
    recommendationUse: 'excluded_from_recommendation_logic',
    excludeFromRecommendations: true,
  },
  OUTCOME_PENDING: {
    value: 'OUTCOME_PENDING',
    sentiment: 'pending',
    recommendationUse: 'pending_outcome_review',
    excludeFromRecommendations: true,
  },
});

const option = (label, value) => ({ label, value });

const YES_NO_UNKNOWN_OPTIONS = Object.freeze([
  option('Unknown', 'UNKNOWN'),
  option('Yes', 'YES'),
  option('No', 'NO'),
]);

const ventilationReasonOption = (label, searchText = []) => Object.freeze({
  label,
  value: label,
  searchText,
});

const DATASET_VENTILATION_REASON_OPTIONS = Object.freeze([
  ventilationReasonOption('Acute hypoxemic respiratory failure', ['hypoxia', 'hypoxaemia', 'low oxygen']),
  ventilationReasonOption('Acute hypercapnic respiratory failure', ['hypercapnia', 'high co2', 'carbon dioxide retention']),
  ventilationReasonOption('Mixed hypoxemic and hypercapnic respiratory failure', ['mixed respiratory failure']),
  ventilationReasonOption('ARDS requiring ventilatory support', ['acute respiratory distress syndrome']),
  ventilationReasonOption('Pneumonia-related respiratory failure', ['pneumonia', 'lower respiratory infection']),
  ventilationReasonOption('COPD exacerbation with ventilatory failure', ['copd', 'chronic obstructive pulmonary disease']),
  ventilationReasonOption('Asthma exacerbation with ventilatory failure', ['asthma', 'status asthmaticus']),
  ventilationReasonOption('Sepsis or shock with respiratory failure', ['sepsis', 'shock']),
  ventilationReasonOption('Airway protection', ['reduced consciousness', 'aspiration risk']),
  ventilationReasonOption('Post-operative ventilatory support', ['postoperative', 'post op', 'perioperative']),
  ventilationReasonOption('Neuromuscular weakness', ['myasthenia', 'guillain-barre', 'weakness']),
  ventilationReasonOption('Trauma or burns ventilatory support', ['trauma', 'burns']),
  ventilationReasonOption('Cardiac arrest or post-resuscitation support', ['cardiac arrest', 'resuscitation']),
  ventilationReasonOption('Weaning or extubation readiness assessment', ['weaning', 'sbt', 'spontaneous breathing trial']),
  ventilationReasonOption('Other specified clinical reason', ['other']),
  ventilationReasonOption('Unknown reason', ['unknown', 'not documented']),
]);

const VENTILATION_REASON_CANONICAL_LOOKUP = Object.freeze(
  DATASET_VENTILATION_REASON_OPTIONS.reduce((acc, item) => {
    acc[item.value.toLowerCase()] = item.value;
    acc[item.label.toLowerCase()] = item.value;
    (item.searchText || []).forEach((alias) => {
      acc[String(alias).toLowerCase()] = item.value;
    });
    return acc;
  }, {
    'hypoxemic respiratory failure': 'Acute hypoxemic respiratory failure',
    'hypoxaemic respiratory failure': 'Acute hypoxemic respiratory failure',
    'hypercapnic respiratory failure': 'Acute hypercapnic respiratory failure',
    'respiratory failure': 'Other specified clinical reason',
  })
);

const DEFAULT_DATASET_CAPTURE_FIELD_VALUES = Object.freeze({
  'provenance.sourceType': 'CLINICIAN_CHART_ABSTRACTION',
  'provenance.clinicianValidationStatus': 'PENDING_CLINICIAN_VALIDATION',
  'quality.reviewerConfidence': 'NEEDS_REVIEW',
});

const DATASET_CAPTURE_SECTION_DEFINITIONS = Object.freeze([
  {
    id: 'caseContext',
    title: 'Case context',
    description: 'Clinical reason, diagnosis, timing, and dataset completeness.',
  },
  {
    id: 'patient',
    title: 'Patient profile',
    description: 'De-identified patient characteristics used by ventilation calculations.',
  },
  {
    id: 'clinicalContext',
    title: 'Clinical context',
    description: 'Respiratory diagnosis, comorbidities, and bedside severity context.',
  },
  {
    id: 'clinicalSnapshot',
    title: 'Vitals and oxygenation',
    description: 'Bedside vital signs and oxygen support at the decision point.',
  },
  {
    id: 'abgTest',
    title: 'ABG and lactate',
    description: 'Arterial blood gas values and sampling context.',
  },
  {
    id: 'ventilatorSetting',
    title: 'Ventilator settings',
    description: 'Measured ventilator mode, pressures, volumes, and derived mechanics.',
  },
  {
    id: 'targetRanges',
    title: 'Targets and ranges used',
    description: 'Clinical target ranges used when judging the settings and response.',
  },
  {
    id: 'airwaySupport',
    title: 'Airway and humidification',
    description: 'Airway device, cuff, humidification, and secretion context.',
  },
  {
    id: 'treatments',
    title: 'Concurrent treatments',
    description: 'Therapies that affect ventilation decisions and outcomes.',
  },
  {
    id: 'outcome',
    title: 'Outcome labels',
    description: 'Observed response and outcome values for model evaluation or training.',
  },
  {
    id: 'provenance',
    title: 'Source and validation',
    description: 'Where the de-identified data came from and whether a clinician has validated it.',
  },
  {
    id: 'quality',
    title: 'Validity review',
    description: 'Structured uncertainty and readiness flags for reviewer triage.',
  },
]);

const DATASET_CAPTURE_FIELD_DEFINITIONS = Object.freeze([
  {
    path: 'caseContext.primaryDiagnosis',
    label: 'Primary diagnosis',
    section: 'Case context',
    sectionId: 'caseContext',
    type: 'select',
    required: true,
    options: [
      option('COPD exacerbation', 'COPD'),
      option('Asthma', 'ASTHMA'),
      option('Pneumonia', 'PNEUMONIA'),
      option('ARDS', 'ARDS'),
      option('Heart failure', 'HEART_FAILURE'),
      option('Sepsis', 'SEPSIS'),
      option('Trauma', 'TRAUMA'),
      option('Post-operative', 'POST_OPERATIVE'),
      option('Neuromuscular weakness', 'NEUROMUSCULAR'),
      option('Other', 'OTHER'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  {
    path: 'caseContext.reasonForVentilation',
    label: 'Reason for ventilation',
    section: 'Case context',
    sectionId: 'caseContext',
    type: 'select',
    required: true,
    searchable: true,
    allowCustomValue: true,
    placeholder: 'Search or add a controlled reason',
    searchPlaceholder: 'Search ventilation reasons',
    helperText: 'Use a standard reason where possible. If none fits, add a short de-identified custom reason.',
    options: DATASET_VENTILATION_REASON_OPTIONS,
  },
  {
    path: 'caseContext.ventilationIndication',
    label: 'Ventilation indication',
    section: 'Case context',
    sectionId: 'caseContext',
    type: 'select',
    options: [
      option('Hypoxemia', 'HYPOXEMIA'),
      option('Hypercapnia', 'HYPERCAPNIA'),
      option('Work of breathing', 'WORK_OF_BREATHING'),
      option('Airway protection', 'AIRWAY_PROTECTION'),
      option('Post-operative support', 'POST_OPERATIVE_SUPPORT'),
      option('Mixed indication', 'MIXED'),
      option('Other', 'OTHER'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  {
    path: 'caseContext.dataCompleteness',
    label: 'Dataset completeness',
    section: 'Case context',
    sectionId: 'caseContext',
    type: 'select',
    options: [
      option('Complete decision record', 'COMPLETE'),
      option('Key fields present', 'KEY_FIELDS_PRESENT'),
      option('Partial record', 'PARTIAL'),
      option('Outcome pending', 'OUTCOME_PENDING'),
    ],
  },
  {
    path: 'patient.patientPathway',
    label: 'Patient pathway',
    section: 'Patient profile',
    sectionId: 'patient',
    type: 'select',
    required: true,
    options: [
      option('Adult', 'ADULT'),
      option('Adolescent', 'ADOLESCENT'),
      option('Child', 'CHILD'),
      option('Infant', 'INFANT'),
      option('Neonate', 'NEONATE'),
      option('Obstetric', 'OBSTETRIC'),
      option('Trauma', 'TRAUMA'),
      option('Burns', 'BURNS'),
      option('Medical', 'MEDICAL'),
      option('Surgical', 'SURGICAL'),
      option('Other', 'OTHER'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  { path: 'patient.ageYears', label: 'Age years', section: 'Patient profile', sectionId: 'patient', type: 'number', required: true },
  { path: 'patient.ageMonths', label: 'Age months', section: 'Patient profile', sectionId: 'patient', type: 'number' },
  {
    path: 'patient.sexForSizeCalculations',
    label: 'Sex for size calculations',
    section: 'Patient profile',
    sectionId: 'patient',
    type: 'select',
    required: true,
    options: [
      option('Male', 'MALE'),
      option('Female', 'FEMALE'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  { path: 'patient.actualWeightKg', label: 'Actual weight kg', section: 'Patient profile', sectionId: 'patient', type: 'number' },
  { path: 'patient.heightOrLengthCm', label: 'Height or length cm', section: 'Patient profile', sectionId: 'patient', type: 'number' },
  { path: 'patient.referenceWeightKg', label: 'Reference weight kg', section: 'Patient profile', sectionId: 'patient', type: 'number' },
  { path: 'patient.referenceWeightMethod', label: 'Reference weight method', section: 'Patient profile', sectionId: 'patient', type: 'text' },
  {
    path: 'patient.pregnancyOrPostpartum',
    label: 'Pregnancy or postpartum',
    section: 'Patient profile',
    sectionId: 'patient',
    type: 'select',
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    path: 'clinicalContext.comorbidities',
    label: 'Comorbidities',
    section: 'Clinical context',
    sectionId: 'clinicalContext',
    type: 'textarea',
    placeholder: 'Comma-separated, de-identified terms',
  },
  {
    path: 'clinicalContext.copdPhenotype',
    label: 'COPD phenotype',
    section: 'Clinical context',
    sectionId: 'clinicalContext',
    type: 'select',
    options: [
      option('Not COPD', 'NOT_COPD'),
      option('Chronic CO2 retainer', 'CHRONIC_CO2_RETAINER'),
      option('Acute hypercapnic exacerbation', 'ACUTE_HYPERCAPNIC_EXACERBATION'),
      option('Mixed COPD and pneumonia', 'MIXED_COPD_PNEUMONIA'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  {
    path: 'clinicalContext.smokingHistory',
    label: 'Smoking history',
    section: 'Clinical context',
    sectionId: 'clinicalContext',
    type: 'select',
    options: [
      option('Never', 'NEVER'),
      option('Current', 'CURRENT'),
      option('Former', 'FORMER'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  {
    path: 'clinicalContext.infectionSuspected',
    label: 'Infection suspected',
    section: 'Clinical context',
    sectionId: 'clinicalContext',
    type: 'select',
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    path: 'clinicalContext.ardsSeverity',
    label: 'ARDS severity',
    section: 'Clinical context',
    sectionId: 'clinicalContext',
    type: 'select',
    options: [
      option('Not ARDS', 'NOT_ARDS'),
      option('Mild', 'MILD'),
      option('Moderate', 'MODERATE'),
      option('Severe', 'SEVERE'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  { path: 'clinicalSnapshot.measuredAt', label: 'Vitals measured at', section: 'Vitals and oxygenation', sectionId: 'clinicalSnapshot', type: 'text' },
  {
    path: 'clinicalSnapshot.oxygenSupportType',
    label: 'Oxygen support type',
    section: 'Vitals and oxygenation',
    sectionId: 'clinicalSnapshot',
    type: 'select',
    options: [
      option('Room air', 'ROOM_AIR'),
      option('Nasal cannula', 'NASAL_CANNULA'),
      option('Face mask', 'FACE_MASK'),
      option('Non-rebreather', 'NON_REBREATHER'),
      option('High-flow nasal oxygen', 'HFNO'),
      option('CPAP/BiPAP', 'NIV'),
      option('Invasive ventilator', 'INVASIVE_VENTILATOR'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  { path: 'clinicalSnapshot.spo2', label: 'SpO2 percent', section: 'Vitals and oxygenation', sectionId: 'clinicalSnapshot', type: 'number', required: true },
  { path: 'clinicalSnapshot.fio2', label: 'FiO2 fraction', section: 'Vitals and oxygenation', sectionId: 'clinicalSnapshot', type: 'number', required: true, placeholder: '0.21 to 1.0' },
  { path: 'clinicalSnapshot.respiratoryRate', label: 'Respiratory rate', section: 'Vitals and oxygenation', sectionId: 'clinicalSnapshot', type: 'number', required: true },
  { path: 'clinicalSnapshot.heartRate', label: 'Heart rate', section: 'Vitals and oxygenation', sectionId: 'clinicalSnapshot', type: 'number' },
  { path: 'clinicalSnapshot.systolicBp', label: 'Systolic BP', section: 'Vitals and oxygenation', sectionId: 'clinicalSnapshot', type: 'number' },
  { path: 'clinicalSnapshot.diastolicBp', label: 'Diastolic BP', section: 'Vitals and oxygenation', sectionId: 'clinicalSnapshot', type: 'number' },
  { path: 'clinicalSnapshot.meanArterialPressure', label: 'Mean arterial pressure', section: 'Vitals and oxygenation', sectionId: 'clinicalSnapshot', type: 'number' },
  { path: 'clinicalSnapshot.temperatureC', label: 'Temperature C', section: 'Vitals and oxygenation', sectionId: 'clinicalSnapshot', type: 'number' },
  { path: 'clinicalSnapshot.gcs', label: 'GCS', section: 'Vitals and oxygenation', sectionId: 'clinicalSnapshot', type: 'number' },
  {
    path: 'clinicalSnapshot.avpu',
    label: 'AVPU',
    section: 'Vitals and oxygenation',
    sectionId: 'clinicalSnapshot',
    type: 'select',
    options: [
      option('Alert', 'A'),
      option('Voice', 'V'),
      option('Pain', 'P'),
      option('Unresponsive', 'U'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  { path: 'clinicalSnapshot.rass', label: 'RASS', section: 'Vitals and oxygenation', sectionId: 'clinicalSnapshot', type: 'number' },
  {
    path: 'clinicalSnapshot.workOfBreathing',
    label: 'Work of breathing',
    section: 'Vitals and oxygenation',
    sectionId: 'clinicalSnapshot',
    type: 'select',
    options: [
      option('Mild', 'MILD'),
      option('Moderate', 'MODERATE'),
      option('Severe', 'SEVERE'),
      option('Unable to assess', 'UNABLE_TO_ASSESS'),
    ],
  },
  { path: 'abgTest.collectedAt', label: 'ABG collected at', section: 'ABG and lactate', sectionId: 'abgTest', type: 'text' },
  { path: 'abgTest.ph', label: 'pH', section: 'ABG and lactate', sectionId: 'abgTest', type: 'number', required: true },
  { path: 'abgTest.pao2', label: 'PaO2 mmHg', section: 'ABG and lactate', sectionId: 'abgTest', type: 'number' },
  { path: 'abgTest.paco2', label: 'PaCO2 mmHg', section: 'ABG and lactate', sectionId: 'abgTest', type: 'number', required: true },
  { path: 'abgTest.hco3', label: 'HCO3 mmol/L', section: 'ABG and lactate', sectionId: 'abgTest', type: 'number' },
  { path: 'abgTest.baseExcess', label: 'Base excess', section: 'ABG and lactate', sectionId: 'abgTest', type: 'number' },
  { path: 'abgTest.lactate', label: 'Lactate mmol/L', section: 'ABG and lactate', sectionId: 'abgTest', type: 'number' },
  { path: 'abgTest.fio2AtSample', label: 'FiO2 at sample', section: 'ABG and lactate', sectionId: 'abgTest', type: 'number' },
  { path: 'abgTest.spo2AtSample', label: 'SpO2 at sample', section: 'ABG and lactate', sectionId: 'abgTest', type: 'number' },
  { path: 'ventilatorSetting.measuredAt', label: 'Vent settings measured at', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'text' },
  {
    path: 'ventilatorSetting.mode',
    label: 'Ventilator mode',
    section: 'Ventilator settings',
    sectionId: 'ventilatorSetting',
    type: 'select',
    required: true,
    options: [
      option('Volume control', 'VC'),
      option('Pressure control', 'PC'),
      option('PRVC', 'PRVC'),
      option('SIMV', 'SIMV'),
      option('Pressure support', 'PSV'),
      option('CPAP', 'CPAP'),
      option('BiPAP/NIV', 'BIPAP'),
      option('HFNO', 'HFNO'),
      option('Oxygen only', 'OXYGEN_ONLY'),
      option('Other', 'OTHER'),
    ],
  },
  {
    path: 'ventilatorSetting.interface',
    label: 'Ventilator interface',
    section: 'Ventilator settings',
    sectionId: 'ventilatorSetting',
    type: 'select',
    options: [
      option('Endotracheal tube', 'ETT'),
      option('Tracheostomy', 'TRACHEOSTOMY'),
      option('Face mask NIV', 'FACE_MASK_NIV'),
      option('Nasal interface', 'NASAL_INTERFACE'),
      option('High-flow cannula', 'HFNC'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  { path: 'ventilatorSetting.tidalVolumeMl', label: 'Tidal volume mL', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number', required: true },
  { path: 'ventilatorSetting.vtMlPerKgReferenceWeight', label: 'VT mL/kg reference weight', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number' },
  { path: 'ventilatorSetting.respiratoryRateSet', label: 'Set respiratory rate', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number', required: true },
  { path: 'ventilatorSetting.respiratoryRateMeasured', label: 'Measured respiratory rate', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number' },
  { path: 'ventilatorSetting.fio2', label: 'Ventilator FiO2', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number' },
  { path: 'ventilatorSetting.peep', label: 'PEEP cmH2O', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number', required: true },
  { path: 'ventilatorSetting.pressureSupport', label: 'Pressure support', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number' },
  { path: 'ventilatorSetting.inspiratoryPressure', label: 'Inspiratory pressure', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number' },
  { path: 'ventilatorSetting.peakPressure', label: 'Peak pressure', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number' },
  { path: 'ventilatorSetting.plateauPressure', label: 'Plateau pressure', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number' },
  { path: 'ventilatorSetting.drivingPressure', label: 'Driving pressure', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number' },
  { path: 'ventilatorSetting.ieRatio', label: 'I:E ratio', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'text', placeholder: 'e.g. 1:3' },
  { path: 'ventilatorSetting.minuteVolumeLMin', label: 'Minute volume L/min', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number' },
  { path: 'ventilatorSetting.autoPeep', label: 'Auto-PEEP cmH2O', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number' },
  { path: 'ventilatorSetting.leakPercent', label: 'Leak percent', section: 'Ventilator settings', sectionId: 'ventilatorSetting', type: 'number' },
  { path: 'targetRanges.spo2Lower', label: 'SpO2 target low', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number', required: true },
  { path: 'targetRanges.spo2Upper', label: 'SpO2 target high', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number', required: true },
  { path: 'targetRanges.pao2Lower', label: 'PaO2 target low', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number' },
  { path: 'targetRanges.pao2Upper', label: 'PaO2 target high', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number' },
  { path: 'targetRanges.paco2Lower', label: 'PaCO2 acceptable low', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number' },
  { path: 'targetRanges.paco2Upper', label: 'PaCO2 acceptable high', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number' },
  { path: 'targetRanges.phLower', label: 'pH acceptable low', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number' },
  { path: 'targetRanges.phUpper', label: 'pH acceptable high', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number' },
  { path: 'targetRanges.vtMlPerKgLower', label: 'VT mL/kg low', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number' },
  { path: 'targetRanges.vtMlPerKgUpper', label: 'VT mL/kg high', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number' },
  { path: 'targetRanges.plateauPressureMax', label: 'Plateau pressure max', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number' },
  { path: 'targetRanges.drivingPressureMax', label: 'Driving pressure max', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number' },
  { path: 'targetRanges.peepLower', label: 'PEEP range low', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number' },
  { path: 'targetRanges.peepUpper', label: 'PEEP range high', section: 'Targets and ranges used', sectionId: 'targetRanges', type: 'number' },
  {
    path: 'airwaySupport.airwayRoute',
    label: 'Airway route',
    section: 'Airway and humidification',
    sectionId: 'airwaySupport',
    type: 'select',
    options: [
      option('Endotracheal', 'ENDOTRACHEAL'),
      option('Tracheostomy', 'TRACHEOSTOMY'),
      option('NIV mask', 'NIV_MASK'),
      option('Natural airway', 'NATURAL_AIRWAY'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  { path: 'airwaySupport.tubeType', label: 'Tube type', section: 'Airway and humidification', sectionId: 'airwaySupport', type: 'text' },
  { path: 'airwaySupport.internalDiameterMm', label: 'Internal diameter mm', section: 'Airway and humidification', sectionId: 'airwaySupport', type: 'number' },
  { path: 'airwaySupport.depthCm', label: 'Tube depth cm', section: 'Airway and humidification', sectionId: 'airwaySupport', type: 'number' },
  { path: 'airwaySupport.cuffPressureCmH2O', label: 'Cuff pressure cmH2O', section: 'Airway and humidification', sectionId: 'airwaySupport', type: 'number' },
  {
    path: 'airwaySupport.tubeSecured',
    label: 'Tube secured',
    section: 'Airway and humidification',
    sectionId: 'airwaySupport',
    type: 'select',
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    path: 'airwaySupport.humidificationMethod',
    label: 'Humidification method',
    section: 'Airway and humidification',
    sectionId: 'airwaySupport',
    type: 'select',
    options: [
      option('HME', 'HME'),
      option('Heated humidifier', 'HEATED_HUMIDIFIER'),
      option('None', 'NONE'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  {
    path: 'airwaySupport.secretionAmount',
    label: 'Secretion amount',
    section: 'Airway and humidification',
    sectionId: 'airwaySupport',
    type: 'select',
    options: [
      option('None', 'NONE'),
      option('Low', 'LOW'),
      option('Moderate', 'MODERATE'),
      option('High', 'HIGH'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  {
    path: 'airwaySupport.secretionThickness',
    label: 'Secretion thickness',
    section: 'Airway and humidification',
    sectionId: 'airwaySupport',
    type: 'select',
    options: [
      option('Thin', 'THIN'),
      option('Thick', 'THICK'),
      option('Bloody', 'BLOODY'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  {
    path: 'treatments.sedationDepthTarget',
    label: 'Sedation depth target',
    section: 'Concurrent treatments',
    sectionId: 'treatments',
    type: 'select',
    options: [
      option('Awake or light', 'LIGHT'),
      option('Moderate', 'MODERATE'),
      option('Deep', 'DEEP'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  { path: 'treatments.neuromuscularBlockade', label: 'Neuromuscular blockade', section: 'Concurrent treatments', sectionId: 'treatments', type: 'select', options: YES_NO_UNKNOWN_OPTIONS },
  { path: 'treatments.vasopressorSupport', label: 'Vasopressor support', section: 'Concurrent treatments', sectionId: 'treatments', type: 'select', options: YES_NO_UNKNOWN_OPTIONS },
  { path: 'treatments.bronchodilatorTherapy', label: 'Bronchodilator therapy', section: 'Concurrent treatments', sectionId: 'treatments', type: 'select', options: YES_NO_UNKNOWN_OPTIONS },
  { path: 'treatments.antibioticsStarted', label: 'Antibiotics started', section: 'Concurrent treatments', sectionId: 'treatments', type: 'select', options: YES_NO_UNKNOWN_OPTIONS },
  { path: 'treatments.steroidsGiven', label: 'Steroids given', section: 'Concurrent treatments', sectionId: 'treatments', type: 'select', options: YES_NO_UNKNOWN_OPTIONS },
  { path: 'treatments.pronePositioning', label: 'Prone positioning', section: 'Concurrent treatments', sectionId: 'treatments', type: 'select', options: YES_NO_UNKNOWN_OPTIONS },
  { path: 'treatments.nivFailureBeforeIntubation', label: 'NIV failure before intubation', section: 'Concurrent treatments', sectionId: 'treatments', type: 'select', options: YES_NO_UNKNOWN_OPTIONS },
  {
    path: 'outcome.outcomeType',
    label: 'Outcome type',
    section: 'Outcome labels',
    sectionId: 'outcome',
    type: 'select',
    required: true,
    options: [
      option('Extubated', 'EXTUBATED'),
      option('Transferred', 'TRANSFERRED'),
      option('Discharged', 'DISCHARGED'),
      option('Deceased', 'DECEASED'),
      option('Still admitted', 'STILL_ADMITTED'),
      option('Other', 'OTHER'),
      option('Outcome pending', 'OUTCOME_PENDING'),
    ],
  },
  {
    path: 'outcome.referenceUseCategory',
    label: 'Recommendation reference category',
    section: 'Outcome labels',
    sectionId: 'outcome',
    type: 'select',
    required: true,
    options: [
      option('Positive reference case', 'POSITIVE_REFERENCE'),
      option('Negative or harmful outcome case', 'NEGATIVE_OR_HARMFUL'),
      option('Neutral, reviewer context only', 'NEUTRAL_REVIEW_ONLY'),
      option('Exclude from recommendation logic', 'EXCLUDE_FROM_RECOMMENDATION'),
      option('Outcome pending', 'OUTCOME_PENDING'),
    ],
  },
  { path: 'outcome.outcomeDate', label: 'Outcome date', section: 'Outcome labels', sectionId: 'outcome', type: 'text' },
  { path: 'outcome.ventilatorDays', label: 'Ventilator days', section: 'Outcome labels', sectionId: 'outcome', type: 'number' },
  { path: 'outcome.icuLengthOfStayDays', label: 'ICU length of stay days', section: 'Outcome labels', sectionId: 'outcome', type: 'number' },
  { path: 'outcome.hospitalLengthOfStayDays', label: 'Hospital length of stay days', section: 'Outcome labels', sectionId: 'outcome', type: 'number' },
  { path: 'outcome.reintubationWithin48h', label: 'Reintubation within 48h', section: 'Outcome labels', sectionId: 'outcome', type: 'select', options: YES_NO_UNKNOWN_OPTIONS },
  { path: 'outcome.tracheostomy', label: 'Tracheostomy', section: 'Outcome labels', sectionId: 'outcome', type: 'select', options: YES_NO_UNKNOWN_OPTIONS },
  { path: 'outcome.vapSuspected', label: 'VAP suspected', section: 'Outcome labels', sectionId: 'outcome', type: 'select', options: YES_NO_UNKNOWN_OPTIONS },
  {
    path: 'outcome.dischargeRespiratorySupport',
    label: 'Discharge respiratory support',
    section: 'Outcome labels',
    sectionId: 'outcome',
    type: 'select',
    options: [
      option('None', 'NONE'),
      option('Oxygen', 'OXYGEN'),
      option('NIV', 'NIV'),
      option('Tracheostomy ventilator', 'TRACHEOSTOMY_VENTILATOR'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  { path: 'outcome.mortalityRelatedToRespiratoryFailure', label: 'Mortality related to respiratory failure', section: 'Outcome labels', sectionId: 'outcome', type: 'select', options: YES_NO_UNKNOWN_OPTIONS },
  {
    path: 'outcome.ventilatorChangeMade',
    label: 'Ventilator change made',
    section: 'Outcome labels',
    sectionId: 'outcome',
    type: 'select',
    options: [
      option('Increased support', 'INCREASED_SUPPORT'),
      option('Reduced support', 'REDUCED_SUPPORT'),
      option('Mode changed', 'MODE_CHANGED'),
      option('No change', 'NO_CHANGE'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  {
    path: 'outcome.responseAt1Hour',
    label: 'Response at 1 hour',
    section: 'Outcome labels',
    sectionId: 'outcome',
    type: 'select',
    options: [
      option('Improved', 'IMPROVED'),
      option('Stable', 'STABLE'),
      option('Worse', 'WORSE'),
      option('Unknown', 'UNKNOWN'),
    ],
  },
  { path: 'outcome.responseAt6Hours', label: 'Response at 6 hours', section: 'Outcome labels', sectionId: 'outcome', type: 'select', options: [
    option('Improved', 'IMPROVED'),
    option('Stable', 'STABLE'),
    option('Worse', 'WORSE'),
    option('Unknown', 'UNKNOWN'),
  ] },
  { path: 'outcome.responseAt24Hours', label: 'Response at 24 hours', section: 'Outcome labels', sectionId: 'outcome', type: 'select', options: [
    option('Improved', 'IMPROVED'),
    option('Stable', 'STABLE'),
    option('Worse', 'WORSE'),
    option('Unknown', 'UNKNOWN'),
  ] },
  {
    path: 'outcome.complications',
    label: 'Complications',
    section: 'Outcome labels',
    sectionId: 'outcome',
    type: 'textarea',
    placeholder: 'Comma-separated, de-identified terms',
  },
  {
    path: 'provenance.sourceType',
    label: 'Source type',
    section: 'Source and validation',
    sectionId: 'provenance',
    type: 'select',
    required: true,
    options: [
      option('Clinician chart abstraction', 'CLINICIAN_CHART_ABSTRACTION'),
      option('EHR or bedside chart export', 'EHR_CHART_EXPORT'),
      option('Ventilator or monitor export', 'DEVICE_EXPORT'),
      option('Credentialed registry extraction', 'REGISTRY_EXTRACTION'),
      option('Literature-derived research seed', 'LITERATURE_DERIVED_SEED'),
      option('Synthetic research seed', 'SYNTHETIC_RESEARCH_SEED'),
      option('Other', 'OTHER'),
    ],
  },
  {
    path: 'provenance.sourceName',
    label: 'Source name',
    section: 'Source and validation',
    sectionId: 'provenance',
    type: 'text',
    required: true,
    placeholder: 'e.g. ICU chart review, MIMIC-IV extraction, local QI export',
  },
  {
    path: 'provenance.sourceReference',
    label: 'De-identified source reference',
    section: 'Source and validation',
    sectionId: 'provenance',
    type: 'text',
    placeholder: 'Batch or case reference only; no MRN or patient name',
  },
  {
    path: 'provenance.sourceUrl',
    label: 'Source URL',
    section: 'Source and validation',
    sectionId: 'provenance',
    type: 'text',
    placeholder: 'Trusted website, DOI, or registry URL when applicable',
  },
  {
    path: 'provenance.sourceCitation',
    label: 'Source citation or extraction note',
    section: 'Source and validation',
    sectionId: 'provenance',
    type: 'textarea',
    placeholder: 'Citation, extraction query, or data dictionary note. Do not include identifiers.',
  },
  {
    path: 'provenance.sourceAccessedAt',
    label: 'Source accessed at',
    section: 'Source and validation',
    sectionId: 'provenance',
    type: 'text',
    placeholder: 'YYYY-MM-DD',
  },
  {
    path: 'provenance.clinicianValidationStatus',
    label: 'Clinician validation status',
    section: 'Source and validation',
    sectionId: 'provenance',
    type: 'select',
    required: true,
    options: [
      option('Pending clinician validation', 'PENDING_CLINICIAN_VALIDATION'),
      option('Validated by clinician', 'VALIDATED_BY_CLINICIAN'),
      option('Correction required', 'CORRECTION_REQUIRED'),
      option('Excluded from training', 'EXCLUDED_FROM_TRAINING'),
    ],
  },
  {
    path: 'quality.reviewerConfidence',
    label: 'Reviewer confidence',
    section: 'Quality review',
    sectionId: 'quality',
    type: 'select',
    required: true,
    options: [
      option('High', 'HIGH'),
      option('Medium', 'MEDIUM'),
      option('Low', 'LOW'),
      option('Needs review', 'NEEDS_REVIEW'),
    ],
  },
  {
    path: 'quality.missingCriticalData',
    label: 'Missing critical data',
    section: 'Quality review',
    sectionId: 'quality',
    type: 'textarea',
    placeholder: 'List missing fields, not patient identifiers',
  },
  {
    path: 'quality.uncertainFields',
    label: 'Uncertain fields',
    section: 'Quality review',
    sectionId: 'quality',
    type: 'textarea',
    placeholder: 'e.g. FiO2 estimate, PaO2 timing',
  },
  {
    path: 'quality.readyForModelTraining',
    label: 'Ready for model training review',
    section: 'Quality review',
    sectionId: 'quality',
    type: 'select',
    options: YES_NO_UNKNOWN_OPTIONS,
  },
]);

const NUMERIC_FIELD_PATHS = new Set(
  DATASET_CAPTURE_FIELD_DEFINITIONS
    .filter((field) => field.type === 'number')
    .map((field) => field.path)
);

const FIELD_DEFINITION_BY_PATH = Object.freeze(Object.fromEntries(
  DATASET_CAPTURE_FIELD_DEFINITIONS.map((field) => [field.path, field])
));

const DATE_FIELD_PATHS = new Set([
  'outcome.outcomeDate',
  'provenance.sourceAccessedAt',
]);

const DATE_TIME_FIELD_PATHS = new Set([
  'clinicalSnapshot.measuredAt',
  'abgTest.collectedAt',
  'ventilatorSetting.measuredAt',
]);

const FIELD_NUMERIC_RULES = Object.freeze({
  'patient.ageYears': { min: 0, max: 130, integer: true, message: 'Please enter a valid age in years.' },
  'patient.ageMonths': { min: 0, max: 11, integer: true, message: 'Please enter a valid age in months.' },
  'patient.actualWeightKg': { min: 0.3, max: 300, message: 'Please enter a valid weight in kg.' },
  'patient.heightOrLengthCm': { min: 20, max: 250, message: 'Please enter a valid height or length in cm.' },
  'patient.referenceWeightKg': { min: 0.3, max: 300, message: 'Please enter a valid reference weight in kg.' },
  'clinicalSnapshot.spo2': { min: 0, max: 100, message: 'Please enter a valid SpO2 percentage.' },
  'clinicalSnapshot.fio2': { min: 0.21, max: 1, message: 'Please enter FiO2 as a fraction from 0.21 to 1.0.' },
  'clinicalSnapshot.respiratoryRate': { min: 1, max: 100, message: 'Please enter a valid respiratory rate.' },
  'clinicalSnapshot.heartRate': { min: 0, max: 250, message: 'Please enter a valid heart rate.' },
  'clinicalSnapshot.systolicBp': { min: 0, max: 300, message: 'Please enter a valid systolic BP.' },
  'clinicalSnapshot.diastolicBp': { min: 0, max: 200, message: 'Please enter a valid diastolic BP.' },
  'clinicalSnapshot.meanArterialPressure': { min: 0, max: 250, message: 'Please enter a valid mean arterial pressure.' },
  'clinicalSnapshot.temperatureC': { min: 20, max: 45, message: 'Please enter a valid temperature in Celsius.' },
  'clinicalSnapshot.gcs': { min: 3, max: 15, integer: true, message: 'Please enter a valid GCS score.' },
  'clinicalSnapshot.rass': { min: -5, max: 4, integer: true, message: 'Please enter a valid RASS score.' },
  'abgTest.ph': { min: 6.8, max: 7.8, message: 'Please enter a valid pH value.' },
  'abgTest.pao2': { min: 0, max: 700, message: 'Please enter a valid PaO2 value.' },
  'abgTest.paco2': { min: 0, max: 250, message: 'Please enter a valid PaCO2 value.' },
  'abgTest.hco3': { min: 0, max: 80, message: 'Please enter a valid HCO3 value.' },
  'abgTest.baseExcess': { min: -40, max: 40, message: 'Please enter a valid base excess value.' },
  'abgTest.lactate': { min: 0, max: 30, message: 'Please enter a valid lactate value.' },
  'abgTest.fio2AtSample': { min: 0.21, max: 1, message: 'Please enter FiO2 at sample as a fraction from 0.21 to 1.0.' },
  'abgTest.spo2AtSample': { min: 0, max: 100, message: 'Please enter a valid SpO2 at sample percentage.' },
  'ventilatorSetting.tidalVolumeMl': { min: 0, max: 3000, message: 'Please enter a valid tidal volume.' },
  'ventilatorSetting.vtMlPerKgReferenceWeight': { min: 1, max: 20, message: 'Please enter a valid VT mL/kg reference weight.' },
  'ventilatorSetting.respiratoryRateSet': { min: 0, max: 100, message: 'Please enter a valid set respiratory rate.' },
  'ventilatorSetting.respiratoryRateMeasured': { min: 0, max: 100, message: 'Please enter a valid measured respiratory rate.' },
  'ventilatorSetting.fio2': { min: 0.21, max: 1, message: 'Please enter ventilator FiO2 as a fraction from 0.21 to 1.0.' },
  'ventilatorSetting.peep': { min: 0, max: 50, message: 'Please enter a valid PEEP value.' },
  'ventilatorSetting.pressureSupport': { min: 0, max: 80, message: 'Please enter a valid pressure support value.' },
  'ventilatorSetting.inspiratoryPressure': { min: 0, max: 80, message: 'Please enter a valid inspiratory pressure.' },
  'ventilatorSetting.peakPressure': { min: 0, max: 100, message: 'Please enter a valid peak pressure.' },
  'ventilatorSetting.plateauPressure': { min: 0, max: 80, message: 'Please enter a valid plateau pressure.' },
  'ventilatorSetting.drivingPressure': { min: 0, max: 80, message: 'Please enter a valid driving pressure.' },
  'ventilatorSetting.minuteVolumeLMin': { min: 0, max: 50, message: 'Please enter a valid minute volume.' },
  'ventilatorSetting.autoPeep': { min: 0, max: 50, message: 'Please enter a valid auto-PEEP value.' },
  'ventilatorSetting.leakPercent': { min: 0, max: 100, message: 'Please enter a valid leak percentage.' },
  'targetRanges.spo2Lower': { min: 0, max: 100, message: 'Please enter a valid lower SpO2 target.' },
  'targetRanges.spo2Upper': { min: 0, max: 100, message: 'Please enter a valid upper SpO2 target.' },
  'targetRanges.pao2Lower': { min: 0, max: 700, message: 'Please enter a valid lower PaO2 target.' },
  'targetRanges.pao2Upper': { min: 0, max: 700, message: 'Please enter a valid upper PaO2 target.' },
  'targetRanges.paco2Lower': { min: 0, max: 250, message: 'Please enter a valid lower PaCO2 target.' },
  'targetRanges.paco2Upper': { min: 0, max: 250, message: 'Please enter a valid upper PaCO2 target.' },
  'targetRanges.phLower': { min: 6.8, max: 7.8, message: 'Please enter a valid lower pH target.' },
  'targetRanges.phUpper': { min: 6.8, max: 7.8, message: 'Please enter a valid upper pH target.' },
  'targetRanges.vtMlPerKgLower': { min: 1, max: 20, message: 'Please enter a valid lower VT mL/kg target.' },
  'targetRanges.vtMlPerKgUpper': { min: 1, max: 20, message: 'Please enter a valid upper VT mL/kg target.' },
  'targetRanges.plateauPressureMax': { min: 0, max: 80, message: 'Please enter a valid plateau pressure maximum.' },
  'targetRanges.drivingPressureMax': { min: 0, max: 80, message: 'Please enter a valid driving pressure maximum.' },
  'targetRanges.peepLower': { min: 0, max: 50, message: 'Please enter a valid lower PEEP target.' },
  'targetRanges.peepUpper': { min: 0, max: 50, message: 'Please enter a valid upper PEEP target.' },
  'airwaySupport.internalDiameterMm': { min: 2, max: 12, message: 'Please enter a valid internal diameter.' },
  'airwaySupport.depthCm': { min: 1, max: 40, message: 'Please enter a valid tube depth.' },
  'airwaySupport.cuffPressureCmH2O': { min: 0, max: 80, message: 'Please enter a valid cuff pressure.' },
  'outcome.ventilatorDays': { min: 0, max: 365, message: 'Please enter valid ventilator days.' },
  'outcome.icuLengthOfStayDays': { min: 0, max: 365, message: 'Please enter a valid ICU length of stay.' },
  'outcome.hospitalLengthOfStayDays': { min: 0, max: 1000, message: 'Please enter a valid hospital length of stay.' },
});

const RANGE_FIELD_PAIRS = Object.freeze([
  ['targetRanges.spo2Lower', 'targetRanges.spo2Upper', 'SpO2 lower target must be less than or equal to the upper target.'],
  ['targetRanges.pao2Lower', 'targetRanges.pao2Upper', 'PaO2 lower target must be less than or equal to the upper target.'],
  ['targetRanges.paco2Lower', 'targetRanges.paco2Upper', 'PaCO2 lower target must be less than or equal to the upper target.'],
  ['targetRanges.phLower', 'targetRanges.phUpper', 'pH lower target must be less than or equal to the upper target.'],
  ['targetRanges.vtMlPerKgLower', 'targetRanges.vtMlPerKgUpper', 'VT mL/kg lower target must be less than or equal to the upper target.'],
  ['targetRanges.peepLower', 'targetRanges.peepUpper', 'PEEP lower target must be less than or equal to the upper target.'],
]);

const createEmptyDatasetCapturePreview = () => {
  const preview = {
    captureMetadata: {
      schemaVersion: DATASET_CAPTURE_SCHEMA_VERSION,
      entryMode: 'structured_clinician_entry',
      rawNoteStored: false,
    },
  };

  DATASET_CAPTURE_FIELD_DEFINITIONS.forEach((field) => {
    setByPath(preview, field.path, null);
  });
  Object.entries(DEFAULT_DATASET_CAPTURE_FIELD_VALUES).forEach(([path, value]) => {
    setByPath(preview, path, value);
  });

  return preview;
};

const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const extractNumber = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const value = Number(match[1]);
    if (Number.isFinite(value)) return value;
  }
  return null;
};

const extractRange = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const lower = Number(match[1]);
    const upper = Number(match[2]);
    if (Number.isFinite(lower) && Number.isFinite(upper)) return [lower, upper];
  }
  return [null, null];
};

const extractMode = (text) => {
  if (/\bprvc\b/i.test(text)) return 'PRVC';
  if (/\b(simv)\b/i.test(text)) return 'SIMV';
  if (/\b(psv|pressure support)\b/i.test(text)) return 'PSV';
  if (/\b(bipap|niv)\b/i.test(text)) return 'BIPAP';
  if (/\b(volume control|vc)\b/i.test(text)) return 'VC';
  if (/\b(pressure control|pc)\b/i.test(text)) return 'PC';
  const match = text.match(/\bmode\s*[:=]?\s*([A-Za-z0-9 /+-]{2,20})/i);
  return match?.[1]?.trim()?.toUpperCase() || null;
};

const normalizeSex = (text) => {
  if (/\b(male|man)\b/i.test(text)) return 'MALE';
  if (/\b(female|woman)\b/i.test(text)) return 'FEMALE';
  return null;
};

const normalizeDiagnosis = (text) => {
  if (/\bcopd\b|chronic obstructive/i.test(text)) return 'COPD';
  if (/\basthma\b/i.test(text)) return 'ASTHMA';
  if (/\bpneumonia\b/i.test(text)) return 'PNEUMONIA';
  if (/\bards\b/i.test(text)) return 'ARDS';
  if (/\bheart failure\b|\bchf\b/i.test(text)) return 'HEART_FAILURE';
  if (/\bsepsis\b/i.test(text)) return 'SEPSIS';
  if (/\btrauma\b/i.test(text)) return 'TRAUMA';
  return null;
};

const getByPath = (value, path) => path.split('.').reduce((acc, key) => acc?.[key], value);

const setByPath = (target, path, value) => {
  const parts = path.split('.');
  const last = parts.pop();
  const parent = parts.reduce((acc, key) => {
    if (!acc[key] || typeof acc[key] !== 'object') acc[key] = {};
    return acc[key];
  }, target);
  parent[last] = value;
  return target;
};

const normalizeEditableValue = (path, value) => {
  if (value === null || value === undefined) return null;
  if (!NUMERIC_FIELD_PATHS.has(path)) {
    const text = String(value).trim();
    if (path === 'caseContext.reasonForVentilation') return normalizeVentilationReasonValue(text);
    return text || null;
  }
  if (String(value).trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const isBlankValue = (value) => value === null || value === undefined || String(value).trim() === '';

const isValidDateString = (value) => {
  const text = String(value || '').trim();
  if (!text) return true;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const parsed = new Date(`${text}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === text;
  }
  const parsed = new Date(text);
  return !Number.isNaN(parsed.getTime());
};

const isValidDateTimeString = (value) => {
  const text = String(value || '').trim();
  if (!text) return true;
  return !Number.isNaN(new Date(text).getTime());
};

const normalizeVentilationReasonValue = (value) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  const lower = text.toLowerCase();
  return VENTILATION_REASON_CANONICAL_LOOKUP[lower] || text;
};

const createValidationDetail = (field, message, category = 'invalid') => ({
  path: field.path,
  label: field.label,
  section: field.section,
  sectionId: field.sectionId,
  message,
  category,
});

const validateDatasetCaptureFieldValues = (fieldValues = {}, options = {}) => {
  const sectionId = options?.sectionId;
  const fields = sectionId
    ? DATASET_CAPTURE_FIELD_DEFINITIONS.filter((field) => field.sectionId === sectionId)
    : DATASET_CAPTURE_FIELD_DEFINITIONS;
  const fieldPathSet = new Set(fields.map((field) => field.path));
  const details = [];

  fields.forEach((field) => {
    const rawValue = fieldValues[field.path];
    const blank = isBlankValue(rawValue);

    if (field.required && blank) {
      details.push(createValidationDetail(field, 'This field is required before continuing.', 'required'));
      return;
    }

    if (blank) return;

    if (field.type === 'select') {
      const allowedValues = new Set((field.options || []).map((item) => item.value));
      const normalizedValue = normalizeEditableValue(field.path, rawValue);
      if (field.allowCustomValue && !allowedValues.has(String(normalizedValue))) {
        const text = String(normalizedValue || '').trim();
        if (text.length < 3 || text.length > 160) {
          details.push(createValidationDetail(field, 'Enter a clear de-identified reason between 3 and 160 characters.'));
        }
        return;
      }
      if (allowedValues.size > 0 && !allowedValues.has(String(normalizedValue))) {
        details.push(createValidationDetail(field, 'Please choose a valid option.'));
      }
      return;
    }

    if (field.type === 'number') {
      const numberValue = Number(rawValue);
      const rule = FIELD_NUMERIC_RULES[field.path];
      if (!Number.isFinite(numberValue)) {
        details.push(createValidationDetail(field, rule?.message || `Please enter a valid ${field.label}.`));
        return;
      }
      if (rule?.integer && !Number.isInteger(numberValue)) {
        details.push(createValidationDetail(field, rule.message));
        return;
      }
      if ((Number.isFinite(rule?.min) && numberValue < rule.min) || (Number.isFinite(rule?.max) && numberValue > rule.max)) {
        details.push(createValidationDetail(field, rule.message));
      }
      return;
    }

    if (DATE_FIELD_PATHS.has(field.path) && !isValidDateString(rawValue)) {
      details.push(createValidationDetail(field, 'Please enter a valid date.'));
      return;
    }

    if (DATE_TIME_FIELD_PATHS.has(field.path) && !isValidDateTimeString(rawValue)) {
      details.push(createValidationDetail(field, 'Please enter a valid date/time.'));
    }
  });

  RANGE_FIELD_PAIRS.forEach(([lowerPath, upperPath, message]) => {
    if (!fieldPathSet.has(lowerPath) && !fieldPathSet.has(upperPath)) return;
    const lowerRaw = fieldValues[lowerPath];
    const upperRaw = fieldValues[upperPath];
    if (isBlankValue(lowerRaw) || isBlankValue(upperRaw)) return;
    const lower = Number(lowerRaw);
    const upper = Number(upperRaw);
    if (!Number.isFinite(lower) || !Number.isFinite(upper) || lower <= upper) return;
    const field = FIELD_DEFINITION_BY_PATH[upperPath] || FIELD_DEFINITION_BY_PATH[lowerPath];
    details.push(createValidationDetail(field, message));
  });

  const outcomeType = String(fieldValues['outcome.outcomeType'] || '');
  const referenceUseCategory = String(fieldValues['outcome.referenceUseCategory'] || '');
  const poorOutcomeSignals = new Set(['DECEASED']);
  const worseningSignals = [
    fieldValues['outcome.reintubationWithin48h'] === 'YES',
    fieldValues['outcome.responseAt1Hour'] === 'WORSE',
    fieldValues['outcome.responseAt6Hours'] === 'WORSE',
    fieldValues['outcome.responseAt24Hours'] === 'WORSE',
  ];

  if (fieldPathSet.has('outcome.referenceUseCategory') && referenceUseCategory === 'POSITIVE_REFERENCE') {
    if (poorOutcomeSignals.has(outcomeType) || worseningSignals.some(Boolean)) {
      details.push(createValidationDetail(
        FIELD_DEFINITION_BY_PATH['outcome.referenceUseCategory'],
        'Poor, unsafe, or worsening outcomes cannot be marked as positive reference cases without correction.'
      ));
    }
  }

  if (
    fieldPathSet.has('outcome.referenceUseCategory') &&
    outcomeType === 'OUTCOME_PENDING' &&
    !['OUTCOME_PENDING', 'NEUTRAL_REVIEW_ONLY', 'EXCLUDE_FROM_RECOMMENDATION'].includes(referenceUseCategory)
  ) {
    details.push(createValidationDetail(
      FIELD_DEFINITION_BY_PATH['outcome.referenceUseCategory'],
      'Outcome-pending records must be marked pending, review only, or excluded from recommendation logic.'
    ));
  }

  const fieldErrors = details.reduce((acc, detail) => {
    if (!acc[detail.path]) acc[detail.path] = detail.message;
    return acc;
  }, {});

  return {
    valid: details.length === 0,
    fieldErrors,
    errorDetails: details,
    invalidFields: details.map((detail) => detail.path),
  };
};

const flattenDatasetPreview = (preview) => Object.fromEntries(
  DATASET_CAPTURE_FIELD_DEFINITIONS.map((field) => {
    const value = getByPath(preview, field.path);
    return [field.path, value === null || value === undefined ? '' : String(value)];
  })
);

const hydrateDatasetPreview = (fieldValues = {}) => {
  const preview = createEmptyDatasetCapturePreview();
  DATASET_CAPTURE_FIELD_DEFINITIONS.forEach((field) => {
    setByPath(preview, field.path, normalizeEditableValue(field.path, fieldValues[field.path]));
  });
  return preview;
};

const getDatasetCaptureSections = () =>
  DATASET_CAPTURE_SECTION_DEFINITIONS.map((section) => ({
    ...section,
    fields: DATASET_CAPTURE_FIELD_DEFINITIONS.filter((field) => field.sectionId === section.id),
  }));

const getMissingDatasetFieldDefinitions = (preview) => DATASET_CAPTURE_FIELD_DEFINITIONS
  .filter((field) => field.required)
  .filter((field) => {
    const value = getByPath(preview, field.path);
    return value === null || value === undefined || value === '';
  });

const toMissingDatasetFieldDetail = (field) => ({
  path: field.path,
  label: field.label,
  section: field.section,
  sectionId: field.sectionId,
});

const getMissingDatasetFieldDetails = (preview) =>
  getMissingDatasetFieldDefinitions(preview).map(toMissingDatasetFieldDetail);

const getMissingDatasetFields = (preview) =>
  getMissingDatasetFieldDefinitions(preview).map((field) => field.path);

const hasAnyDatasetCaptureValue = (fieldValues = {}) =>
  DATASET_CAPTURE_FIELD_DEFINITIONS.some((field) => {
    const value = fieldValues[field.path];
    const defaultValue = DEFAULT_DATASET_CAPTURE_FIELD_VALUES[field.path];
    return (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== '' &&
      (defaultValue === undefined || String(value) !== String(defaultValue))
    );
  });

const getDatasetCaptureCompleteness = (fieldValues = {}) => {
  const validation = validateDatasetCaptureFieldValues(fieldValues);
  const missingFieldDetails = validation.errorDetails.filter((field) => field.category === 'required');
  const missingFields = missingFieldDetails.map((field) => field.path);
  const requiredTotal = DATASET_CAPTURE_FIELD_DEFINITIONS.filter((field) => field.required).length;
  const requiredIncompleteFields = new Set(
    validation.errorDetails
      .filter((field) => FIELD_DEFINITION_BY_PATH[field.path]?.required)
      .map((field) => field.path)
  );
  const requiredComplete = requiredTotal - requiredIncompleteFields.size;
  const enteredTotal = DATASET_CAPTURE_FIELD_DEFINITIONS.filter((field) => {
    const value = fieldValues[field.path];
    const defaultValue = DEFAULT_DATASET_CAPTURE_FIELD_VALUES[field.path];
    return (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== '' &&
      (defaultValue === undefined || String(value) !== String(defaultValue))
    );
  }).length;
  const invalidFieldDetails = validation.errorDetails.filter((field) => field.category !== 'required');

  return {
    enteredTotal,
    totalFields: DATASET_CAPTURE_FIELD_DEFINITIONS.length,
    requiredComplete,
    requiredTotal,
    missingFields,
    missingFieldDetails,
    invalidFields: invalidFieldDetails.map((field) => field.path),
    invalidFieldDetails,
    validationErrorDetails: validation.errorDetails,
    fieldErrors: validation.fieldErrors,
    isValid: validation.valid,
  };
};

const detectIdentifierWarnings = (noteText) => {
  const text = String(noteText || '');
  const warnings = [];
  if (/\b(MRN|medical record|hospital\s*(no|number)|patient\s*(id|name))\b/i.test(text)) {
    warnings.push('identifier_like_field_detected');
  }
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text)) warnings.push('email_detected');
  if (/\+?\d[\d\s().-]{7,}\d/.test(text)) warnings.push('phone_like_value_detected');
  return [...new Set(warnings)];
};

const detectUncertaintyFields = (preview, noteText) => {
  const uncertain = [];
  const text = String(noteText || '');
  if (/\b(about|approx|approximately|estimated|maybe|unclear|unknown)\b/i.test(text)) {
    uncertain.push('patient.ageYears');
  }
  if (preview.patient.sexForSizeCalculations === null) uncertain.push('patient.sexForSizeCalculations');
  if (preview.clinicalSnapshot.fio2 !== null && (preview.clinicalSnapshot.fio2 < 0.21 || preview.clinicalSnapshot.fio2 > 1)) {
    uncertain.push('clinicalSnapshot.fio2');
  }
  if (preview.abgTest.ph !== null && (preview.abgTest.ph < 6.8 || preview.abgTest.ph > 7.8)) {
    uncertain.push('abgTest.ph');
  }
  if (preview.ventilatorSetting.plateauPressure !== null && preview.ventilatorSetting.plateauPressure > 35) {
    uncertain.push('ventilatorSetting.plateauPressure');
  }
  return [...new Set(uncertain)];
};

const parseDatasetCaptureNote = (noteText) => {
  const text = normalizeText(noteText);
  const preview = createEmptyDatasetCapturePreview();
  preview.caseContext.primaryDiagnosis = normalizeDiagnosis(text);
  preview.caseContext.reasonForVentilation = /\bhypercap/i.test(text)
    ? normalizeVentilationReasonValue('Acute hypercapnic respiratory failure')
    : /\bhypox/i.test(text)
      ? normalizeVentilationReasonValue('Acute hypoxemic respiratory failure')
      : null;
  preview.caseContext.ventilationIndication = /\bhypercap/i.test(text)
    ? 'HYPERCAPNIA'
    : /\bhypox/i.test(text)
      ? 'HYPOXEMIA'
      : null;
  preview.patient.patientPathway = /\b(neonate|newborn)\b/i.test(text)
    ? 'NEONATE'
    : /\b(child|paediatric|pediatric)\b/i.test(text)
      ? 'CHILD'
      : 'ADULT';
  preview.patient.ageYears = extractNumber(text, [/\bage\s*[:=]?\s*(\d{1,3})\b/i, /\b(\d{1,3})\s*y(?:ears?)?\b/i]);
  preview.patient.sexForSizeCalculations = normalizeSex(text);
  preview.patient.actualWeightKg = extractNumber(text, [/\bweight\s*[:=]?\s*(\d{1,3}(?:\.\d+)?)\s*kg/i]);
  preview.patient.heightOrLengthCm = extractNumber(text, [/\bheight\s*[:=]?\s*(\d{2,3}(?:\.\d+)?)\s*cm/i]);
  preview.clinicalContext.copdPhenotype = /\bcopd\b/i.test(text) ? 'ACUTE_HYPERCAPNIC_EXACERBATION' : null;
  preview.clinicalSnapshot.spo2 = extractNumber(text, [/spo2\s*[:=]?\s*(\d{2,3})/i, /saturation\s*[:=]?\s*(\d{2,3})/i]);
  const fio2 = extractNumber(text, [/fio2\s*[:=]?\s*(0?\.\d{1,2})/i, /fio2\s*[:=]?\s*(\d{2,3})\s*%/i]);
  preview.clinicalSnapshot.fio2 = fio2 && fio2 > 1 ? Number((fio2 / 100).toFixed(2)) : fio2;
  preview.clinicalSnapshot.respiratoryRate = extractNumber(text, [/\bRR\s*[:=]?\s*(\d{1,3})/i, /respiratory rate\s*[:=]?\s*(\d{1,3})/i]);
  preview.clinicalSnapshot.heartRate = extractNumber(text, [/\bHR\s*[:=]?\s*(\d{1,3})/i, /heart rate\s*[:=]?\s*(\d{1,3})/i]);
  preview.abgTest.ph = extractNumber(text, [/\bpH\s*[:=]?\s*(\d\.\d{1,3})/i]);
  preview.abgTest.pao2 = extractNumber(text, [/pa[o0]2\s*[:=]?\s*(\d{1,3})/i]);
  preview.abgTest.paco2 = extractNumber(text, [/pa[cC][o0]2\s*[:=]?\s*(\d{1,3})/i]);
  preview.abgTest.hco3 = extractNumber(text, [/hco3\s*[:=]?\s*(\d{1,3})/i]);
  preview.abgTest.lactate = extractNumber(text, [/lactate\s*[:=]?\s*(\d+(?:\.\d+)?)/i]);
  preview.abgTest.fio2AtSample = preview.clinicalSnapshot.fio2;
  preview.abgTest.spo2AtSample = preview.clinicalSnapshot.spo2;
  preview.ventilatorSetting.mode = extractMode(text);
  preview.ventilatorSetting.tidalVolumeMl = extractNumber(text, [/\bVT\s*[:=]?\s*(\d{2,4})/i, /tidal volume\s*[:=]?\s*(\d{2,4})/i]);
  preview.ventilatorSetting.respiratoryRateSet = extractNumber(text, [/set\s*RR\s*[:=]?\s*(\d{1,3})/i]);
  preview.ventilatorSetting.fio2 = preview.clinicalSnapshot.fio2;
  preview.ventilatorSetting.peep = extractNumber(text, [/PEEP\s*[:=]?\s*(\d{1,2})/i]);
  preview.ventilatorSetting.plateauPressure = extractNumber(text, [/plateau\s*[:=]?\s*(\d{1,2})/i]);
  preview.ventilatorSetting.peakPressure = extractNumber(text, [/peak\s*[:=]?\s*(\d{1,2})/i]);
  preview.ventilatorSetting.drivingPressure = (
    Number.isFinite(preview.ventilatorSetting.plateauPressure) &&
    Number.isFinite(preview.ventilatorSetting.peep)
  )
    ? preview.ventilatorSetting.plateauPressure - preview.ventilatorSetting.peep
    : null;
  const [spo2Lower, spo2Upper] = extractRange(text, [/target\s*spo2\s*[:=]?\s*(\d{2,3})\s*[-to]+\s*(\d{2,3})/i]);
  preview.targetRanges.spo2Lower = spo2Lower;
  preview.targetRanges.spo2Upper = spo2Upper;
  const [paco2Lower, paco2Upper] = extractRange(text, [/target\s*paco2\s*[:=]?\s*(\d{1,3})\s*[-to]+\s*(\d{1,3})/i]);
  preview.targetRanges.paco2Lower = paco2Lower;
  preview.targetRanges.paco2Upper = paco2Upper;
  preview.provenance.sourceType = 'CLINICIAN_CHART_ABSTRACTION';
  preview.provenance.sourceName = 'Pasted ICU note structured preview';
  preview.provenance.clinicianValidationStatus = 'PENDING_CLINICIAN_VALIDATION';
  preview.quality.reviewerConfidence = 'NEEDS_REVIEW';

  return {
    structuredPreviewJson: preview,
    fieldValues: flattenDatasetPreview(preview),
    missingFields: getMissingDatasetFields(preview),
    uncertaintyFields: detectUncertaintyFields(preview, noteText),
    identifierWarnings: detectIdentifierWarnings(noteText),
    noteStorage: 'raw_note_not_saved',
  };
};

const createDatasetCaptureClientRecordId = (prefix = 'dataset-capture') => {
  const timestamp = Date.now().toString(36);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${timestamp}-${suffix}`;
};

const buildDatasetOutcomeReview = (preview = {}) => {
  const selectedCategory = preview?.outcome?.referenceUseCategory || 'OUTCOME_PENDING';
  const profile = DATASET_OUTCOME_REFERENCE_CATEGORIES[selectedCategory] || DATASET_OUTCOME_REFERENCE_CATEGORIES.OUTCOME_PENDING;

  return {
    referenceUseCategory: profile.value,
    outcomeSentiment: profile.sentiment,
    recommendationUse: profile.recommendationUse,
    excludeFromRecommendations: profile.excludeFromRecommendations,
    clinicianAssigned: true,
    requiresHumanReview: true,
  };
};

const buildDatasetCaptureSubmission = ({
  facilityId,
  fieldValues,
  idempotencyKey,
  clientRecordId,
  submittedAt,
} = {}) => {
  const recordId = clientRecordId || createDatasetCaptureClientRecordId();
  const timestamp = submittedAt || new Date().toISOString();
  const structuredPreviewJson = hydrateDatasetPreview(fieldValues);
  structuredPreviewJson.caseContext = {
    ...structuredPreviewJson.caseContext,
    capturedAt: timestamp,
  };
  const provenance = structuredPreviewJson.provenance || {};
  structuredPreviewJson.captureMetadata = {
    ...structuredPreviewJson.captureMetadata,
    capturedAt: timestamp,
    submittedAt: timestamp,
    sourceType: provenance.sourceType || 'CLINICIAN_CHART_ABSTRACTION',
    clinicianValidationStatus: provenance.clinicianValidationStatus || 'PENDING_CLINICIAN_VALIDATION',
    outcomeReview: buildDatasetOutcomeReview(structuredPreviewJson),
  };
  const outcomeReview = buildDatasetOutcomeReview(structuredPreviewJson);

  return {
    facilityId,
    sourceType: DATASET_CAPTURE_SOURCE_TYPE,
    structuredPreviewJson,
    governanceJson: {
      captureType: 'structured_clinician_entry',
      dataCaptureSchemaVersion: DATASET_CAPTURE_SCHEMA_VERSION,
      rawNoteStored: false,
      externalModelServicesUsed: false,
      pendingHumanReview: true,
      clinicianValidationStatus: provenance.clinicianValidationStatus || 'PENDING_CLINICIAN_VALIDATION',
      outcomeReview,
      sourceProvenance: {
        sourceType: provenance.sourceType || 'CLINICIAN_CHART_ABSTRACTION',
        sourceName: provenance.sourceName || null,
        sourceReference: provenance.sourceReference || null,
        sourceUrl: provenance.sourceUrl || null,
        sourceCitation: provenance.sourceCitation || null,
        sourceAccessedAt: provenance.sourceAccessedAt || null,
      },
      submittedAt: timestamp,
    },
    idempotencyKey: idempotencyKey || recordId,
    clientRecordId: recordId,
    clientCreatedAt: timestamp,
    clientUpdatedAt: timestamp,
  };
};

const normalizeRoles = (roles) => (Array.isArray(roles) ? roles : [roles])
  .map((role) => String(role || '').trim().toLowerCase())
  .filter(Boolean);

const hasAnyRole = (roles, allowedRoles) => {
  const normalized = normalizeRoles(roles);
  return normalized.some((role) => allowedRoles.includes(role));
};

const canCaptureDatasetCandidate = (roles) => hasAnyRole(roles, DATASET_CAPTURE_ROLES);
const canApproveTrainingDataset = (roles) => hasAnyRole(roles, DATASET_TRAINING_APPROVAL_ROLES);

const resolveDatasetCaptureFacilityId = (user) => {
  const active = user?.activeFacility;
  if (active?.facilityId) return active.facilityId;
  if (active?.id) return active.id;
  const membership = Array.isArray(user?.memberships)
    ? user.memberships.find((item) => item?.status === 'APPROVED' && item?.facilityId)
    : null;
  return membership?.facilityId || null;
};

export {
  DATASET_CAPTURE_FIELD_DEFINITIONS,
  DATASET_CAPTURE_ROLES,
  DATASET_CAPTURE_SCHEMA_VERSION,
  DATASET_CAPTURE_SECTION_DEFINITIONS,
  DATASET_CAPTURE_SOURCE_TYPE,
  DATASET_VENTILATION_REASON_OPTIONS,
  DATASET_OUTCOME_REFERENCE_CATEGORIES,
  DATASET_TRAINING_APPROVAL_ROLES,
  DEFAULT_DATASET_CAPTURE_FIELD_VALUES,
  buildDatasetOutcomeReview,
  buildDatasetCaptureSubmission,
  canApproveTrainingDataset,
  canCaptureDatasetCandidate,
  createDatasetCaptureClientRecordId,
  createEmptyDatasetCapturePreview,
  detectIdentifierWarnings,
  flattenDatasetPreview,
  getDatasetCaptureCompleteness,
  getDatasetCaptureSections,
  getMissingDatasetFieldDetails,
  getMissingDatasetFields,
  hasAnyDatasetCaptureValue,
  hydrateDatasetPreview,
  parseDatasetCaptureNote,
  resolveDatasetCaptureFacilityId,
  validateDatasetCaptureFieldValues,
};
