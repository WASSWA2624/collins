/**
 * New Patient Model
 * Normalizes patient registration, admission payloads, and safe model-service payloads.
 * File: newPatients.model.js
 */
import { z } from 'zod';

const MISSING_VALUE_CODES = Object.freeze(['unknown', 'not_available']);

const NEW_PATIENT_PATHWAYS = Object.freeze([
  'NEONATE',
  'INFANT',
  'CHILD',
  'ADOLESCENT',
  'ADULT',
  'OBSTETRIC',
  'BURNS',
  'TRAUMA',
  'PERI_OPERATIVE',
  'MEDICAL',
  'SURGICAL',
  'UNKNOWN',
  'OTHER',
]);

const SEX_FOR_SIZE_CALCULATION_VALUES = Object.freeze(['MALE', 'FEMALE', 'UNKNOWN']);

const IDENTIFIER_KEY_PATTERN =
  /(^id$|name|phone|email|address|hospital|identifier|national|nextofkin|medicalrecord|recordid|deviceid|patientid|admissionid|facilityid|idempotency|dateofbirth|birthdate|dob|rawnote|note)/i;

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const cleanString = (value) => (typeof value === 'string' ? value.trim() : value);

const normalizeToken = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s/-]+/g, '_');

const isNewPatientMissingValue = (value) => {
  if (value === null) return true;
  if (typeof value !== 'string') return false;
  const normalized = normalizeToken(value);
  return normalized === '' || MISSING_VALUE_CODES.includes(normalized);
};

const normalizeEnumInput = (value, aliases = {}) => {
  if (isNewPatientMissingValue(value)) return 'UNKNOWN';
  const token = normalizeToken(value);
  return aliases[token] || token.toUpperCase();
};

const optionalString = (max = 255) =>
  z.preprocess(
    (value) => {
      if (isNewPatientMissingValue(value)) return null;
      return cleanString(value);
    },
    z.union([z.null(), z.string().max(max)])
  ).optional();

const optionalNumber = (schema) =>
  z.preprocess(
    (value) => (isNewPatientMissingValue(value) ? null : value),
    z.union([z.null(), schema])
  ).optional();
const optionalFiniteNumber = optionalNumber(z.coerce.number().finite());

const optionalBoolean = z.preprocess((value) => {
  if (isNewPatientMissingValue(value)) return null;
  if (typeof value !== 'string') return value;
  const normalized = normalizeToken(value);
  if (['true', '1', 'yes'].includes(normalized)) return true;
  if (['false', '0', 'no'].includes(normalized)) return false;
  return value;
}, z.union([z.null(), z.boolean()])).optional();

const optionalIsoDate = z.preprocess((value) => {
  if (isNewPatientMissingValue(value)) return null;
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString();
  if (typeof value === 'number') {
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toISOString() : value;
  }
  return cleanString(value);
}, z.union([z.null(), z.string().min(1)])).optional();

const jsonObjectSchema = z.record(z.string(), z.unknown());

const patientPathwaySchema = z.preprocess((value) => normalizeEnumInput(value, {
  obstetric_post_partum: 'OBSTETRIC',
  post_partum: 'OBSTETRIC',
  postpartum: 'OBSTETRIC',
  perioperative: 'PERI_OPERATIVE',
  peri_operative: 'PERI_OPERATIVE',
  other_unknown: 'UNKNOWN',
  not_available: 'UNKNOWN',
}), z.enum(NEW_PATIENT_PATHWAYS));

const sexForSizeCalculationsSchema = z.preprocess((value) => normalizeEnumInput(value, {
  m: 'MALE',
  male: 'MALE',
  f: 'FEMALE',
  female: 'FEMALE',
  not_available: 'UNKNOWN',
}), z.enum(SEX_FOR_SIZE_CALCULATION_VALUES));

