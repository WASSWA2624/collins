/**
 * Current patient readings update model
 * Append-only payload builders and summary helpers.
 */
import { z } from 'zod';

const VITAL_SIGN_NUMERIC_FIELDS = Object.freeze([
  'spo2',
  'heartRate',
  'respiratoryRate',
  'systolicBp',
  'diastolicBp',
  'meanArterialPressure',
  'temperatureC',
]);

const ABG_NUMERIC_FIELDS = Object.freeze([
  'ph',
  'pao2',
  'paco2',
  'hco3',
  'baseExcess',
  'lactate',
  'fio2AtSample',
  'spo2AtSample',
]);

const VENTILATOR_NUMERIC_FIELDS = Object.freeze([
  'tidalVolumeMl',
  'respiratoryRateSet',
  'respiratoryRateMeasured',
  'fio2',
  'peep',
  'pressureSupport',
  'inspiratoryPressure',
  'peakPressure',
  'plateauPressure',
]);

const VENTILATOR_MODE_OPTIONS = Object.freeze([
  { label: 'Assist-control volume control (AC/VC)', value: 'AC/VC' },
  { label: 'Assist-control pressure control (AC/PC)', value: 'AC/PC' },
  { label: 'Volume control ventilation (VCV)', value: 'VCV' },
  { label: 'Pressure control ventilation (PCV)', value: 'PCV' },
  { label: 'Pressure-regulated volume control (PRVC)', value: 'PRVC' },
  {
    label: 'Synchronized intermittent mandatory ventilation (SIMV)',
    value: 'SIMV',
  },
  { label: 'Pressure support ventilation (PSV)', value: 'PSV' },
  { label: 'Continuous positive airway pressure (CPAP)', value: 'CPAP' },
  { label: 'BiPAP / NIV', value: 'BiPAP/NIV' },
  { label: 'Airway pressure release ventilation (APRV)', value: 'APRV' },
  { label: 'High-frequency oscillatory ventilation (HFOV)', value: 'HFOV' },
  { label: 'High-flow nasal cannula (HFNC)', value: 'HFNC' },
  { label: 'Other / not listed', value: 'OTHER' },
]);

const VITAL_SIGN_FIELD_DEFINITIONS = Object.freeze([
  { key: 'spo2', label: 'SpO2', min: 40, max: 100, unit: '%' },
  {
    key: 'heartRate',
    label: 'Heart rate',
    min: 0,
    max: 250,
    unit: 'beats/min',
  },
  {
    key: 'respiratoryRate',
    label: 'Respiratory rate',
    min: 0,
    max: 180,
    unit: 'breaths/min',
  },
  {
    key: 'systolicBp',
    label: 'Systolic BP',
    min: 0,
    max: 300,
    unit: 'mmHg',
  },
  {
    key: 'diastolicBp',
    label: 'Diastolic BP',
    min: 0,
    max: 200,
    unit: 'mmHg',
  },
  {
    key: 'meanArterialPressure',
    label: 'Mean arterial pressure',
    min: 0,
    max: 250,
    unit: 'mmHg',
  },
  {
    key: 'temperatureC',
    label: 'Temperature',
    min: 20,
    max: 45,
    unit: 'C',
  },
]);

const ABG_FIELD_DEFINITIONS = Object.freeze([
  { key: 'ph', label: 'pH', min: 6.8, max: 7.8 },
  { key: 'pao2', label: 'PaO2', min: 20, max: 600, unit: 'mmHg' },
  { key: 'paco2', label: 'PaCO2', min: 10, max: 150, unit: 'mmHg' },
  { key: 'hco3', label: 'HCO3', min: 0, max: 80, unit: 'mmol/L' },
  {
    key: 'baseExcess',
    label: 'Base excess',
    min: -40,
    max: 40,
    unit: 'mmol/L',
  },
  { key: 'lactate', label: 'Lactate', min: 0, max: 40, unit: 'mmol/L' },
  {
    key: 'fio2AtSample',
    label: 'FiO2 at sample',
    min: 0.01,
    max: 1,
    unit: 'fraction 0-1',
  },
  {
    key: 'spo2AtSample',
    label: 'SpO2 at sample',
    min: 40,
    max: 100,
    unit: '%',
  },
]);

