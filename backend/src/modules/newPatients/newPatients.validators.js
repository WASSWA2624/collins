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
const optionalAppRecordCode = optionalString(6);
const requiredString = (max = 255) => z.preprocess(
  (value) => (isMissingInput(value) ? '' : value),
  z.string().trim().min(1).max(max)
);
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
const optionalDefaultDate = z.preprocess(
  (value) => (isMissingInput(value) ? undefined : value),
  z.coerce.date().optional()
);
const finiteNumber = z.coerce.number().finite();
const optionalFiniteNumber = nullableOptional(finiteNumber);
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
  appPatientCode: optionalAppRecordCode,
  optionalName: optionalString(160),
  firstName: optionalString(80),
  lastName: optionalString(80),
  hospitalNumber: optionalString(120),
  patientPathway: patientPathway.default('UNKNOWN'),
  dateOfBirth: optionalDate,
  ageYears: nullableOptional(z.coerce.number().int().min(0).max(130)),
  ageMonths: nullableOptional(z.coerce.number().int().min(0).max(1560)),
  ageDays: nullableOptional(z.coerce.number().int().min(0).max(47450)),
  estimatedAge: optionalBoolean,
  gestationalAgeWeeks: nullableOptional(z.coerce.number().min(20).max(50)),
  correctedAgeWeeks: nullableOptional(z.coerce.number().min(20).max(120)),
  sexForSizeCalculations: sexForSizeCalculations.optional(),
  actualWeightKg: nullableOptional(z.coerce.number().min(0.2).max(400)),
  heightOrLengthCm: nullableOptional(z.coerce.number().min(20).max(260)),
  referenceWeightKg: nullableOptional(z.coerce.number().min(0.2).max(400)),
  referenceWeightMethod: optionalString(120),
  pathwayDetailsJson: jsonObject.nullable().optional(),
});

const newPatientPayload = patientPayload.extend({
  optionalName: optionalString(160),
  firstName: requiredString(80),
  ageYears: optionalFiniteNumber,
  ageMonths: optionalFiniteNumber,
  ageDays: optionalFiniteNumber,
  gestationalAgeWeeks: optionalFiniteNumber,
  correctedAgeWeeks: optionalFiniteNumber,
  actualWeightKg: optionalFiniteNumber,
  heightOrLengthCm: optionalFiniteNumber,
  referenceWeightKg: optionalFiniteNumber,
});

const clinicalSnapshotBody = z.object({
  measuredAt: optionalDefaultDate,
  oxygenSupportType: optionalString(120),
  heartRate: optionalFiniteNumber,
  respiratoryRate: optionalFiniteNumber,
  systolicBp: optionalFiniteNumber,
  diastolicBp: optionalFiniteNumber,
  meanArterialPressure: optionalFiniteNumber,
  temperatureC: optionalFiniteNumber,
  spo2: optionalFiniteNumber,
  fio2: optionalFiniteNumber,
  gcs: optionalFiniteNumber,
  avpu: optionalString(40),
  rass: optionalFiniteNumber,
  mainCondition: optionalString(240),
  comorbiditiesJson: jsonObject.nullable().optional(),
  source: optionalString(80),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: optionalDate,
  idempotencyKey,
  overrideReason,
}).strict();

const abgBody = z.object({
  collectedAt: optionalDefaultDate,
  ph: optionalFiniteNumber,
  pao2: optionalFiniteNumber,
  paco2: optionalFiniteNumber,
  hco3: optionalFiniteNumber,
  baseExcess: optionalFiniteNumber,
  lactate: optionalFiniteNumber,
  fio2AtSample: optionalFiniteNumber,
  spo2AtSample: optionalFiniteNumber,
  source: optionalString(80),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: optionalDate,
  clientUpdatedAt: optionalDate,
  idempotencyKey,
  overrideReason,
}).strict();

const ventilatorBody = z.object({
  measuredAt: optionalDefaultDate,
  mode: optionalString(80),
  tidalVolumeMl: optionalFiniteNumber,
  respiratoryRateSet: optionalFiniteNumber,
  respiratoryRateMeasured: optionalFiniteNumber,
  fio2: optionalFiniteNumber,
  peep: optionalFiniteNumber,
  pressureSupport: optionalFiniteNumber,
  inspiratoryPressure: optionalFiniteNumber,
  peakPressure: optionalFiniteNumber,
  plateauPressure: optionalFiniteNumber,
  ieRatio: optionalString(40),
  source: optionalString(80),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: optionalDate,
  clientUpdatedAt: optionalDate,
  idempotencyKey,
  overrideReason,
}).strict();

