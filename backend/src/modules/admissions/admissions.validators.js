import { z } from 'zod';

const optionalString = (max = 255) => z.string().trim().max(max).optional();
const optionalClinicalText = (max = 2000) => z.string().trim().max(max).optional();
const optionalNumber = z.coerce.number().finite().optional();
const optionalBoolean = z.coerce.boolean().optional();
const idParam = z.object({ id: z.string().min(1) });
const jsonObject = z.record(z.string(), z.unknown());
const idempotencyKey = z.string().trim().min(8).max(160).optional();

const patientPathway = z.enum([
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

const patientPayload = z.object({
  appPatientCode: optionalString(80),
  optionalName: optionalString(160),
  hospitalNumber: optionalString(120),
  patientPathway,
  dateOfBirth: z.coerce.date().optional(),
  ageYears: z.coerce.number().int().min(0).max(130).optional(),
  ageMonths: z.coerce.number().int().min(0).max(1560).optional(),
  estimatedAge: optionalBoolean,
  gestationalAgeWeeks: z.coerce.number().min(20).max(50).optional(),
  correctedAgeWeeks: z.coerce.number().min(20).max(120).optional(),
  sexForSizeCalculations: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).optional(),
  actualWeightKg: z.coerce.number().min(0.2).max(400).optional(),
  heightOrLengthCm: z.coerce.number().min(20).max(260).optional(),
  referenceWeightKg: z.coerce.number().min(0.2).max(400).optional(),
  referenceWeightMethod: optionalString(120),
});

const clinicalSnapshotBody = z.object({
  measuredAt: z.coerce.date().optional(),
  oxygenSupportType: optionalString(120),
  heartRate: z.coerce.number().min(0).max(320).optional(),
  respiratoryRate: z.coerce.number().min(0).max(180).optional(),
  systolicBp: z.coerce.number().min(0).max(350).optional(),
  diastolicBp: z.coerce.number().min(0).max(250).optional(),
  meanArterialPressure: z.coerce.number().min(0).max(250).optional(),
  temperatureC: z.coerce.number().min(20).max(45).optional(),
  spo2: z.coerce.number().min(40).max(100).optional(),
  fio2: z.coerce.number().gt(0).max(1).optional(),
  gcs: z.coerce.number().min(3).max(15).optional(),
  avpu: optionalString(40),
  rass: z.coerce.number().min(-5).max(4).optional(),
  mainCondition: optionalString(240),
  comorbiditiesJson: jsonObject.optional(),
  source: optionalString(80),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: z.coerce.date().optional(),
  idempotencyKey,
});

const abgBody = z.object({
  collectedAt: z.coerce.date().optional(),
  ph: z.coerce.number().min(6.8).max(7.8).optional(),
  pao2: z.coerce.number().min(20).max(600).optional(),
  paco2: z.coerce.number().min(10).max(150).optional(),
  hco3: z.coerce.number().min(0).max(80).optional(),
  baseExcess: z.coerce.number().min(-40).max(40).optional(),
  lactate: z.coerce.number().min(0).max(40).optional(),
  fio2AtSample: z.coerce.number().gt(0).max(1).optional(),
  spo2AtSample: z.coerce.number().min(40).max(100).optional(),
  source: optionalString(80),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: z.coerce.date().optional(),
  idempotencyKey,
});

const ventilatorBody = z.object({
  measuredAt: z.coerce.date().optional(),
  mode: optionalString(80),
  tidalVolumeMl: z.coerce.number().min(1).max(3000).optional(),
  respiratoryRateSet: z.coerce.number().min(0).max(120).optional(),
  respiratoryRateMeasured: z.coerce.number().min(0).max(180).optional(),
  fio2: z.coerce.number().gt(0).max(1).optional(),
  peep: z.coerce.number().min(0).max(30).optional(),
  pressureSupport: z.coerce.number().min(0).max(80).optional(),
  inspiratoryPressure: z.coerce.number().min(0).max(100).optional(),
  peakPressure: z.coerce.number().min(0).max(100).optional(),
  plateauPressure: z.coerce.number().min(0).max(60).optional(),
  ieRatio: optionalString(40),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: z.coerce.date().optional(),
  idempotencyKey,
});

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
    admittedAt: z.coerce.date().optional(),
    admissionSource: optionalString(120),
    reasonForVentilation: optionalString(500),
    patient: patientPayload,
    clinicalSnapshot: clinicalSnapshotBody.omit({ idempotencyKey: true }).optional(),
    abgTest: abgBody.omit({ idempotencyKey: true }).optional(),
    ventilatorSetting: ventilatorBody.omit({ idempotencyKey: true }).optional(),
    airwayDevice: z.lazy(() => airwayBody.omit({ idempotencyKey: true })).optional(),
    humidification: z.lazy(() => humidificationBody.omit({ idempotencyKey: true })).optional(),
    clientRecordId: optionalString(120),
    deviceId: optionalString(120),
    clientCreatedAt: z.coerce.date().optional(),
    clientUpdatedAt: z.coerce.date().optional(),
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
    clientUpdatedAt: z.coerce.date().optional(),
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
  query: z.object({}).optional(),
});