const VENTILATOR_FIELD_DEFINITIONS = Object.freeze([
  { key: 'mode', label: 'Mode' },
  {
    key: 'tidalVolumeMl',
    label: 'Tidal volume',
    min: 1,
    max: 3000,
    unit: 'mL',
  },
  {
    key: 'respiratoryRateSet',
    label: 'Set respiratory rate',
    min: 0,
    max: 120,
    unit: 'breaths/min',
  },
  {
    key: 'respiratoryRateMeasured',
    label: 'Measured respiratory rate',
    min: 0,
    max: 180,
    unit: 'breaths/min',
  },
  { key: 'fio2', label: 'FiO2', min: 0.01, max: 1, unit: 'fraction 0-1' },
  { key: 'peep', label: 'PEEP', min: 0, max: 30, unit: 'cmH2O' },
  {
    key: 'pressureSupport',
    label: 'Pressure support',
    min: 0,
    max: 80,
    unit: 'cmH2O',
  },
  {
    key: 'inspiratoryPressure',
    label: 'Inspiratory pressure',
    min: 0,
    max: 100,
    unit: 'cmH2O',
  },
  {
    key: 'peakPressure',
    label: 'Peak pressure',
    min: 0,
    max: 100,
    unit: 'cmH2O',
  },
  {
    key: 'plateauPressure',
    label: 'Plateau pressure',
    min: 0,
    max: 60,
    unit: 'cmH2O',
  },
  { key: 'ieRatio', label: 'I:E ratio' },
]);

const FIELD_DEFINITION_BY_KEY = Object.freeze(
  [
    ...VITAL_SIGN_FIELD_DEFINITIONS,
    ...ABG_FIELD_DEFINITIONS,
    ...VENTILATOR_FIELD_DEFINITIONS,
  ].reduce(
    (map, field) => {
      map[field.key] = field;
      return map;
    },
    {}
  )
);

const MISSING_DATA_FIELD_LABELS = Object.freeze({
  FiO2: 'FiO2',
  PaO2: 'PaO2',
  SpO2: 'SpO2',
  heartRate: 'heart rate',
  respiratoryRate: 'respiratory rate',
  tidalVolumeMl: 'tidal volume',
  PEEP: 'PEEP',
  'actualWeightKg/referenceWeightKg': 'weight or reference weight',
  patientPathway: 'patient pathway',
});

const FORBIDDEN_EXACT_SETTING_ORDER =
  /\b(set|increase|decrease|reduce)\s+(peep|fio2|tidal volume|rate)\s+(to|by)\b/i;

const emptyToUndefined = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

const isBlankValue = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim() === '');

const NUMERIC_INPUT_PATTERN = /^[-+]?(?:\d+\.?\d*|\.\d+)$/;
const IE_RATIO_PATTERN = /^\d+(?:\.\d+)?\s*:\s*\d+(?:\.\d+)?$/;

const formatRange = (field) => {
  const unit = field.unit ? ` ${field.unit}` : '';
  if (field.min !== undefined && field.max !== undefined) {
    return `${field.min} to ${field.max}${unit}`;
  }
  if (field.min !== undefined) return `at least ${field.min}${unit}`;
  if (field.max !== undefined) return `no more than ${field.max}${unit}`;
  return '';
};

const validateNumericValue = (field, value) => {
  if (isBlankValue(value)) return null;
  const text = String(value).trim();
  if (!NUMERIC_INPUT_PATTERN.test(text)) {
    return `${field.label} must be a valid number.`;
  }

  const numberValue = Number(text);
  if (!Number.isFinite(numberValue)) {
    return `${field.label} must be a valid number.`;
  }
  if (field.min !== undefined && numberValue < field.min) {
    return `${field.label} must be between ${formatRange(field)}.`;
  }
  if (field.max !== undefined && numberValue > field.max) {
    return `${field.label} must be between ${formatRange(field)}.`;
  }
  return null;
};

