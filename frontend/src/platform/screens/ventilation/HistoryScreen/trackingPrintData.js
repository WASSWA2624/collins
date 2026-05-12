/**
 * Programmatic tracking print document builder.
 * File: trackingPrintData.js
 */
import { formatDateTime } from '@features/tracking';
import { getPatientLabel } from './trackingDetailData';

const EMPTY_VALUE = '';

const EVENT_LABELS = Object.freeze({
  admission_created: 'Admission created',
  clinical_snapshot: 'Clinical observations',
  abg_test: 'ABG result',
  ventilator_setting: 'Ventilator settings',
  airway_device: 'Airway device',
  humidification: 'Humidification',
  daily_review: 'Daily ventilation review',
  outcome: 'Outcome',
});

const UI_ONLY_KEYS = new Set([
  'admittedAtLabel',
  'admittedDateLabel',
  'admittedTimeLabel',
  'admissionStatusLabel',
  'ageLabel',
  'bedLabel',
  'missingDataLabel',
  'patientPathwayLabel',
  'reviewLabel',
  'risk',
  'searchText',
  'syncLabel',
]);

const RELATION_KEYS = new Set([
  'abgTests',
  'admission',
  'admissions',
  'airwayDevices',
  'clinicalSnapshots',
  'createdBy',
  'dailyReviews',
  'datasetCases',
  'enteredBy',
  'facility',
  'humidificationDecisions',
  'modelOutputs',
  'outcomes',
  'patient',
  'raw',
  'reviewedBy',
  'ventilatorSettings',
]);

const UI_STATUS_KEYS = new Set([
  'reviewState',
  'reviewStatus',
  'syncState',
  'syncStatus',
]);

const TECHNICAL_ID_KEYS = new Set([
  'admissionId',
  'clientRecordId',
  'confirmedByUserId',
  'createdByUserId',
  'deviceId',
  'enteredByUserId',
  'facilityId',
  'id',
  'patientId',
  'reviewedByUserId',
]);

const FIELD_LABELS = Object.freeze({
  abgTests: 'ABG tests',
  actualWeightKg: 'Actual weight',
  admissionSource: 'Admission source',
  admittedAt: 'Admitted at',
  airwayBleeding: 'Airway bleeding',
  airwayRoute: 'Airway route',
  appAdmissionCode: 'Admission code',
  appPatientCode: 'Patient ID',
  patientCode: 'Patient ID',
  avpu: 'AVPU',
  baseExcess: 'Base excess',
  bedNumber: 'Bed',
  calculationSummaryJson: 'Calculation summary',
  clientCreatedAt: 'Client created at',
  clientUpdatedAt: 'Client updated at',
  clinicalFlagsJson: 'Clinical flags',
  collectedAt: 'Collected at',
  comorbiditiesJson: 'Comorbidities',
  confirmedOption: 'Confirmed option',
  correctedAgeWeeks: 'Corrected age',
  createdAt: 'Created at',
  dateOfBirth: 'Date of birth',
  depthCm: 'Tube depth',
  diastolicBp: 'Diastolic BP',
  drivingPressure: 'Driving pressure',
  estimatedAge: 'Estimated age',
  expectedLongVentilation: 'Expected long ventilation',
  facilityName: 'Facility',
  fio2: 'FiO2',
  fio2AtSample: 'FiO2 at sample',
  firstName: 'First name',
  gcs: 'GCS',
  gestationalAgeWeeks: 'Gestational age',
  hco3: 'HCO3',
  heartRate: 'Heart rate',
  heightOrLengthCm: 'Height/length',
  highMinuteVentilation: 'High minute ventilation',
  hospitalLengthOfStayDays: 'Hospital length of stay',
  hospitalNumber: 'Hospital number',
  icuLengthOfStayDays: 'ICU length of stay',
  ieRatio: 'I:E ratio',
  inspiratoryPressure: 'Inspiratory pressure',
  internalDiameterMm: 'Internal diameter',
  lastName: 'Last name',
  mainCondition: 'Main condition',
  meanArterialPressure: 'Mean arterial pressure',
  measuredAt: 'Measured at',
  minuteVolumeLMin: 'Minute volume',
  optionalName: 'Patient name',
  outcomeDate: 'Outcome date',
  outcomeType: 'Outcome',
  oxygenSupportType: 'Oxygen support',
  paco2: 'PaCO2',
  pao2: 'PaO2',
  patientPathway: 'Patient pathway',
  pathwayDetailsJson: 'Pathway details',
  peakPressure: 'Peak pressure',
  peep: 'PEEP',
  ph: 'pH',
  plateauPressure: 'Plateau pressure',
  pressureSupport: 'Pressure support',
  proneStatus: 'Prone status',
  rass: 'RASS',
  reasonForVentilation: 'Reason for ventilation',
  referenceWeightKg: 'Reference weight',
  referenceWeightMethod: 'Reference weight method',
  reintubationWithin48h: 'Reintubation within 48h',
  respiratoryRate: 'Respiratory rate',
  respiratoryRateMeasured: 'Measured respiratory rate',
  respiratoryRateSet: 'Set respiratory rate',
  reviewDate: 'Review date',
  sbtFailureReason: 'SBT failure reason',
  sbtStatus: 'SBT status',
  secretionAmount: 'Secretion amount',
  secretionThickness: 'Secretion thickness',
  sedationLightEnough: 'Sedation light enough',
  secretionsManageable: 'Secretions manageable',
  sexForSizeCalculations: 'Sex for size calculations',
  spo2: 'SpO2',
  spo2AtSample: 'SpO2 at sample',
  suggestedOption: 'Suggested option',
  systolicBp: 'Systolic BP',
  temperatureC: 'Temperature',
  thickSecretions: 'Thick secretions',
  tidalVolumeMl: 'Tidal volume',
  tracheostomy: 'Tracheostomy',
  tubeSecured: 'Tube secured',
  tubeType: 'Tube type',
  updatedAt: 'Updated at',
  validationStatus: 'Validation status',
  vapBundleJson: 'VAP bundle',
  vapSuspected: 'VAP suspected',
  ventilatorDays: 'Ventilator days',
  version: 'Version',
  vtMlPerKgReferenceWeight: 'VT/reference weight',
});