const patientRegistrationSchema = z.object({
  appPatientCode: optionalString(80),
  optionalName: optionalString(160),
  hospitalNumber: optionalString(120),
  patientPathway: patientPathwaySchema.default('UNKNOWN'),
  dateOfBirth: optionalIsoDate,
  ageYears: optionalFiniteNumber,
  ageMonths: optionalFiniteNumber,
  ageDays: optionalFiniteNumber,
  estimatedAge: optionalBoolean,
  gestationalAgeWeeks: optionalFiniteNumber,
  correctedAgeWeeks: optionalFiniteNumber,
  sexForSizeCalculations: sexForSizeCalculationsSchema.optional(),
  actualWeightKg: optionalFiniteNumber,
  heightOrLengthCm: optionalFiniteNumber,
  referenceWeightKg: optionalFiniteNumber,
  referenceWeightMethod: optionalString(120),
  pathwayDetailsJson: jsonObjectSchema.nullable().optional(),
}).strict();

const clinicalSnapshotSchema = z.object({
  measuredAt: optionalIsoDate,
  oxygenSupportType: optionalString(120),
  heartRate: optionalFiniteNumber,
  respiratoryRate: optionalFiniteNumber,
  systolicBp: optionalFiniteNumber,
  diastolicBp: optionalFiniteNumber,
  meanArterialPressure: optionalFiniteNumber,
  temperatureC: optionalFiniteNumber,
  spo2: optionalFiniteNumber,
  gcs: optionalFiniteNumber,
  avpu: optionalString(40),
  rass: optionalFiniteNumber,
  mainCondition: optionalString(240),
  comorbiditiesJson: jsonObjectSchema.nullable().optional(),
  source: optionalString(80),
}).strict();

const abgSchema = z.object({
  collectedAt: optionalIsoDate,
  ph: optionalFiniteNumber,
  pao2: optionalFiniteNumber,
  paco2: optionalFiniteNumber,
  hco3: optionalFiniteNumber,
  baseExcess: optionalFiniteNumber,
  lactate: optionalFiniteNumber,
  spo2AtSample: optionalFiniteNumber,
  source: optionalString(80),
}).strict();

const ventilatorSchema = z.object({
  measuredAt: optionalIsoDate,
  mode: optionalString(80),
  tidalVolumeMl: optionalFiniteNumber,
  respiratoryRateSet: optionalFiniteNumber,
  respiratoryRateMeasured: optionalFiniteNumber,
  peep: optionalFiniteNumber,
  pressureSupport: optionalFiniteNumber,
  inspiratoryPressure: optionalFiniteNumber,
  peakPressure: optionalFiniteNumber,
  plateauPressure: optionalFiniteNumber,
  ieRatio: optionalString(40),
  source: optionalString(80),
}).strict();

const airwayDeviceSchema = z.object({
  measuredAt: optionalIsoDate,
  airwayRoute: optionalString(80),
  tubeType: optionalString(80),
  internalDiameterMm: optionalNumber(z.coerce.number().min(0).max(20)),
  depthCm: optionalNumber(z.coerce.number().min(0).max(60)),
  cuffPressureCmH2O: optionalNumber(z.coerce.number().min(0).max(120)),
  tubeSecured: optionalBoolean,
  notes: optionalString(2000),
}).strict();

const humidificationSchema = z.object({
  measuredAt: optionalIsoDate,
  method: optionalString(80),
  thickSecretions: optionalBoolean,
  highMinuteVentilation: optionalBoolean,
  hypothermia: optionalBoolean,
  airwayBleeding: optionalBoolean,
  expectedLongVentilation: optionalBoolean,
  suggestedOption: optionalString(120),
  confirmedOption: optionalString(120),
}).strict();

const clinicalReasonSchema = z.object({
  mainCondition: optionalString(240),
  comorbiditiesJson: jsonObjectSchema.nullable().optional(),
  specialConditionsJson: jsonObjectSchema.nullable().optional(),
}).strict();

const stringListSchema = z.array(z.string().trim().min(1).max(120)).max(80);

