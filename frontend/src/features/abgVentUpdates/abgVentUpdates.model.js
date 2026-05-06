/**
 * ABG and ventilator setting update model
 * Append-only payload builders and summary helpers.
 */
import { z } from 'zod';

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
  { label: 'Synchronized intermittent mandatory ventilation (SIMV)', value: 'SIMV' },
  { label: 'Pressure support ventilation (PSV)', value: 'PSV' },
  { label: 'Continuous positive airway pressure (CPAP)', value: 'CPAP' },
  { label: 'BiPAP / NIV', value: 'BiPAP/NIV' },
  { label: 'Airway pressure release ventilation (APRV)', value: 'APRV' },
  { label: 'High-frequency oscillatory ventilation (HFOV)', value: 'HFOV' },
  { label: 'High-flow nasal cannula (HFNC)', value: 'HFNC' },
  { label: 'Other / not listed', value: 'OTHER' },
]);

const ABG_FIELD_DEFINITIONS = Object.freeze([
  { key: 'ph', label: 'pH', min: 6.8, max: 7.8 },
  { key: 'pao2', label: 'PaO2', min: 20, max: 600, unit: 'mmHg' },
  { key: 'paco2', label: 'PaCO2', min: 10, max: 150, unit: 'mmHg' },
  { key: 'hco3', label: 'HCO3', min: 0, max: 80, unit: 'mmol/L' },
  { key: 'baseExcess', label: 'Base excess', min: -40, max: 40, unit: 'mmol/L' },
  { key: 'lactate', label: 'Lactate', min: 0, max: 40, unit: 'mmol/L' },
  { key: 'fio2AtSample', label: 'FiO2 at sample', min: 0.01, max: 1 },
  { key: 'spo2AtSample', label: 'SpO2 at sample', min: 40, max: 100, unit: '%' },
]);

const VENTILATOR_FIELD_DEFINITIONS = Object.freeze([
  { key: 'mode', label: 'Mode' },
  { key: 'tidalVolumeMl', label: 'Tidal volume', min: 1, max: 3000, unit: 'mL' },
  { key: 'respiratoryRateSet', label: 'Set respiratory rate', min: 0, max: 120, unit: 'breaths/min' },
  { key: 'respiratoryRateMeasured', label: 'Measured respiratory rate', min: 0, max: 180, unit: 'breaths/min' },
  { key: 'fio2', label: 'FiO2', min: 0.01, max: 1 },
  { key: 'peep', label: 'PEEP', min: 0, max: 30, unit: 'cmH2O' },
  { key: 'pressureSupport', label: 'Pressure support', min: 0, max: 80, unit: 'cmH2O' },
  { key: 'inspiratoryPressure', label: 'Inspiratory pressure', min: 0, max: 100, unit: 'cmH2O' },
  { key: 'peakPressure', label: 'Peak pressure', min: 0, max: 100, unit: 'cmH2O' },
  { key: 'plateauPressure', label: 'Plateau pressure', min: 0, max: 60, unit: 'cmH2O' },
  { key: 'ieRatio', label: 'I:E ratio' },
]);

const MISSING_DATA_FIELD_LABELS = Object.freeze({
  FiO2: 'FiO2',
  PaO2: 'PaO2',
  SpO2: 'SpO2',
  tidalVolumeMl: 'tidal volume',
  PEEP: 'PEEP',
  'actualWeightKg/referenceWeightKg': 'weight or reference weight',
  patientPathway: 'patient pathway',
});

const FORBIDDEN_EXACT_SETTING_ORDER = /\b(set|increase|decrease|reduce)\s+(peep|fio2|tidal volume|rate)\s+(to|by)\b/i;

const emptyToUndefined = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

const optionalText = (max = 120) =>
  z.preprocess(emptyToUndefined, z.string().trim().min(1).max(max).optional());

const optionalNumber = (min, max) =>
  z.preprocess(emptyToUndefined, z.coerce.number().min(min).max(max).optional());

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

const abgUpdateSchema = z.object({
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
}).strict();

const ventilatorUpdateSchema = z.object({
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
}).strict();