const UNIT_BY_KEY = Object.freeze({
  actualWeightKg: 'kg',
  baseExcess: 'mmol/L',
  correctedAgeWeeks: 'weeks',
  cuffPressureCmH2O: 'cmH2O',
  depthCm: 'cm',
  drivingPressure: 'cmH2O',
  gestationalAgeWeeks: 'weeks',
  hco3: 'mmol/L',
  heightOrLengthCm: 'cm',
  hospitalLengthOfStayDays: 'days',
  icuLengthOfStayDays: 'days',
  inspiratoryPressure: 'cmH2O',
  internalDiameterMm: 'mm',
  lactate: 'mmol/L',
  meanArterialPressure: 'mmHg',
  minuteVolumeLMin: 'L/min',
  paco2: 'mmHg',
  pao2: 'mmHg',
  peakPressure: 'cmH2O',
  peep: 'cmH2O',
  plateauPressure: 'cmH2O',
  pressureSupport: 'cmH2O',
  respiratoryRate: '/min',
  respiratoryRateMeasured: '/min',
  respiratoryRateSet: '/min',
  systolicBp: 'mmHg',
  diastolicBp: 'mmHg',
  temperatureC: 'C',
  tidalVolumeMl: 'mL',
  ventilatorDays: 'days',
  vtMlPerKgReferenceWeight: 'mL/kg',
});

const PERCENT_KEYS = new Set(['fio2', 'fio2AtSample', 'spo2', 'spo2AtSample']);

const DATE_ONLY_KEYS = new Set(['dateOfBirth']);

const ENUM_KEYS = new Set([
  'outcomeType',
  'patientPathway',
  'sexForSizeCalculations',
  'status',
]);

const CAPTURE_META_ORDER = [
  'appPatientCode',
  'patientCode',
  'appAdmissionCode',
  'version',
  'measuredAt',
  'collectedAt',
  'reviewDate',
  'outcomeDate',
  'admittedAt',
  'source',
  'validationStatus',
  'clientCreatedAt',
  'clientUpdatedAt',
  'createdAt',
  'updatedAt',
];