const newPatientDraftSchema = z.object({
  facilityId: z.string().trim().min(1),
  appAdmissionCode: optionalString(80),
  bedNumber: optionalString(80),
  admittedAt: optionalIsoDate,
  admissionSource: optionalString(120),
  reasonForSupport: optionalString(500),
  reasonForVentilation: optionalString(500),
  patient: patientRegistrationSchema,
  clinicalReason: clinicalReasonSchema.optional(),
  clinicalSnapshot: clinicalSnapshotSchema.optional(),
  oxygen: clinicalSnapshotSchema.optional(),
  abg: abgSchema.optional(),
  abgTest: abgSchema.optional(),
  ventilator: ventilatorSchema.optional(),
  ventilatorSetting: ventilatorSchema.optional(),
  airwayDevice: airwayDeviceSchema.optional(),
  humidification: humidificationSchema.optional(),
  permittedMissingFields: stringListSchema.optional(),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: optionalIsoDate,
  clientUpdatedAt: optionalIsoDate,
  idempotencyKey: z.string().trim().min(8).max(160),
}).strict();

const createClientTimestamp = (now = Date.now) => {
  const value = typeof now === 'function' ? now() : now;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : new Date().toISOString();
};

const createNonce = (random = Math.random) => {
  const value = typeof random === 'function' ? random() : Math.random();
  return Math.floor(Math.abs(value) * 1e12).toString(36).padStart(8, '0').slice(0, 12);
};

const compactToken = (value) =>
  String(value ?? 'unknown')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'unknown';

const createNewPatientIdempotencyKey = ({
  facilityId,
  prefix = 'new-patient',
  clientTimestamp = createClientTimestamp(),
  nonce = createNonce(),
} = {}) => {
  const token = `${compactToken(prefix)}:${compactToken(facilityId)}:${compactToken(clientTimestamp)}:${compactToken(nonce)}`;
  return token.slice(0, 160);
};

const stripUndefinedDeep = (value) => {
  if (Array.isArray(value)) return value.map(stripUndefinedDeep).filter((item) => item !== undefined);
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== undefined)
        .map(([key, entry]) => [key, stripUndefinedDeep(entry)])
        .filter(([, entry]) => entry !== undefined)
    );
  }
  return value;
};

const hasOwnPayloadKeys = (value) => isPlainObject(value) && Object.keys(stripUndefinedDeep(value)).length > 0;

const normalizeNewPatientDraft = (value, options = {}) => {
  const input = isPlainObject(value) ? value : {};
  const clientCreatedAt = input.clientCreatedAt || createClientTimestamp(options.now);
  const nonce = options.nonce || createNonce(options.random);
  const clientRecordId =
    input.clientRecordId ||
    createNewPatientIdempotencyKey({
      facilityId: input.facilityId,
      prefix: 'new-patient-draft',
      clientTimestamp: clientCreatedAt,
      nonce,
    }).slice(0, 120);
  const idempotencyKey =
    input.idempotencyKey ||
    createNewPatientIdempotencyKey({
      facilityId: input.facilityId,
      clientTimestamp: clientCreatedAt,
      nonce,
    });

  return newPatientDraftSchema.parse({
    ...input,
    clientRecordId,
    clientCreatedAt,
    clientUpdatedAt: input.clientUpdatedAt || createClientTimestamp(options.now),
    idempotencyKey,
  });
};