const ABG_UPDATE_VALUE_FIELDS = [
  'ph',
  'pao2',
  'paco2',
  'hco3',
  'baseExcess',
  'lactate',
  'fio2AtSample',
  'spo2AtSample',
];

const CLINICAL_SNAPSHOT_UPDATE_VALUE_FIELDS = [
  'spo2',
  'fio2',
  'heartRate',
  'respiratoryRate',
  'systolicBp',
  'diastolicBp',
  'meanArterialPressure',
  'temperatureC',
  'gcs',
  'avpu',
  'rass',
];

const VENTILATOR_UPDATE_VALUE_FIELDS = [
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
];

const hasClinicalValue = (record, fields) =>
  Boolean(record && fields.some((field) => record[field] !== undefined && record[field] !== null));

export const newPatientListSchema = z.object({
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

export const newPatientIdSchema = z.object({
  body: z.object({}).optional(),
  params: idParam,
  query: z.object({}).optional(),
});

export const createNewPatientSchema = z.object({
  body: z.object({
    facilityId: optionalString(120),
    appAdmissionCode: optionalAppRecordCode,
    bedNumber: optionalString(80),
    admittedAt: optionalDefaultDate,
    admissionSource: optionalString(120),
    reasonForVentilation: optionalString(500),
    patient: newPatientPayload,
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

export const patchNewPatientSchema = z.object({
  body: z.object({
    bedNumber: optionalString(80),
    admissionSource: optionalString(120),
    reasonForVentilation: optionalString(500),
    status: z.enum(['ACTIVE', 'TRANSFERRED', 'DISCHARGED', 'DECEASED', 'CANCELLED']).optional(),
    patient: patientPayload.partial().optional(),
    clientUpdatedAt: optionalDate,
    idempotencyKey,
    overrideReason,
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

export const newPatientCurrentReadingsSchema = z.object({
  body: z.object({
    clinicalSnapshot: clinicalSnapshotBody.omit({ idempotencyKey: true, overrideReason: true }).optional(),
    abgTest: abgBody.omit({ idempotencyKey: true, overrideReason: true }).optional(),
    ventilatorSetting: ventilatorBody.omit({ idempotencyKey: true, overrideReason: true }).optional(),
    clientRecordId: optionalString(120),
    deviceId: optionalString(120),
    clientCreatedAt: optionalDate,
    clientUpdatedAt: optionalDate,
    idempotencyKey,
    overrideReason,
  }).strict().refine(
    (body) =>
      hasClinicalValue(body.clinicalSnapshot, CLINICAL_SNAPSHOT_UPDATE_VALUE_FIELDS)
      || hasClinicalValue(body.abgTest, ABG_UPDATE_VALUE_FIELDS)
      || hasClinicalValue(body.ventilatorSetting, VENTILATOR_UPDATE_VALUE_FIELDS),
    { message: 'At least one vital sign, ABG, or ventilator setting value is required' }
  ),
  params: idParam,
  query: emptyQuery.optional(),
});

const airwayBody = z.object({
  measuredAt: optionalDefaultDate,
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
  measuredAt: optionalDefaultDate,
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
    reviewDate: optionalDefaultDate,
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

const newPatientFlowFieldList = z.array(z.string().trim().min(1).max(120)).max(80);

const uncertaintyBody = z.object({
  isUncertain: optionalBoolean,
  fields: newPatientFlowFieldList.optional(),
  reason: optionalClinicalText(1000),
  notes: optionalClinicalText(2000),
}).strict();

const deviceContextBody = z.object({
  deviceId: optionalString(120),
  source: optionalString(80),
  oxygenSource: optionalString(120),
  ventilatorType: optionalString(120),
  facilityDeviceLabel: optionalString(160),
}).strict();

const clinicalReasonBody = z.object({
  mainCondition: optionalString(240),
  comorbiditiesJson: jsonObject.nullable().optional(),
  specialConditionsJson: jsonObject.nullable().optional(),
}).strict();

const hasPatientAgeInput = (patient = {}) =>
  (patient.ageYears !== undefined && patient.ageYears !== null) ||
  (patient.ageMonths !== undefined && patient.ageMonths !== null) ||
  (patient.ageDays !== undefined && patient.ageDays !== null) ||
  (patient.dateOfBirth !== undefined && patient.dateOfBirth !== null);

const newPatientClinicalSnapshotBody = z.object({
  measuredAt: optionalDefaultDate,
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
  comorbiditiesJson: jsonObject.nullable().optional(),
  source: optionalString(80),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: optionalDate,
}).strict();

const newPatientAbgBody = z.object({
  collectedAt: optionalDefaultDate,
  ph: optionalFiniteNumber,
  pao2: optionalFiniteNumber,
  paco2: optionalFiniteNumber,
  hco3: optionalFiniteNumber,
  baseExcess: optionalFiniteNumber,
  lactate: optionalFiniteNumber,
  spo2AtSample: optionalFiniteNumber,
  source: optionalString(80),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: optionalDate,
  clientUpdatedAt: optionalDate,
}).strict();

const newPatientVentilatorBody = z.object({
  measuredAt: optionalDefaultDate,
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
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: optionalDate,
  clientUpdatedAt: optionalDate,
}).strict();

export const newPatientReasonStepSchema = z.object({
  body: z.object({
    facilityId: optionalString(120),
    appAdmissionCode: optionalAppRecordCode,
    bedNumber: optionalString(80),
    admittedAt: optionalDate,
    admissionSource: optionalString(120),
    reasonForSupport: optionalString(500),
    reasonForVentilation: optionalString(500),
    patient: newPatientPayload,
    clinicalReason: clinicalReasonBody.optional(),
    permittedMissingFields: newPatientFlowFieldList.optional(),
    clientRecordId: optionalString(120),
    deviceId: optionalString(120),
    clientCreatedAt: optionalDate,
    clientUpdatedAt: optionalDate,
    idempotencyKey,
  }).strict().superRefine((body, ctx) => {
    if (hasPatientAgeInput(body.patient)) return;
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['patient', 'ageYears'],
      message: 'At least one age value is required: years, months, days, or date of birth.',
    });
  }),
  params: z.object({}).optional(),
  query: emptyQuery.optional(),
});

export const newPatientOxygenAbgVentilatorStepSchema = z.object({
  body: z.object({
    oxygen: newPatientClinicalSnapshotBody.optional(),
    clinicalSnapshot: newPatientClinicalSnapshotBody.optional(),
    abg: newPatientAbgBody.optional(),
    abgTest: newPatientAbgBody.optional(),
    ventilator: newPatientVentilatorBody.optional(),
    ventilatorSetting: newPatientVentilatorBody.optional(),
    airwayDevice: airwayBody.omit({ idempotencyKey: true, overrideReason: true }).optional(),
    humidification: humidificationBody.omit({ idempotencyKey: true, overrideReason: true }).optional(),
    uncertainty: uncertaintyBody.optional(),
    deviceContext: deviceContextBody.optional(),
    clientRecordId: optionalString(120),
    deviceId: optionalString(120),
    clientCreatedAt: optionalDate,
    clientUpdatedAt: optionalDate,
    idempotencyKey,
    overrideReason,
  }).strict(),
  params: idParam,
  query: emptyQuery.optional(),
});

export const newPatientSaveReviewStepSchema = z.object({
  body: z.object({
    clinicianConfirmed: optionalBoolean,
    overrideReason,
    reviewNote: optionalClinicalText(2000),
    clientRecordId: optionalString(120),
    deviceId: optionalString(120),
    clientCreatedAt: optionalDate,
    clientUpdatedAt: optionalDate,
    idempotencyKey,
  }).strict(),
  params: idParam,
  query: emptyQuery.optional(),
});

export const newPatientVentilatorRecommendationSchema = z.object({
  body: z.object({
    facilityId: optionalString(120),
    admissionId: optionalString(120),
    input: z.object({
      condition: optionalString(500),
      reasonForSupport: optionalString(500),
      patientPathway: patientPathway.optional(),
      sexForSizeCalculations: sexForSizeCalculations.optional(),
      ageYears: optionalFiniteNumber,
      ageMonths: optionalFiniteNumber,
      ageDays: optionalFiniteNumber,
      actualWeightKg: optionalFiniteNumber,
      heightOrLengthCm: optionalFiniteNumber,
      spo2: optionalFiniteNumber,
      respiratoryRate: optionalFiniteNumber,
      heartRate: optionalFiniteNumber,
      ph: optionalFiniteNumber,
      pao2: optionalFiniteNumber,
      paco2: optionalFiniteNumber,
      hco3: optionalFiniteNumber,
      baseExcess: optionalFiniteNumber,
      lactate: optionalFiniteNumber,
      spo2AtSample: optionalFiniteNumber,
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
    }).strict().default({}),
    backendSummary: jsonObject.nullable().optional(),
  }).strict(),
  params: z.object({}).optional(),
  query: emptyQuery.optional(),
});