const PATIENT_FIELD_ORDER = [
  'appPatientCode',
  'patientCode',
  'hospitalNumber',
  'firstName',
  'lastName',
  'optionalName',
  'patientPathway',
  'dateOfBirth',
  'ageYears',
  'ageMonths',
  'ageDays',
  'estimatedAge',
  'gestationalAgeWeeks',
  'correctedAgeWeeks',
  'sexForSizeCalculations',
  'actualWeightKg',
  'heightOrLengthCm',
  'referenceWeightKg',
  'referenceWeightMethod',
  'pathwayDetailsJson',
  'createdAt',
  'updatedAt',
];

const ADMISSION_FIELD_ORDER = [
  'appAdmissionCode',
  'facilityName',
  'bedNumber',
  'status',
  'admittedAt',
  'admissionSource',
  'reasonForVentilation',
  'clientCreatedAt',
  'clientUpdatedAt',
  'createdAt',
  'updatedAt',
];

const hasValue = (value) =>
  value !== null && value !== undefined && String(value).trim() !== '';

const toArray = (value) => (Array.isArray(value) ? value : []);

const toRecordArray = (value) => {
  if (Array.isArray(value)) return value;
  return value && typeof value === 'object' ? [value] : [];
};

const getDateValue = (record = {}, ...fields) => {
  for (const field of fields) {
    if (record?.[field]) return record[field];
  }
  return null;
};

const toDateMs = (value) => {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const sortByDateAsc = (records, ...fields) =>
  [...toArray(records)].sort(
    (left, right) =>
      toDateMs(getDateValue(left, ...fields)) -
      toDateMs(getDateValue(right, ...fields))
  );

const sortByDateDesc = (records, ...fields) =>
  [...toArray(records)].sort(
    (left, right) =>
      toDateMs(getDateValue(right, ...fields)) -
      toDateMs(getDateValue(left, ...fields))
  );

const firstByDate = (records, ...fields) =>
  sortByDateAsc(records, ...fields)[0] || null;

const latestByDate = (records, ...fields) =>
  sortByDateDesc(records, ...fields)[0] || null;

const titleCaseToken = (value) =>
  String(value || '')
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatNumber = (value, maximumFractionDigits = 1) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return EMPTY_VALUE;
  return numeric.toLocaleString(undefined, { maximumFractionDigits });
};

const formatBoolean = (value) => {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return EMPTY_VALUE;
};

const formatDate = (value) => (hasValue(value) ? formatDateTime(value) : EMPTY_VALUE);

const formatEnum = (value) => (hasValue(value) ? titleCaseToken(value) : EMPTY_VALUE);

const formatJsonValue = (value) => {
  if (!hasValue(value)) return EMPTY_VALUE;
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : formatJsonValue(item)))
      .filter(Boolean)
      .join(', ');
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, item]) => hasValue(item))
      .map(([key, item]) => `${titleCaseToken(key)}: ${formatClinicalValue(item)}`)
      .join('; ');
  }
  return String(value);
};

const formatDateOnly = (value) => {
  if (!hasValue(value)) return EMPTY_VALUE;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return EMPTY_VALUE;
  return date.toLocaleDateString(undefined, { dateStyle: 'medium' });
};

const formatPercentFraction = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return EMPTY_VALUE;
  const percent = numeric <= 1 ? numeric * 100 : numeric;
  return `${formatNumber(percent, 0)}%`;
};

const formatClinicalValue = (value, unit = '') => {
  if (typeof value === 'boolean') return formatBoolean(value);
  if (Array.isArray(value) || (value && typeof value === 'object')) {
    return formatJsonValue(value);
  }
  if (!hasValue(value)) return EMPTY_VALUE;
  if (!unit) return String(value);
  const numeric = formatNumber(value);
  return numeric ? `${numeric} ${unit}` : EMPTY_VALUE;
};

const field = (label, value, unit) => {
  const formatted = unit ? formatClinicalValue(value, unit) : formatClinicalValue(value);
  return hasValue(formatted) ? { label, value: formatted } : null;
};

const dateField = (label, value) => {
  const formatted = formatDate(value);
  return hasValue(formatted) ? { label, value: formatted } : null;
};

const percentField = (label, value) => {
  const formatted = formatPercentFraction(value);
  return hasValue(formatted) ? { label, value: formatted } : null;
};

const enumField = (label, value) => {
  const formatted = formatEnum(value);
  return hasValue(formatted) ? { label, value: formatted } : null;
};

const compactFields = (fields) => fields.filter(Boolean);

const safeRecord = (record) =>
  record && typeof record === 'object' ? record : {};