export const ventilatorSettingSchema = z.object({
  body: ventilatorBody,
  params: idParam,
  query: z.object({}).optional(),
});

const airwayBody = z.object({
  measuredAt: z.coerce.date().optional(),
  airwayRoute: optionalString(80),
  tubeType: optionalString(80),
  internalDiameterMm: z.coerce.number().min(0).max(20).optional(),
  depthCm: z.coerce.number().min(0).max(60).optional(),
  cuffPressureCmH2O: z.coerce.number().min(0).max(120).optional(),
  tubeSecured: optionalBoolean,
  notes: optionalClinicalText(2000),
  clientRecordId: optionalString(120),
  deviceId: optionalString(120),
  clientCreatedAt: z.coerce.date().optional(),
  idempotencyKey,
});

export const airwayDeviceSchema = z.object({
  body: airwayBody,
  params: idParam,
  query: z.object({}).optional(),
});

const humidificationBody = z.object({
  measuredAt: z.coerce.date().optional(),
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
  clientCreatedAt: z.coerce.date().optional(),
  idempotencyKey,
});

export const humidificationSchema = z.object({
  body: humidificationBody,
  params: idParam,
  query: z.object({}).optional(),
});

export const dailyReviewSchema = z.object({
  body: z.object({
    reviewDate: z.coerce.date().optional(),
    oxygenationStable: optionalBoolean,
    hemodynamicsStable: optionalBoolean,
    sedationLightEnough: optionalBoolean,
    secretionsManageable: optionalBoolean,
    sbtStatus: optionalString(80),
    sbtFailureReason: optionalString(500),
    proneStatus: optionalString(80),
    vapBundleJson: jsonObject.optional(),
    clientRecordId: optionalString(120),
    deviceId: optionalString(120),
    clientCreatedAt: z.coerce.date().optional(),
    idempotencyKey,
  }),
  params: idParam,
  query: z.object({}).optional(),
});

export const outcomeSchema = z.object({
  body: z.object({
    outcomeType: z.enum(['EXTUBATED', 'TRANSFERRED', 'DISCHARGED', 'DECEASED', 'STILL_ADMITTED', 'OTHER']),
    outcomeDate: z.coerce.date().optional(),
    ventilatorDays: z.coerce.number().min(0).max(3650).optional(),
    icuLengthOfStayDays: z.coerce.number().min(0).max(3650).optional(),
    hospitalLengthOfStayDays: z.coerce.number().min(0).max(3650).optional(),
    reintubationWithin48h: optionalBoolean,
    tracheostomy: optionalBoolean,
    vapSuspected: optionalBoolean,
    notes: optionalClinicalText(2000),
    clientRecordId: optionalString(120),
    deviceId: optionalString(120),
    clientCreatedAt: z.coerce.date().optional(),
    idempotencyKey,
  }),
  params: idParam,
  query: z.object({}).optional(),
});