const validateTextValue = (field, value) => {
  if (isBlankValue(value)) return null;
  const text = String(value).trim();
  if (field.key === 'ieRatio' && !IE_RATIO_PATTERN.test(text)) {
    return 'I:E ratio must use a ratio such as 1:2.';
  }
  if (text.length > 40 && field.key === 'ieRatio') {
    return 'I:E ratio must be 40 characters or fewer.';
  }
  if (text.length > 80 && field.key === 'mode') {
    return 'Ventilator mode must be 80 characters or fewer.';
  }
  return null;
};

const validateFieldSet = (fields, values = {}) =>
  fields.reduce((errors, field) => {
    const message =
      field.min !== undefined || field.max !== undefined
        ? validateNumericValue(field, values[field.key])
        : validateTextValue(field, values[field.key]);
    if (message) errors[field.key] = message;
    return errors;
  }, {});

const sanitizeNumericInput = (value, { allowNegative = false } = {}) => {
  const text = String(value ?? '').replace(',', '.');
  let next = '';
  let hasDot = false;

  for (const char of text) {
    if (/\d/.test(char)) {
      next += char;
      continue;
    }
    if (char === '.' && !hasDot) {
      next += char;
      hasDot = true;
      continue;
    }
    if (char === '-' && allowNegative && next.length === 0) {
      next += char;
    }
  }

  return next;
};

const sanitizeCurrentReadingsFieldInput = (fieldKey, value) => {
  const field = FIELD_DEFINITION_BY_KEY[fieldKey];
  if (!field || (field.min === undefined && field.max === undefined))
    return value;
  return sanitizeNumericInput(value, { allowNegative: Number(field.min) < 0 });
};

const validateCurrentReadingsForm = ({
  admissionId,
  admission,
  vitals,
  abg,
  ventilator,
} = {}) => {
  const fieldErrors = {
    vitals: validateFieldSet(VITAL_SIGN_FIELD_DEFINITIONS, vitals),
    abg: validateFieldSet(ABG_FIELD_DEFINITIONS, abg),
    ventilator: validateFieldSet(VENTILATOR_FIELD_DEFINITIONS, ventilator),
  };
  const formErrors = [];

  if (!admissionId || !admission?.id || admission.id !== admissionId) {
    formErrors.push(
      "Unable to load this patient's update form. Please return to the patient list and try again."
    );
  } else if (admission.status && admission.status !== 'ACTIVE') {
    formErrors.push(
      'This patient is not currently listed as actively admitted. Please return to the patient list and try again.'
    );
  }

  if (
    !hasAnyField(stripUndefined(vitals || {}), VITAL_SIGN_NUMERIC_FIELDS) &&
    !hasAnyField(stripUndefined(abg || {}), ABG_NUMERIC_FIELDS) &&
    !hasAnyField(stripUndefined(ventilator || {}), [
      ...VENTILATOR_NUMERIC_FIELDS,
      'mode',
      'ieRatio',
    ])
  ) {
    formErrors.push(
      'Enter at least one current vital sign, ABG reading, or ventilator setting before saving.'
    );
  }

  return {
    isValid:
      formErrors.length === 0 &&
      Object.keys(fieldErrors.vitals).length === 0 &&
      Object.keys(fieldErrors.abg).length === 0 &&
      Object.keys(fieldErrors.ventilator).length === 0,
    fieldErrors,
    formErrors,
  };
};

const hasAnyInputValue = (value) =>
  Object.values(value || {}).some((entry) => !isBlankValue(entry));

const validateNumericFieldValue = validateNumericValue;