const labelForKey = (key) =>
  FIELD_LABELS[key] ||
  String(key)
    .replace(/Json$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (letter) => letter.toUpperCase());

const isDateKey = (key) => /(?:At|Date)$/.test(key) || DATE_ONLY_KEYS.has(key);

const formatRawValue = (key, value) => {
  if (DATE_ONLY_KEYS.has(key)) return formatDateOnly(value);
  if (isDateKey(key)) return formatDate(value);
  if (PERCENT_KEYS.has(key)) return formatPercentFraction(value);
  if (UNIT_BY_KEY[key]) return formatClinicalValue(value, UNIT_BY_KEY[key]);
  if (ENUM_KEYS.has(key)) return formatEnum(value);
  return formatClinicalValue(value);
};

const shouldPrintKey = (key, value) =>
  hasValue(value) &&
  !TECHNICAL_ID_KEYS.has(key) &&
  !UI_ONLY_KEYS.has(key) &&
  !UI_STATUS_KEYS.has(key) &&
  !RELATION_KEYS.has(key);

const orderedKeys = (record, preferredOrder = []) => {
  const keys = Object.keys(safeRecord(record)).filter((key) =>
    shouldPrintKey(key, record[key])
  );
  return [
    ...preferredOrder.filter((key) => keys.includes(key)),
    ...CAPTURE_META_ORDER.filter(
      (key) => keys.includes(key) && !preferredOrder.includes(key)
    ),
    ...keys
      .filter(
        (key) =>
          !preferredOrder.includes(key) && !CAPTURE_META_ORDER.includes(key)
      )
      .sort((left, right) => labelForKey(left).localeCompare(labelForKey(right))),
  ];
};

const buildRecordFields = (record, preferredOrder = []) =>
  orderedKeys(record, preferredOrder)
    .map((key) => field(labelForKey(key), formatRawValue(key, record[key])))
    .filter(Boolean);

const mergeRecords = (...records) =>
  records.reduce(
    (acc, record) => ({
      ...acc,
      ...Object.fromEntries(
        Object.entries(safeRecord(record)).filter(([, value]) => hasValue(value))
      ),
    }),
    {}
  );

const recordKey = (record = {}, fallback = '') =>
  record.id || record.clientRecordId ||
  ([
    getRecordTimestamp(record),
    record.version,
    record.mode,
    record.source,
  ]
    .filter(Boolean)
    .join('|') ||
    fallback);

const mergeRecordArrays = (...sources) => {
  const recordsByKey = new Map();

  sources.flatMap(toRecordArray).forEach((record, index) => {
    if (!record || typeof record !== 'object') return;
    const key = recordKey(record, `record-${index}`);
    recordsByKey.set(key, mergeRecords(recordsByKey.get(key), record));
  });

  return [...recordsByKey.values()];
};

const timelineRecordsByEntity = (timeline = [], entityType) =>
  toArray(timeline)
    .filter((entry) => entry?.entityType === entityType && entry.record)
    .map((entry) => ({
      ...entry.record,
      version: entry.record.version ?? entry.version,
      createdAt: entry.record.createdAt || entry.occurredAt,
    }));

const buildBloodPressure = (record = {}) => {
  const item = safeRecord(record);
  if (!hasValue(item.systolicBp) && !hasValue(item.diastolicBp)) return null;
  return {
    label: 'Blood pressure',
    value: `${item.systolicBp ?? '-'} / ${item.diastolicBp ?? '-'} mmHg`,
  };
};

const buildClinicalSnapshotFields = (record = {}) => {
  const item = safeRecord(record);
  return compactFields([
    dateField('Recorded', getDateValue(item, 'measuredAt', 'createdAt')),
    field('Oxygen support', item.oxygenSupportType),
    percentField('SpO2', item.spo2),
    percentField('FiO2', item.fio2),
    field('Respiratory rate', item.respiratoryRate, '/min'),
    field('Heart rate', item.heartRate, '/min'),
    buildBloodPressure(item),
    field('Mean arterial pressure', item.meanArterialPressure, 'mmHg'),
    field('Temperature', item.temperatureC, 'C'),
    field('GCS', item.gcs),
    field('AVPU', item.avpu),
    field('RASS', item.rass),
    field('Main condition', item.mainCondition),
    field('Comorbidities', item.comorbiditiesJson),
    field('Source', item.source),
  ]);
};

