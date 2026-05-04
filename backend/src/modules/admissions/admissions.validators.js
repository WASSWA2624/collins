import { z } from 'zod';

const optionalString = (max = 255) => z.string().trim().max(max).optional();
const optionalNumber = z.coerce.number().finite().optional();
const optionalBoolean = z.coerce.boolean().optional();

export const admissionListSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    facilityId: z.string().min(1).optional(),
    status: z.enum(['ACTIVE', 'TRANSFERRED', 'DISCHARGED', 'DECEASED', 'CANCELLED']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const admissionIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});

export const createAdmissionSchema = z.object({
  body: z.object({
    facilityId: z.string().min(1),
    bedNumber: optionalString(80),
    admittedAt: z.coerce.date().optional(),
    admissionSource: optionalString(120),
    reasonForVentilation: optionalString(500),
    patient: z.object({
      appPatientCode: optionalString(80),
      optionalName: optionalString(160),
      hospitalNumber: optionalString(120),
      patientPathway: z.enum([
        'NEONATE', 'INFANT', 'CHILD', 'ADOLESCENT', 'ADULT', 'OBSTETRIC',
        'BURNS', 'TRAUMA', 'PERI_OPERATIVE', 'MEDICAL', 'SURGICAL', 'OTHER',
      ]),
      dateOfBirth: z.coerce.date().optional(),
      ageYears: z.coerce.number().int().min(0).max(130).optional(),
      ageMonths: z.coerce.number().int().min(0).max(1560).optional(),
      estimatedAge: z.coerce.boolean().optional(),
      gestationalAgeWeeks: z.coerce.number().min(20).max(50).optional(),
      correctedAgeWeeks: z.coerce.number().min(20).max(80).optional(),
      sexForSizeCalculations: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).optional(),
      actualWeightKg: z.coerce.number().min(0.2).max(400).optional(),
      heightOrLengthCm: z.coerce.number().min(20).max(260).optional(),
      referenceWeightKg: z.coerce.number().min(0.2).max(400).optional(),
      referenceWeightMethod: optionalString(120),
    }),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const clinicalSnapshotSchema = z.object({
  body: z.object({
    measuredAt: z.coerce.date().optional(),
    heartRate: optionalNumber,
    respiratoryRate: optionalNumber,
    systolicBp: optionalNumber,
    diastolicBp: optionalNumber,
    meanArterialPressure: optionalNumber,
    temperatureC: optionalNumber,
    spo2: optionalNumber,
    fio2: optionalNumber,
    gcs: optionalNumber,
    avpu: optionalString(40),
    rass: optionalNumber,
    mainCondition: optionalString(240),
    comorbiditiesJson: z.record(z.string(), z.unknown()).optional(),
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});

export const abgTestSchema = z.object({
  body: z.object({
    collectedAt: z.coerce.date().optional(),
    ph: z.coerce.number().min(6.5).max(8).optional(),
    pao2: optionalNumber,
    paco2: optionalNumber,
    hco3: optionalNumber,
    baseExcess: optionalNumber,
    lactate: optionalNumber,
    fio2AtSample: optionalNumber,
    spo2AtSample: optionalNumber,
    source: optionalString(80),
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});

export const ventilatorSettingSchema = z.object({
  body: z.object({
    measuredAt: z.coerce.date().optional(),
    mode: optionalString(80),
    tidalVolumeMl: optionalNumber,
    respiratoryRateSet: optionalNumber,
    respiratoryRateMeasured: optionalNumber,
    fio2: optionalNumber,
    peep: optionalNumber,
    pressureSupport: optionalNumber,
    inspiratoryPressure: optionalNumber,
    peakPressure: optionalNumber,
    plateauPressure: optionalNumber,
    ieRatio: optionalString(40),
    minuteVolumeLMin: optionalNumber,
    vtMlPerKgReferenceWeight: optionalNumber,
    drivingPressure: optionalNumber,
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});

export const airwayDeviceSchema = z.object({
  body: z.object({
    measuredAt: z.coerce.date().optional(),
    airwayRoute: optionalString(80),
    tubeType: optionalString(80),
    internalDiameterMm: optionalNumber,
    depthCm: optionalNumber,
    cuffPressureCmH2O: optionalNumber,
    tubeSecured: optionalBoolean,
    notes: optionalString(2000),
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});

export const humidificationSchema = z.object({
  body: z.object({
    measuredAt: z.coerce.date().optional(),
    method: optionalString(80),
    thickSecretions: optionalBoolean,
    highMinuteVentilation: optionalBoolean,
    hypothermia: optionalBoolean,
    airwayBleeding: optionalBoolean,
    expectedLongVentilation: optionalBoolean,
    suggestedOption: optionalString(120),
    confirmedOption: optionalString(120),
  }),
  params: z.object({ id: z.string().min(1) }),
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
    vapBundleJson: z.record(z.string(), z.unknown()).optional(),
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});

export const outcomeSchema = z.object({
  body: z.object({
    outcomeType: z.enum(['EXTUBATED', 'TRANSFERRED', 'DISCHARGED', 'DECEASED', 'STILL_ADMITTED', 'OTHER']),
    outcomeDate: z.coerce.date().optional(),
    ventilatorDays: optionalNumber,
    icuLengthOfStayDays: optionalNumber,
    hospitalLengthOfStayDays: optionalNumber,
    reintubationWithin48h: optionalBoolean,
    tracheostomy: optionalBoolean,
    vapSuspected: optionalBoolean,
    notes: optionalString(2000),
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});