const stripUndefined = (value) => {
  if (Array.isArray(value)) return value.map(stripUndefined).filter((entry) => entry !== undefined);
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
  Boolean(record && fields.some((field) => record[field] !== undefined && record[field] !== null));

const createScopedToken = (prefix, admissionId, now) => {
  const timestamp = now instanceof Date ? now.getTime() : Date.now();
  const scope = String(admissionId || 'admission').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || 'admission';
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

const buildAbgVentUpdatePayload = ({
  admissionId,
  abg,
  ventilator,
  clientRecordId,
  idempotencyKey,
  source = 'abg_vent_update',
  now = new Date(),
} = {}) => {
  if (!admissionId || typeof admissionId !== 'string') {
    throw new Error('ABG_VENT_UPDATE_ADMISSION_REQUIRED');
  }

  const resolvedNow = resolveNow(now);
  const timestamp = resolvedNow.toISOString();
  const resolvedClientRecordId = clientRecordId || createScopedToken('abg-vent', admissionId, resolvedNow);
  const resolvedIdempotencyKey = idempotencyKey || createScopedToken('abg-vent-idem', admissionId, resolvedNow);
  const parsedAbg = parseRecord(abgUpdateSchema, abg);
  const parsedVentilator = parseRecord(ventilatorUpdateSchema, ventilator);

  const hasAbg = hasAnyField(parsedAbg, ABG_NUMERIC_FIELDS);
  const hasVentilator = hasAnyField(parsedVentilator, [...VENTILATOR_NUMERIC_FIELDS, 'mode', 'ieRatio']);

  if (!hasAbg && !hasVentilator) {
    throw new Error('ABG_VENT_UPDATE_EMPTY');
  }

  return stripUndefined({
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

const safeBuildAbgVentUpdatePayload = (input) => {
  try {
    return { ok: true, payload: buildAbgVentUpdatePayload(input), error: null };
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
    return asTime(b?.[timestampField] || b?.createdAt) - asTime(a?.[timestampField] || a?.createdAt);
  });

const getLatestAbgVentValues = (admission = {}) => {
  const latestAbg = sortRecordsDesc(admission.abgTests, 'collectedAt')[0] || null;
  const latestVentilator = sortRecordsDesc(admission.ventilatorSettings, 'measuredAt')[0] || null;
  return { latestAbg, latestVentilator };
};

const getAbgVentHistory = (admission = {}) => {
  const abgEvents = (Array.isArray(admission.abgTests) ? admission.abgTests : []).map((record) => ({
    id: record.id || record.clientRecordId,
    type: 'abg',
    version: record.version,
    recordedAt: record.collectedAt || record.createdAt,
    record,
  }));
  const ventilatorEvents = (Array.isArray(admission.ventilatorSettings) ? admission.ventilatorSettings : []).map((record) => ({
    id: record.id || record.clientRecordId,
    type: 'ventilator',
    version: record.version,
    recordedAt: record.measuredAt || record.createdAt,
    record,
  }));
  return [...abgEvents, ...ventilatorEvents].sort((a, b) => asTime(b.recordedAt) - asTime(a.recordedAt));
};

const containsForbiddenSettingOrder = (value) => FORBIDDEN_EXACT_SETTING_ORDER.test(String(value || ''));

const toAdvisoryMessage = (message) => {
  const text = typeof message === 'string' && message.trim() ? message.trim() : 'Review this value and confirm clinically.';
  return containsForbiddenSettingOrder(text) ? 'Review ventilator settings and confirm clinically.' : text;
};

const getAbgVentAdvisoryFlags = (admission = {}) => {
  const { latestAbg, latestVentilator } = getLatestAbgVentValues(admission);
  const clinicalSummary = admission.clinicalSummary || {};
  const flags = [
    ...(Array.isArray(clinicalSummary.flags) ? clinicalSummary.flags : []),
    ...(Array.isArray(clinicalSummary.abg?.flags) ? clinicalSummary.abg.flags : []),
    ...(Array.isArray(latestAbg?.clinicalFlagsJson) ? latestAbg.clinicalFlagsJson : []),
    ...(Array.isArray(latestVentilator?.clinicalFlagsJson) ? latestVentilator.clinicalFlagsJson : []),
  ];

  return flags.map((flag) => ({
    ...flag,
    message: toAdvisoryMessage(flag?.message),
  }));
};

const getAbgVentMissingData = (admission = {}) => {
  const missing = admission.clinicalSummary?.missingData || admission.readiness?.missingData || [];
  return (Array.isArray(missing) ? missing : []).map((field) => ({
    field,
    label: MISSING_DATA_FIELD_LABELS[field] || field,
    message: `${MISSING_DATA_FIELD_LABELS[field] || field} is missing; update when available.`,
  }));
};

export {
  ABG_FIELD_DEFINITIONS,
  VENTILATOR_FIELD_DEFINITIONS,
  VENTILATOR_MODE_OPTIONS,
  abgUpdateSchema,
  buildAbgVentUpdatePayload,
  containsForbiddenSettingOrder,
  getAbgVentAdvisoryFlags,
  getAbgVentHistory,
  getAbgVentMissingData,
  getLatestAbgVentValues,
  safeBuildAbgVentUpdatePayload,
  toAdvisoryMessage,
  ventilatorUpdateSchema,
};