const buildAbgFields = (record = {}) => {
  const item = safeRecord(record);
  return compactFields([
    dateField('Collected', getDateValue(item, 'collectedAt', 'createdAt')),
    field('Version', item.version),
    field('pH', item.ph),
    field('PaO2', item.pao2, 'mmHg'),
    field('PaCO2', item.paco2, 'mmHg'),
    field('HCO3', item.hco3, 'mmol/L'),
    field('Base excess', item.baseExcess, 'mmol/L'),
    field('Lactate', item.lactate, 'mmol/L'),
    percentField('FiO2 at sample', item.fio2AtSample),
    percentField('SpO2 at sample', item.spo2AtSample),
    field('Source', item.source),
  ]);
};

const buildVentilatorFields = (record = {}) => {
  const item = safeRecord(record);
  return compactFields([
    dateField('Recorded', getDateValue(item, 'measuredAt', 'createdAt')),
    field('Version', item.version),
    field('Mode', item.mode),
    field('Tidal volume', item.tidalVolumeMl, 'mL'),
    field('Set respiratory rate', item.respiratoryRateSet, '/min'),
    field('Measured respiratory rate', item.respiratoryRateMeasured, '/min'),
    percentField('FiO2', item.fio2),
    field('PEEP', item.peep, 'cmH2O'),
    field('Pressure support', item.pressureSupport, 'cmH2O'),
    field('Inspiratory pressure', item.inspiratoryPressure, 'cmH2O'),
    field('Peak pressure', item.peakPressure, 'cmH2O'),
    field('Plateau pressure', item.plateauPressure, 'cmH2O'),
    field('I:E ratio', item.ieRatio),
    field('Minute volume', item.minuteVolumeLMin, 'L/min'),
    field('VT/reference weight', item.vtMlPerKgReferenceWeight, 'mL/kg'),
    field('Driving pressure', item.drivingPressure, 'cmH2O'),
    field('Source', item.source),
  ]);
};

const buildAirwayFields = (record = {}) => {
  const item = safeRecord(record);
  return compactFields([
    dateField('Recorded', getDateValue(item, 'measuredAt', 'createdAt')),
    field('Airway route', item.airwayRoute),
    field('Tube type', item.tubeType),
    field('Internal diameter', item.internalDiameterMm, 'mm'),
    field('Depth', item.depthCm, 'cm'),
    field('Cuff pressure', item.cuffPressureCmH2O, 'cmH2O'),
    field('Tube secured', item.tubeSecured),
    field('Notes', item.notes),
  ]);
};

const buildHumidificationFields = (record = {}) => {
  const item = safeRecord(record);
  return compactFields([
    dateField('Recorded', getDateValue(item, 'measuredAt', 'createdAt')),
    field('Method', item.method),
    field('Suggested option', item.suggestedOption),
    field('Confirmed option', item.confirmedOption),
    field('Thick secretions', item.thickSecretions),
    field('High minute ventilation', item.highMinuteVentilation),
    field('Hypothermia', item.hypothermia),
    field('Airway bleeding', item.airwayBleeding),
    field('Expected long ventilation', item.expectedLongVentilation),
  ]);
};

const buildDailyReviewFields = (record = {}) => {
  const item = safeRecord(record);
  return compactFields([
    dateField('Review date', getDateValue(item, 'reviewDate', 'createdAt')),
    field('Oxygenation stable', item.oxygenationStable),
    field('Hemodynamics stable', item.hemodynamicsStable),
    field('Sedation light enough', item.sedationLightEnough),
    field('Secretions manageable', item.secretionsManageable),
    field('SBT status', item.sbtStatus),
    field('SBT failure reason', item.sbtFailureReason),
    field('Prone status', item.proneStatus),
    field('VAP bundle', item.vapBundleJson),
  ]);
};

const buildOutcomeFields = (record = {}) => {
  const item = safeRecord(record);
  return compactFields([
    enumField('Outcome', item.outcomeType),
    dateField('Outcome date', getDateValue(item, 'outcomeDate', 'createdAt')),
    field('Ventilator days', item.ventilatorDays, 'days'),
    field('ICU length of stay', item.icuLengthOfStayDays, 'days'),
    field('Hospital length of stay', item.hospitalLengthOfStayDays, 'days'),
    field('Reintubation within 48h', item.reintubationWithin48h),
    field('Tracheostomy', item.tracheostomy),
    field('VAP suspected', item.vapSuspected),
    field('Notes', item.notes),
  ]);
};