const safeParseNewPatientDraft = (value, options = {}) => {
  try {
    return { success: true, data: normalizeNewPatientDraft(value, options), error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

const buildCreateNewPatientPayload = (draftInput, options = {}) => {
  const draft = normalizeNewPatientDraft(draftInput, options);
  const clinicalSnapshot = hasOwnPayloadKeys(draft.clinicalSnapshot || draft.oxygen)
    ? draft.clinicalSnapshot || draft.oxygen
    : undefined;
  const abgTest = hasOwnPayloadKeys(draft.abgTest || draft.abg) ? draft.abgTest || draft.abg : undefined;
  const ventilatorSetting = hasOwnPayloadKeys(draft.ventilatorSetting || draft.ventilator)
    ? draft.ventilatorSetting || draft.ventilator
    : undefined;

  return stripUndefinedDeep({
    facilityId: draft.facilityId,
    appAdmissionCode: draft.appAdmissionCode,
    bedNumber: draft.bedNumber,
    admittedAt: draft.admittedAt,
    admissionSource: draft.admissionSource,
    reasonForVentilation: draft.reasonForVentilation || draft.reasonForSupport,
    patient: draft.patient,
    clinicalSnapshot,
    abgTest,
    ventilatorSetting,
    airwayDevice: hasOwnPayloadKeys(draft.airwayDevice) ? draft.airwayDevice : undefined,
    humidification: hasOwnPayloadKeys(draft.humidification) ? draft.humidification : undefined,
    clientRecordId: draft.clientRecordId,
    deviceId: draft.deviceId,
    clientCreatedAt: draft.clientCreatedAt,
    clientUpdatedAt: draft.clientUpdatedAt,
    idempotencyKey: draft.idempotencyKey,
  });
};

const buildNewPatientReasonStepPayload = (draftInput, options = {}) => {
  const draft = normalizeNewPatientDraft(draftInput, options);
  return stripUndefinedDeep({
    facilityId: draft.facilityId,
    appAdmissionCode: draft.appAdmissionCode,
    bedNumber: draft.bedNumber,
    admittedAt: draft.admittedAt,
    admissionSource: draft.admissionSource,
    reasonForSupport: draft.reasonForSupport,
    reasonForVentilation: draft.reasonForVentilation,
    patient: draft.patient,
    clinicalReason: draft.clinicalReason,
    permittedMissingFields: draft.permittedMissingFields,
    clientRecordId: draft.clientRecordId,
    deviceId: draft.deviceId,
    clientCreatedAt: draft.clientCreatedAt,
    clientUpdatedAt: draft.clientUpdatedAt,
    idempotencyKey: draft.idempotencyKey,
  });
};

const deidentifyNewPatientPayload = (value) => {
  if (Array.isArray(value)) return value.map(deidentifyNewPatientPayload);
  if (isPlainObject(value)) {
    return Object.entries(value).reduce((acc, [key, entry]) => {
      if (IDENTIFIER_KEY_PATTERN.test(key)) return acc;
      const cleaned = deidentifyNewPatientPayload(entry);
      if (cleaned !== undefined) acc[key] = cleaned;
      return acc;
    }, {});
  }
  return value;
};

const buildNewPatientAiSafePayload = (value) => {
  const input = isPlainObject(value) ? value : {};
  const payload = {
    patient: input.patient,
    clinicalReason: input.clinicalReason,
    reasonForSupport: input.reasonForSupport,
    reasonForVentilation: input.reasonForVentilation,
    clinicalSnapshot: input.clinicalSnapshot || input.oxygen,
    abg: input.abg || input.abgTest,
    ventilator: input.ventilator || input.ventilatorSetting,
    airwayDevice: input.airwayDevice,
    humidification: input.humidification,
  };
  return stripUndefinedDeep(deidentifyNewPatientPayload(payload));
};

export {
  NEW_PATIENT_PATHWAYS,
  MISSING_VALUE_CODES,
  SEX_FOR_SIZE_CALCULATION_VALUES,
  newPatientDraftSchema,
  patientRegistrationSchema,
  isNewPatientMissingValue,
  createNewPatientIdempotencyKey,
  createClientTimestamp,
  normalizeNewPatientDraft,
  safeParseNewPatientDraft,
  buildCreateNewPatientPayload,
  buildNewPatientReasonStepPayload,
  buildNewPatientAiSafePayload,
  deidentifyNewPatientPayload,
};