const validateCurrentReadingsDraft = ({
  admissionId,
  admission,
  vitals,
  abg,
  ventilator,
} = {}) => {
  const validation = validateCurrentReadingsForm({
    admissionId,
    admission,
    vitals,
    abg,
    ventilator,
  });
  const hasValues =
    hasAnyInputValue(vitals) ||
    hasAnyInputValue(abg) ||
    hasAnyInputValue(ventilator);

  return {
    ...validation,
    hasValues,
  };
};

const optionalText = (max = 120) =>
  z.preprocess(emptyToUndefined, z.string().trim().min(1).max(max).optional());

const optionalNumber = (min, max) =>
  z.preprocess(
    emptyToUndefined,
    z.coerce.number().min(min).max(max).optional()
  );

const optionalIsoDate = z
  .preprocess(
    emptyToUndefined,
    z.union([z.string().trim().min(1), z.date()]).optional()
  )
  .transform((value) => {
    if (!value) return undefined;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return date.toISOString();
  });

const clinicalSnapshotUpdateSchema = z
  .object({
    measuredAt: optionalIsoDate,
    spo2: optionalNumber(40, 100),
    heartRate: optionalNumber(0, 250),
    respiratoryRate: optionalNumber(0, 180),
    systolicBp: optionalNumber(0, 300),
    diastolicBp: optionalNumber(0, 200),
    meanArterialPressure: optionalNumber(0, 250),
    temperatureC: optionalNumber(20, 45),
    source: optionalText(80),
    deviceId: optionalText(120),
  })
  .strict();

const abgUpdateSchema = z
  .object({
    collectedAt: optionalIsoDate,
    ph: optionalNumber(6.8, 7.8),
    pao2: optionalNumber(20, 600),
    paco2: optionalNumber(10, 150),
    hco3: optionalNumber(0, 80),
    baseExcess: optionalNumber(-40, 40),
    lactate: optionalNumber(0, 40),
    fio2AtSample: optionalNumber(0.01, 1),
    spo2AtSample: optionalNumber(40, 100),
    source: optionalText(80),
    deviceId: optionalText(120),
  })
  .strict();

const ventilatorUpdateSchema = z
  .object({
    measuredAt: optionalIsoDate,
    mode: optionalText(80),
    tidalVolumeMl: optionalNumber(1, 3000),
    respiratoryRateSet: optionalNumber(0, 120),
    respiratoryRateMeasured: optionalNumber(0, 180),
    fio2: optionalNumber(0.01, 1),
    peep: optionalNumber(0, 30),
    pressureSupport: optionalNumber(0, 80),
    inspiratoryPressure: optionalNumber(0, 100),
    peakPressure: optionalNumber(0, 100),
    plateauPressure: optionalNumber(0, 60),
    ieRatio: optionalText(40),
    source: optionalText(80),
    deviceId: optionalText(120),
  })
  .strict();

const stripUndefined = (value) => {
  if (Array.isArray(value))
    return value.map(stripUndefined).filter((entry) => entry !== undefined);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const next = Object.fromEntries(
      Object.entries(value)
        .map(([key, entryValue]) => [key, stripUndefined(entryValue)])
        .filter(([, entryValue]) => entryValue !== undefined)
    );
    return Object.keys(next).length > 0 ? next : undefined;
  }
  return value === undefined ? undefined : value;
};

const hasAnyField = (record, fields) =>
  Boolean(
    record &&
    fields.some(
      (field) => record[field] !== undefined && record[field] !== null
    )
  );