const getRecordTimestamp = (record = {}) =>
  getDateValue(
    record,
    'measuredAt',
    'collectedAt',
    'reviewDate',
    'outcomeDate',
    'admittedAt',
    'clientCreatedAt',
    'createdAt'
  );

const buildRecordTitle = (label, record = {}, index) => {
  const pieces = [`${label} ${index + 1}`];
  const timestamp = formatDate(getRecordTimestamp(record));
  if (timestamp) pieces.push(timestamp);
  if (hasValue(record.version)) pieces.push(`Version ${record.version}`);
  if (hasValue(record.source)) pieces.push(`Source: ${record.source}`);
  return pieces.join(' | ');
};

const buildCapturedRecordSection = ({
  id,
  title,
  itemLabel,
  records,
  preferredOrder,
}) => {
  const items = sortByDateDesc(
    records,
    'measuredAt',
    'collectedAt',
    'reviewDate',
    'outcomeDate',
    'admittedAt',
    'createdAt'
  )
    .map((record, index) => ({
      id: `${id}-${index}`,
      title: buildRecordTitle(itemLabel, record, index),
      fields: buildRecordFields(record, preferredOrder),
    }))
    .filter((item) => item.fields.length > 0);

  return items.length > 0 ? { id, title, items } : null;
};

const buildCaptureSections = ({
  clinicalSnapshots,
  abgTests,
  ventilatorSettings,
  airwayDevices,
  humidificationDecisions,
  dailyReviews,
  outcomes,
}) =>
  compactFields([
    buildCapturedRecordSection({
      id: 'clinical-observations',
      title: 'Clinical observations captured',
      itemLabel: 'Observation',
      records: clinicalSnapshots,
      preferredOrder: [
        'measuredAt',
        'oxygenSupportType',
        'spo2',
        'fio2',
        'respiratoryRate',
        'heartRate',
        'systolicBp',
        'diastolicBp',
        'meanArterialPressure',
        'temperatureC',
        'gcs',
        'avpu',
        'rass',
        'mainCondition',
        'comorbiditiesJson',
      ],
    }),
    buildCapturedRecordSection({
      id: 'abg-tests',
      title: 'ABG tests captured',
      itemLabel: 'ABG test',
      records: abgTests,
      preferredOrder: [
        'version',
        'collectedAt',
        'ph',
        'pao2',
        'paco2',
        'hco3',
        'baseExcess',
        'lactate',
        'fio2AtSample',
        'spo2AtSample',
        'clinicalFlagsJson',
        'calculationSummaryJson',
      ],
    }),
    buildCapturedRecordSection({
      id: 'ventilator-settings',
      title: 'Ventilator settings captured',
      itemLabel: 'Ventilator setting',
      records: ventilatorSettings,
      preferredOrder: [
        'version',
        'measuredAt',
        'mode',
        'tidalVolumeMl',
        'respiratoryRateSet',
        'respiratoryRateMeasured',
        'fio2',
        'peep',
        'pressureSupport',
        'inspiratoryPressure',
        'peakPressure',
        'plateauPressure',
        'ieRatio',
        'minuteVolumeLMin',
        'vtMlPerKgReferenceWeight',
        'drivingPressure',
        'clinicalFlagsJson',
        'calculationSummaryJson',
      ],
    }),
    buildCapturedRecordSection({
      id: 'airway-devices',
      title: 'Airway device records captured',
      itemLabel: 'Airway record',
      records: airwayDevices,
      preferredOrder: [
        'measuredAt',
        'airwayRoute',
        'tubeType',
        'internalDiameterMm',
        'depthCm',
        'cuffPressureCmH2O',
        'tubeSecured',
        'notes',
        'clinicalFlagsJson',
      ],
    }),
    buildCapturedRecordSection({
      id: 'humidification-decisions',
      title: 'Humidification decisions captured',
      itemLabel: 'Humidification decision',
      records: humidificationDecisions,
      preferredOrder: [
        'measuredAt',
        'method',
        'thickSecretions',
        'highMinuteVentilation',
        'hypothermia',
        'airwayBleeding',
        'expectedLongVentilation',
        'suggestedOption',
        'confirmedOption',
        'clinicalFlagsJson',
      ],
    }),
    buildCapturedRecordSection({
      id: 'daily-reviews',
      title: 'Daily ventilation reviews captured',
      itemLabel: 'Daily review',
      records: dailyReviews,
      preferredOrder: [
        'reviewDate',
        'oxygenationStable',
        'hemodynamicsStable',
        'sedationLightEnough',
        'secretionsManageable',
        'sbtStatus',
        'sbtFailureReason',
        'proneStatus',
        'vapBundleJson',
        'clinicalFlagsJson',
      ],
    }),
    buildCapturedRecordSection({
      id: 'outcomes',
      title: 'Outcome and progress records captured',
      itemLabel: 'Outcome record',
      records: outcomes,
      preferredOrder: [
        'outcomeType',
        'outcomeDate',
        'ventilatorDays',
        'icuLengthOfStayDays',
        'hospitalLengthOfStayDays',
        'reintubationWithin48h',
        'tracheostomy',
        'vapSuspected',
        'notes',
      ],
    }),
  ]);

