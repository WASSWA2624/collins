import { z } from 'zod';

const MISSING_SENTINELS = new Set(['unknown', 'not_available']);
const PATHWAY_VALUES = [
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
];
const SEX_VALUES = ['MALE', 'FEMALE', 'UNKNOWN'];

const isMissingInput = (value) => {
  if (value === null) return true;
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '' || MISSING_SENTINELS.has(normalized);
};

const normalizeToken = (value) => String(value).trim().toLowerCase().replace(/[\s/-]+/g, '_');
const normalizeEnumInput = (value, aliases = {}) => {
  if (isMissingInput(value)) return 'UNKNOWN';
  const token = normalizeToken(value);
  return aliases[token] || token.toUpperCase();
};

const nullableOptional = (schema) => z.preprocess(
  (value) => (isMissingInput(value) ? null : value),
  z.union([z.null(), schema])
).optional();

const optionalString = (max = 255) => z.preprocess(
  (value) => (value === null ? null : value),
  z.union([z.null(), z.string().trim().max(max)])
).optional();
const optionalClinicalText = (max = 2000) => optionalString(max);
const optionalBoolean = z.preprocess((value) => {
  if (isMissingInput(value)) return null;
  if (typeof value !== 'string') return value;

  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes'].includes(normalized)) return true;
  if (['false', '0', 'no'].includes(normalized)) return false;
  return value;
}, z.union([z.null(), z.boolean()])).optional();
const optionalDate = nullableOptional(z.coerce.date());
const idParam = z.object({ id: z.string().min(1) });
const emptyQuery = z.object({}).strict();
const jsonObject = z.record(z.string(), z.unknown());
const idempotencyKey = z.string().trim().min(8).max(160).optional();
const overrideReason = z.string().trim().min(8).max(1000).optional();

const patientPathway = z.preprocess((value) => normalizeEnumInput(value, {
  obstetric_post_partum: 'OBSTETRIC',
  post_partum: 'OBSTETRIC',
  postpartum: 'OBSTETRIC',
  other_unknown: 'UNKNOWN',
  not_available: 'UNKNOWN',
}), z.enum(PATHWAY_VALUES));

const sexForSizeCalculations = z.preprocess((value) => normalizeEnumInput(value, {
  m: 'MALE',
  male: 'MALE',
  f: 'FEMALE',
  female: 'FEMALE',
  not_available: 'UNKNOWN',
}), z.enum(SEX_VALUES));

const patientPayload = z.object({
  appPatientCode: optionalString(80),
  optionalName: optionalString(160),
  hospitalNumber: optionalString(120),
  patientPathway,
  dateOfBirth: optionalDate,
  ageYears: nullableOptional(z.coerce.number().int().min(0).max(130)),
  ageMonths: nullableOptional(z.coerce.number().int().min(0).max(1560)),
  estimatedAge: optionalBoolean,
  gestationalAgeWeeks: nullableOptional(z.coerce.number().min(20).max(50)),
  correctedAgeWeeks: nullableOptional(z.coerce.number().min(20).max(120)),
  sexForSizeCalculations: sexForSizeCalculations.optional(),
  actualWeightKg: nullableOptional(z.coerce.number().min(0.2).max(400)),
  heightOrLengthCm: nullableOptional(z.coerce.number().min(20).max(260)),
  referenceWeightKg: nullableOptional(z.coerce.number().min(0.2).max(400)),
  referenceWeightMethod: optionalString(120),
});