const createScopedToken = (prefix, admissionId, now) => {
  const timestamp = now instanceof Date ? now.getTime() : Date.now();
  const scope =
    String(admissionId || 'admission')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 32) || 'admission';
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${scope}-${timestamp.toString(36)}-${randomPart}`;
};

const resolveNow = (now) => {
  const date = now instanceof Date ? now : new Date(now || Date.now());
  if (Number.isNaN(date.getTime())) return new Date();
  return date;
};

const parseRecord = (schema, record) => {
  const parsed = schema.parse(stripUndefined(record || {}) || {});
  return stripUndefined(parsed) || {};
};

const buildCurrentReadingsPayload = ({
  admissionId,
  vitals,
  abg,
  ventilator,
  clientRecordId,
  idempotencyKey,
  source = 'current_readings',
  now = new Date(),
} = {}) => {
  if (!admissionId || typeof admissionId !== 'string') {
    throw new Error('CURRENT_READINGS_ADMISSION_REQUIRED');
  }

  const resolvedNow = resolveNow(now);
  const timestamp = resolvedNow.toISOString();
  const resolvedClientRecordId =
    clientRecordId || createScopedToken('current-readings', admissionId, resolvedNow);
  const resolvedIdempotencyKey =
    idempotencyKey ||
    createScopedToken('current-readings-idem', admissionId, resolvedNow);
  const parsedVitals = parseRecord(clinicalSnapshotUpdateSchema, vitals);
  const parsedAbg = parseRecord(abgUpdateSchema, abg);
  const parsedVentilator = parseRecord(ventilatorUpdateSchema, ventilator);

  const hasVitals = hasAnyField(parsedVitals, VITAL_SIGN_NUMERIC_FIELDS);
  const hasAbg = hasAnyField(parsedAbg, ABG_NUMERIC_FIELDS);
  const hasVentilator = hasAnyField(parsedVentilator, [
    ...VENTILATOR_NUMERIC_FIELDS,
    'mode',
    'ieRatio',
  ]);

  if (!hasVitals && !hasAbg && !hasVentilator) {
    throw new Error('CURRENT_READINGS_EMPTY');
  }

  return stripUndefined({
    clinicalSnapshot: hasVitals
      ? {
          ...parsedVitals,
          source: parsedVitals.source || source,
        }
      : undefined,
    abgTest: hasAbg
      ? {
          ...parsedAbg,
          source: parsedAbg.source || source,
        }
      : undefined,
    ventilatorSetting: hasVentilator
      ? {
          ...parsedVentilator,
          source: parsedVentilator.source || source,
        }
      : undefined,
    clientRecordId: resolvedClientRecordId,
    clientCreatedAt: timestamp,
    clientUpdatedAt: timestamp,
    idempotencyKey: resolvedIdempotencyKey,
  });
};

const safeBuildCurrentReadingsPayload = (input) => {
  try {
    return { ok: true, payload: buildCurrentReadingsPayload(input), error: null };
  } catch (error) {
    return { ok: false, payload: null, error };
  }
};

const asTime = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
};

const sortRecordsDesc = (records, timestampField) =>
  [...(Array.isArray(records) ? records : [])].sort((a, b) => {
    const versionDelta = Number(b?.version || 0) - Number(a?.version || 0);
    if (versionDelta !== 0) return versionDelta;
    return (
      asTime(b?.[timestampField] || b?.createdAt) -
      asTime(a?.[timestampField] || a?.createdAt)
    );
  });

const getLatestCurrentReadingsValues = (admission = {}) => {
  const latestVitals =
    sortRecordsDesc(admission.clinicalSnapshots, 'measuredAt')[0] || null;
  const latestAbg =
    sortRecordsDesc(admission.abgTests, 'collectedAt')[0] || null;
  const latestVentilator =
    sortRecordsDesc(admission.ventilatorSettings, 'measuredAt')[0] || null;
  return { latestVitals, latestAbg, latestVentilator };
};

const getCurrentReadingsHistory = (admission = {}) => {
  const vitalEvents = (
    Array.isArray(admission.clinicalSnapshots) ? admission.clinicalSnapshots : []
  ).map((record) => ({
    id: record.id || record.clientRecordId,
    type: 'vitals',
    recordedAt: record.measuredAt || record.createdAt,
    record,
  }));
  const abgEvents = (
    Array.isArray(admission.abgTests) ? admission.abgTests : []
  ).map((record) => ({
    id: record.id || record.clientRecordId,
    type: 'abg',
    version: record.version,
    recordedAt: record.collectedAt || record.createdAt,
    record,
  }));
  const ventilatorEvents = (
    Array.isArray(admission.ventilatorSettings)
      ? admission.ventilatorSettings
      : []
  ).map((record) => ({
    id: record.id || record.clientRecordId,
    type: 'ventilator',
    version: record.version,
    recordedAt: record.measuredAt || record.createdAt,
    record,
  }));
  return [...vitalEvents, ...abgEvents, ...ventilatorEvents].sort(
    (a, b) => asTime(b.recordedAt) - asTime(a.recordedAt)
  );
};

const containsForbiddenSettingOrder = (value) =>
  FORBIDDEN_EXACT_SETTING_ORDER.test(String(value || ''));

const toAdvisoryMessage = (message) => {
  const text =
    typeof message === 'string' && message.trim()
      ? message.trim()
      : 'Review this value and confirm clinically.';
  return containsForbiddenSettingOrder(text)
    ? 'Review ventilator settings and confirm clinically.'
    : text;
};

const getCurrentReadingsAdvisoryFlags = (admission = {}) => {
  const { latestAbg, latestVentilator } = getLatestCurrentReadingsValues(admission);
  const clinicalSummary = admission.clinicalSummary || {};
  const flags = [
    ...(Array.isArray(clinicalSummary.flags) ? clinicalSummary.flags : []),
    ...(Array.isArray(clinicalSummary.abg?.flags)
      ? clinicalSummary.abg.flags
      : []),
    ...(Array.isArray(latestAbg?.clinicalFlagsJson)
      ? latestAbg.clinicalFlagsJson
      : []),
    ...(Array.isArray(latestVentilator?.clinicalFlagsJson)
      ? latestVentilator.clinicalFlagsJson
      : []),
  ];

  return flags.map((flag) => ({
    ...flag,
    message: toAdvisoryMessage(flag?.message),
  }));
};

const getCurrentReadingsMissingData = (admission = {}) => {
  const missing =
    admission.clinicalSummary?.missingData ||
    admission.readiness?.missingData ||
    [];
  return (Array.isArray(missing) ? missing : []).map((field) => ({
    field,
    label: MISSING_DATA_FIELD_LABELS[field] || field,
    message: `${MISSING_DATA_FIELD_LABELS[field] || field} is missing; update when available.`,
  }));
};

const firstFiniteNumber = (...values) => {
  for (const value of values) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return null;
};

const roundClinicalValue = (value, digits = 1) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '';
  return Number(numeric.toFixed(digits)).toString();
};

const getLatestTwoRecords = (records, timestampField) =>
  sortRecordsDesc(records, timestampField).slice(0, 2);

const addDirectionalTrend = (
  trends,
  {
    label,
    latest,
    previous,
    minChange,
    higherIsBetter = true,
    digits = 1,
  }
) => {
  if (!Number.isFinite(latest) || !Number.isFinite(previous)) return;
  const delta = latest - previous;
  if (Math.abs(delta) < minChange) return;
  const improved = higherIsBetter ? delta > 0 : delta < 0;
  trends.push({
    score: improved ? 1 : -1,
    message: `${label} ${improved ? 'improved' : 'worsened'} from ${roundClinicalValue(previous, digits)} to ${roundClinicalValue(latest, digits)}.`,
  });
};

const addTargetTrend = (
  trends,
  { label, latest, previous, target, minChange, digits = 1 }
) => {
  if (!Number.isFinite(latest) || !Number.isFinite(previous)) return;
  const latestDistance = Math.abs(latest - target);
  const previousDistance = Math.abs(previous - target);
  const change = previousDistance - latestDistance;
  if (Math.abs(change) < minChange) return;
  const improved = change > 0;
  trends.push({
    score: improved ? 1 : -1,
    message: `${label} moved ${improved ? 'closer to' : 'farther from'} the expected range (${roundClinicalValue(previous, digits)} to ${roundClinicalValue(latest, digits)}).`,
  });
};

const createProgressAssessment = ({
  status,
  score,
  reasons = [],
  redFlagCount = 0,
}) => {
  const labels = {
    improving: 'Improving',
    deteriorating: 'Deteriorating',
    stable: 'Stable',
    insufficient: 'Needs more history',
  };
  const actionByStatus = {
    improving: 'keep_current_parameters',
    deteriorating: 'suggest_new_settings',
    stable: 'keep_current_parameters',
    insufficient: 'review_current_readings',
  };
  const recommendationByStatus = {
    improving:
      'Current readings suggest improvement. Recommend keeping the same ventilator parameters if bedside assessment supports this.',
    deteriorating:
      'Current readings suggest possible deterioration. Generate or review an updated ventilator settings suggestion before changing parameters.',
    stable:
      'Current readings are broadly stable. Recommend keeping the same ventilator parameters unless bedside assessment suggests otherwise.',
    insufficient:
      'Not enough previous readings are available to classify progress. Save current readings and continue trend review.',
  };

  return {
    status,
    label: labels[status],
    score,
    action: actionByStatus[status],
    recommendation: recommendationByStatus[status],
    redFlagCount,
    reasons,
  };
};

const getCurrentReadingsProgressAssessment = (admission = {}) => {
  const [latestVitals, previousVitals] = getLatestTwoRecords(
    admission.clinicalSnapshots,
    'measuredAt'
  );
  const [latestAbg, previousAbg] = getLatestTwoRecords(
    admission.abgTests,
    'collectedAt'
  );
  const [latestVentilator, previousVentilator] = getLatestTwoRecords(
    admission.ventilatorSettings,
    'measuredAt'
  );
  const trends = [];

  addDirectionalTrend(trends, {
    label: 'SpO2',
    latest: firstFiniteNumber(latestVitals?.spo2, latestAbg?.spo2AtSample),
    previous: firstFiniteNumber(previousVitals?.spo2, previousAbg?.spo2AtSample),
    minChange: 2,
    higherIsBetter: true,
  });
  addDirectionalTrend(trends, {
    label: 'PaO2',
    latest: firstFiniteNumber(latestAbg?.pao2),
    previous: firstFiniteNumber(previousAbg?.pao2),
    minChange: 10,
    higherIsBetter: true,
  });
  addTargetTrend(trends, {
    label: 'pH',
    latest: firstFiniteNumber(latestAbg?.ph),
    previous: firstFiniteNumber(previousAbg?.ph),
    target: 7.4,
    minChange: 0.03,
    digits: 2,
  });
  addTargetTrend(trends, {
    label: 'PaCO2',
    latest: firstFiniteNumber(latestAbg?.paco2),
    previous: firstFiniteNumber(previousAbg?.paco2),
    target: 40,
    minChange: 5,
  });
  addTargetTrend(trends, {
    label: 'Respiratory rate',
    latest: firstFiniteNumber(
      latestVitals?.respiratoryRate,
      latestVentilator?.respiratoryRateMeasured
    ),
    previous: firstFiniteNumber(
      previousVitals?.respiratoryRate,
      previousVentilator?.respiratoryRateMeasured
    ),
    target: 16,
    minChange: 4,
  });
  addTargetTrend(trends, {
    label: 'Heart rate',
    latest: firstFiniteNumber(latestVitals?.heartRate),
    previous: firstFiniteNumber(previousVitals?.heartRate),
    target: 80,
    minChange: 10,
  });
  addDirectionalTrend(trends, {
    label: 'FiO2 requirement',
    latest: firstFiniteNumber(latestVentilator?.fio2, latestAbg?.fio2AtSample),
    previous: firstFiniteNumber(previousVentilator?.fio2, previousAbg?.fio2AtSample),
    minChange: 0.05,
    higherIsBetter: false,
    digits: 2,
  });
  addDirectionalTrend(trends, {
    label: 'PEEP requirement',
    latest: firstFiniteNumber(latestVentilator?.peep),
    previous: firstFiniteNumber(previousVentilator?.peep),
    minChange: 2,
    higherIsBetter: false,
  });

  const redFlagCount = getCurrentReadingsAdvisoryFlags(admission).filter(
    (flag) => flag.severity === 'red'
  ).length;
  const score = trends.reduce((total, trend) => total + trend.score, 0);
  let status = 'stable';

  if (trends.length === 0) {
    status = 'insufficient';
  } else if (redFlagCount > 0 && score <= 0) {
    status = 'deteriorating';
  } else if (score >= 2) {
    status = 'improving';
  } else if (score <= -2) {
    status = 'deteriorating';
  }

  return createProgressAssessment({
    status,
    score,
    redFlagCount,
    reasons: trends.map((trend) => trend.message),
  });
};

const buildVentilatorRecommendationInputFromAdmission = (admission = {}) => {
  const patient = admission.patient || {};
  const { latestVitals, latestAbg, latestVentilator } =
    getLatestCurrentReadingsValues(admission);

  return stripUndefined({
    condition:
      admission.reasonForVentilation ||
      latestVitals?.mainCondition ||
      admission.clinicalSummary?.condition,
    patientPathway: patient.patientPathway,
    sexForSizeCalculations: patient.sexForSizeCalculations,
    ageYears: patient.ageYears,
    ageMonths: patient.ageMonths,
    ageDays: patient.ageDays,
    actualWeightKg: patient.actualWeightKg ?? patient.referenceWeightKg,
    heightOrLengthCm: patient.heightOrLengthCm,
    spo2: latestVitals?.spo2 ?? latestAbg?.spo2AtSample,
    respiratoryRate:
      latestVitals?.respiratoryRate ??
      latestVentilator?.respiratoryRateMeasured,
    heartRate: latestVitals?.heartRate,
    ph: latestAbg?.ph,
    pao2: latestAbg?.pao2,
    paco2: latestAbg?.paco2,
    hco3: latestAbg?.hco3,
    baseExcess: latestAbg?.baseExcess,
    lactate: latestAbg?.lactate,
    spo2AtSample: latestAbg?.spo2AtSample,
    mode: latestVentilator?.mode,
    tidalVolumeMl: latestVentilator?.tidalVolumeMl,
    respiratoryRateSet: latestVentilator?.respiratoryRateSet,
    respiratoryRateMeasured: latestVentilator?.respiratoryRateMeasured,
    peep: latestVentilator?.peep,
    pressureSupport: latestVentilator?.pressureSupport,
    inspiratoryPressure: latestVentilator?.inspiratoryPressure,
    peakPressure: latestVentilator?.peakPressure,
    plateauPressure: latestVentilator?.plateauPressure,
    ieRatio: latestVentilator?.ieRatio,
  }) || {};
};

export {
  ABG_FIELD_DEFINITIONS,
  FIELD_DEFINITION_BY_KEY,
  VITAL_SIGN_FIELD_DEFINITIONS,
  VENTILATOR_FIELD_DEFINITIONS,
  VENTILATOR_MODE_OPTIONS,
  abgUpdateSchema,
  buildVentilatorRecommendationInputFromAdmission,
  buildCurrentReadingsPayload,
  clinicalSnapshotUpdateSchema,
  containsForbiddenSettingOrder,
  getCurrentReadingsAdvisoryFlags,
  getCurrentReadingsHistory,
  getCurrentReadingsMissingData,
  getCurrentReadingsProgressAssessment,
  getLatestCurrentReadingsValues,
  safeBuildCurrentReadingsPayload,
  sanitizeCurrentReadingsFieldInput,
  toAdvisoryMessage,
  validateCurrentReadingsForm,
  validateCurrentReadingsDraft,
  validateNumericFieldValue,
  ventilatorUpdateSchema,
};