const buildCalculatedProgressFields = (currentStatus = {}) => {
  const summary = currentStatus.clinicalSummary || {};
  return compactFields([
    field('Reference weight', summary.referenceWeight?.value, 'kg'),
    field('VT/reference weight', summary.vtPerKg?.value, 'mL/kg'),
    field('Minute ventilation', summary.minuteVentilation?.value, 'L/min'),
    field('Driving pressure', summary.drivingPressure?.value, 'cmH2O'),
    field('P/F ratio', summary.pfRatio?.value),
    field('S/F ratio', summary.sfRatio?.value),
    field('Oxygen caution', summary.oxygenCaution?.message),
  ]);
};

const buildTimelineItems = (timeline = []) =>
  sortByDateDesc(timeline, 'occurredAt').map((entry, index) => ({
    id: `timeline-${index}`,
    title:
      EVENT_LABELS[entry.eventType] ||
      EVENT_LABELS[entry.entityType] ||
      titleCaseToken(entry.eventType || entry.entityType),
    occurredAt: formatDate(entry.occurredAt),
    fields: compactFields([
      field('Entity type', titleCaseToken(entry.entityType)),
      field('Event type', titleCaseToken(entry.eventType)),
      field('Version', entry.version),
      ...buildRecordFields(entry.record),
    ]),
  }));