const clinicalSnapshotBody = z.object({
  measuredAt: optionalDate,
  oxygenSupportType: optionalString(120),
  heartRate: nullableOptional(z.coerce.number().min(0).max(320)),
  respiratoryRate: nullableOptional(z.coerce.number().min(0).max(180)),
  systolicBp: nullableOptional(z.coerce.number().min(0).max(350)),
  diastolicBp: nullableOptional(z.coerce.number().min(0).max(250)),
  meanArterialPressure: nullableOptional(z.coerce.number().min(0).max(250)),
  temperatureC: nullableOptional(z.coerce.number().min(20).max(45)),
  spo2: nullableOptional(z.coerce.number().min(40).max(100)),
  fio2: nullableOptional(z.coerce.number().gt(0).max(1)),
  gcs: nullableOptional(z.coerce.number().min(3).max(15)),
  avpu: optionalString(40),
  rass: nullableOptional(z.coerce.number().min(-5).max(4)),
  mainCondition: optionalString(240),
  comorbiditiesJson: jsonObject.nullable().optional(),
  source: optionalString(80),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: optionalDate,
  clientUpdatedAt: optionalDate,
  idempotencyKey,
  overrideReason,
}).strict();

const abgBody = z.object({
  collectedAt: optionalDate,
  ph: nullableOptional(z.coerce.number().min(6.8).max(7.8)),
  pao2: nullableOptional(z.coerce.number().min(20).max(600)),
  paco2: nullableOptional(z.coerce.number().min(10).max(150)),
  hco3: nullableOptional(z.coerce.number().min(0).max(80)),
  baseExcess: nullableOptional(z.coerce.number().min(-40).max(40)),
  lactate: nullableOptional(z.coerce.number().min(0).max(40)),
  fio2AtSample: nullableOptional(z.coerce.number().gt(0).max(1)),
  spo2AtSample: nullableOptional(z.coerce.number().min(40).max(100)),
  source: optionalString(80),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: optionalDate,
  idempotencyKey,
  overrideReason,
});

const ventilatorBody = z.object({
  measuredAt: optionalDate,
  mode: optionalString(80),
  tidalVolumeMl: nullableOptional(z.coerce.number().min(1).max(3000)),
  respiratoryRateSet: nullableOptional(z.coerce.number().min(0).max(120)),
  respiratoryRateMeasured: nullableOptional(z.coerce.number().min(0).max(180)),
  fio2: nullableOptional(z.coerce.number().gt(0).max(1)),
  peep: nullableOptional(z.coerce.number().min(0).max(30)),
  pressureSupport: nullableOptional(z.coerce.number().min(0).max(80)),
  inspiratoryPressure: nullableOptional(z.coerce.number().min(0).max(100)),
  peakPressure: nullableOptional(z.coerce.number().min(0).max(100)),
  plateauPressure: nullableOptional(z.coerce.number().min(0).max(60)),
  ieRatio: optionalString(40),
  source: optionalString(80),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: optionalDate,
  clientUpdatedAt: optionalDate,
  idempotencyKey,
  overrideReason,
}).strict();

export const admissionListSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    facilityId: z.string().min(1).optional(),
    status: z.enum(['ACTIVE', 'TRANSFERRED', 'DISCHARGED', 'DECEASED', 'CANCELLED']).optional(),
    reviewStatus: z.enum(['PENDING', 'APPROVED', 'CORRECTION_REQUESTED', 'EXCLUDED']).optional(),
    patientPathway: patientPathway.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const admissionIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParam,
  query: z.object({}).optional(),
});

export const createAdmissionSchema = z.object({
  body: z.object({
    facilityId: z.string().min(1),
    appAdmissionCode: optionalString(80),
    bedNumber: optionalString(80),
    admittedAt: optionalDate,
    admissionSource: optionalString(120),
    reasonForVentilation: optionalString(500),
    patient: patientPayload,
    clinicalSnapshot: clinicalSnapshotBody.omit({ idempotencyKey: true, overrideReason: true }).optional(),
    abgTest: abgBody.omit({ idempotencyKey: true, overrideReason: true }).optional(),
    ventilatorSetting: ventilatorBody.omit({ idempotencyKey: true, overrideReason: true }).optional(),
    airwayDevice: z.lazy(() => airwayBody.omit({ idempotencyKey: true, overrideReason: true })).optional(),
    humidification: z.lazy(() => humidificationBody.omit({ idempotencyKey: true, overrideReason: true })).optional(),
    clientRecordId: optionalString(120),
    deviceId: optionalString(120),
    clientCreatedAt: optionalDate,
    clientUpdatedAt: optionalDate,
    idempotencyKey,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const patchAdmissionSchema = z.object({
  body: z.object({
    bedNumber: optionalString(80),
    admissionSource: optionalString(120),
    reasonForVentilation: optionalString(500),
    status: z.enum(['ACTIVE', 'TRANSFERRED', 'DISCHARGED', 'DECEASED', 'CANCELLED']).optional(),
    patient: patientPayload.partial().optional(),
    clientUpdatedAt: optionalDate,
    idempotencyKey,
  }),
  params: idParam,
  query: z.object({}).optional(),
});

export const clinicalSnapshotSchema = z.object({
  body: clinicalSnapshotBody,
  params: idParam,
  query: z.object({}).optional(),
});

export const abgTestSchema = z.object({
  body: abgBody,
  params: idParam,
  query: emptyQuery.optional(),
});

export const ventilatorSettingSchema = z.object({
  body: ventilatorBody,
  params: idParam,
  query: emptyQuery.optional(),
});

const airwayBody = z.object({
  measuredAt: optionalDate,
  airwayRoute: optionalString(80),
  tubeType: optionalString(80),
  internalDiameterMm: nullableOptional(z.coerce.number().min(0).max(20)),
  depthCm: nullableOptional(z.coerce.number().min(0).max(60)),
  cuffPressureCmH2O: nullableOptional(z.coerce.number().min(0).max(120)),
  tubeSecured: optionalBoolean,
  notes: optionalClinicalText(2000),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: optionalDate,
  idempotencyKey,
  overrideReason,
});

export const airwayDeviceSchema = z.object({
  body: airwayBody,
  params: idParam,
  query: z.object({}).optional(),
});

const humidificationBody = z.object({
  measuredAt: optionalDate,
  method: optionalString(80),
  thickSecretions: optionalBoolean,
  highMinuteVentilation: optionalBoolean,
  hypothermia: optionalBoolean,
  airwayBleeding: optionalBoolean,
  expectedLongVentilation: optionalBoolean,
  suggestedOption: optionalString(120),
  confirmedOption: optionalString(120),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: optionalDate,
  idempotencyKey,
  overrideReason,
});

export const humidificationSchema = z.object({
  body: humidificationBody,
  params: idParam,
  query: z.object({}).optional(),
});

export const dailyReviewSchema = z.object({
  body: z.object({
    reviewDate: optionalDate,
    oxygenationStable: optionalBoolean,
    hemodynamicsStable: optionalBoolean,
    sedationLightEnough: optionalBoolean,
    secretionsManageable: optionalBoolean,
    sbtStatus: optionalString(80),
    sbtFailureReason: optionalString(500),
    proneStatus: optionalString(80),
    vapBundleJson: jsonObject.nullable().optional(),
    clientRecordId: optionalString(120),
    deviceId: optionalString(120),
    clientCreatedAt: optionalDate,
    idempotencyKey,
    overrideReason,
  }),
  params: idParam,
  query: z.object({}).optional(),
});

export const outcomeSchema = z.object({
  body: z.object({
    outcomeType: z.enum(['EXTUBATED', 'TRANSFERRED', 'DISCHARGED', 'DECEASED', 'STILL_ADMITTED', 'OTHER']),
    outcomeDate: optionalDate,
    ventilatorDays: nullableOptional(z.coerce.number().min(0).max(3650)),
    icuLengthOfStayDays: nullableOptional(z.coerce.number().min(0).max(3650)),
    hospitalLengthOfStayDays: nullableOptional(z.coerce.number().min(0).max(3650)),
    reintubationWithin48h: optionalBoolean,
    tracheostomy: optionalBoolean,
    vapSuspected: optionalBoolean,
    notes: optionalClinicalText(2000),
    clientRecordId: optionalString(120),
    deviceId: optionalString(120),
    clientCreatedAt: optionalDate,
    idempotencyKey,
    overrideReason,
  }),
  params: idParam,
  query: z.object({}).optional(),
});