const buildTrackingPrintDocument = ({ tracking, t, generatedAt = new Date() } = {}) => {
  const translate = typeof t === 'function' ? t : (key) => key;
  const row = tracking?.row;
  const admission = tracking?.admission || row?.raw || {};
  const currentStatus =
    tracking?.currentStatus || admission.currentStatus || row?.currentStatus || {};
  const latest = currentStatus.latest || {};
  const timeline = toArray(tracking?.timeline);
  const clinicalSnapshots = mergeRecordArrays(
    admission.clinicalSnapshots,
    latest.clinicalSnapshot,
    timelineRecordsByEntity(timeline, 'ClinicalSnapshot')
  );
  const abgTests = mergeRecordArrays(
    admission.abgTests,
    latest.abgTest,
    timelineRecordsByEntity(timeline, 'AbgTest')
  );
  const ventilatorSettings = mergeRecordArrays(
    admission.ventilatorSettings,
    latest.ventilatorSetting,
    currentStatus.ventilatorSetting,
    timelineRecordsByEntity(timeline, 'VentilatorSetting')
  );
  const airwayDevices = mergeRecordArrays(
    admission.airwayDevices,
    latest.airwayDevice,
    timelineRecordsByEntity(timeline, 'AirwayDevice')
  );
  const humidificationDecisions = mergeRecordArrays(
    admission.humidificationDecisions,
    latest.humidification,
    timelineRecordsByEntity(timeline, 'HumidificationDecision')
  );
  const dailyReviews = mergeRecordArrays(
    admission.dailyReviews,
    latest.dailyReview,
    timelineRecordsByEntity(timeline, 'DailyVentilationReview')
  );
  const outcomes = mergeRecordArrays(
    admission.outcomes,
    latest.outcome,
    timelineRecordsByEntity(timeline, 'Outcome')
  );
  const admissionSnapshot = firstByDate(clinicalSnapshots, 'measuredAt', 'createdAt');
  const admissionAbg = firstByDate(abgTests, 'collectedAt', 'createdAt');
  const admissionVentilator = firstByDate(ventilatorSettings, 'measuredAt', 'createdAt');
  const currentSnapshot = latestByDate(clinicalSnapshots, 'measuredAt', 'createdAt');
  const currentAbg = latestByDate(abgTests, 'collectedAt', 'createdAt');
  const currentVentilator = latestByDate(ventilatorSettings, 'measuredAt', 'createdAt');
  const latestAirway = latestByDate(airwayDevices, 'measuredAt', 'createdAt');
  const latestHumidification = latestByDate(humidificationDecisions, 'measuredAt', 'createdAt');
  const patientRecord = mergeRecords(currentStatus.patient, admission.patient, {
    appPatientCode: row?.appPatientCode || row?.patientCode,
    hospitalNumber: row?.hospitalNumber,
    optionalName: row?.optionalName,
  });
  const admissionRecord = mergeRecords(admission, {
    appAdmissionCode: admission.appAdmissionCode || row?.appAdmissionCode,
    facilityName: admission.facility?.name || row?.facilityName,
    bedNumber: admission.bedNumber || row?.bedNumber,
    status: admission.status || row?.admissionStatus,
    admittedAt: admission.admittedAt || row?.admittedAt,
    admissionSource: admission.admissionSource || row?.admissionSource,
    reasonForVentilation:
      admission.reasonForVentilation || row?.reasonForVentilation,
  });
  const patientRows = buildRecordFields(patientRecord, PATIENT_FIELD_ORDER);
  const admissionRows = buildRecordFields(admissionRecord, ADMISSION_FIELD_ORDER);
  const calculatedProgressFields = buildCalculatedProgressFields(currentStatus);
  const captureSections = buildCaptureSections({
    clinicalSnapshots,
    abgTests,
    ventilatorSettings,
    airwayDevices,
    humidificationDecisions,
    dailyReviews,
    outcomes,
  });

  const sectionGroups = [
    {
      id: 'admission-details',
      title: 'Admission details',
      groups: [
        {
          title: 'Admission record',
          fields: admissionRows,
        },
        {
          title: 'Initial clinical observations',
          fields: buildClinicalSnapshotFields(admissionSnapshot),
        },
        { title: 'Initial ABG', fields: buildAbgFields(admissionAbg) },
        { title: 'Initial ventilation', fields: buildVentilatorFields(admissionVentilator) },
      ],
    },
    {
      id: 'current-values',
      title: 'Current values',
      groups: [
        {
          title: 'Latest clinical observations',
          fields: buildClinicalSnapshotFields(currentSnapshot),
        },
        { title: 'Latest ABG', fields: buildAbgFields(currentAbg) },
        { title: 'Latest ventilation', fields: buildVentilatorFields(currentVentilator) },
        { title: 'Airway', fields: buildAirwayFields(latestAirway) },
        { title: 'Humidification', fields: buildHumidificationFields(latestHumidification) },
      ],
    },
    {
      id: 'clinical-summary',
      title: 'Calculated progress values',
      groups: [
        {
          title: 'Current calculated values',
          fields: calculatedProgressFields,
        },
        {
          title: 'Latest daily review',
          fields: buildDailyReviewFields(
            latestByDate(dailyReviews, 'reviewDate', 'createdAt')
          ),
        },
        {
          title: 'Latest outcome or disposition',
          fields: buildOutcomeFields(
            latestByDate(outcomes, 'outcomeDate', 'createdAt')
          ),
        },
      ],
    },
  ]
    .map((section) => ({
      ...section,
      groups: section.groups.filter((group) => group.fields.length > 0),
    }))
    .filter((section) => section.groups.length > 0);

  return {
    title: translate('ventilation.tracking.print.title'),
    generatedAtLabel: translate('ventilation.tracking.print.generatedAt', {
      dateTime: formatDateTime(generatedAt),
    }),
    patientLabel: row ? getPatientLabel(row, translate) : '',
    bedLabel: row?.bedNumber
      ? translate('ventilation.tracking.patient.bed', { bed: row.bedNumber })
      : translate('ventilation.tracking.patient.bedMissing'),
    facilityName: row?.facilityName || admission.facility?.name || '',
    patientRows,
    sectionGroups,
    captureSections,
    timeline: buildTimelineItems(timeline),
  };
};

export { buildTrackingPrintDocument };
