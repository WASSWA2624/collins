const IDENTIFIER_KEYS = new Set([
  'name',
  'optionalName',
  'hospitalNumber',
  'phone',
  'email',
  'address',
  'nextOfKin',
  'nationalId',
  'patientName',
  'patientIdentifier',
  'rawNote',
  'notes',
]);

const looksLikeIdentifier = (key) => /name|phone|email|address|hospital|identifier|national|kin|rawnote|note/i.test(key);

export const deidentifyPayload = (value) => {
  if (Array.isArray(value)) return value.map(deidentifyPayload);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.entries(value).reduce((acc, [key, entry]) => {
      if (IDENTIFIER_KEYS.has(key) || looksLikeIdentifier(key)) return acc;
      acc[key] = deidentifyPayload(entry);
      return acc;
    }, {});
  }
  return value;
};

export const buildDatasetPayloadFromAdmission = (admission) => deidentifyPayload({
  admission: {
    id: admission.id,
    appAdmissionCode: admission.appAdmissionCode,
    admittedAt: admission.admittedAt,
    status: admission.status,
    reasonForVentilation: admission.reasonForVentilation,
  },
  patient: {
    patientPathway: admission.patient?.patientPathway,
    ageYears: admission.patient?.ageYears,
    ageMonths: admission.patient?.ageMonths,
    estimatedAge: admission.patient?.estimatedAge,
    gestationalAgeWeeks: admission.patient?.gestationalAgeWeeks,
    correctedAgeWeeks: admission.patient?.correctedAgeWeeks,
    sexForSizeCalculations: admission.patient?.sexForSizeCalculations,
    actualWeightKg: admission.patient?.actualWeightKg,
    heightOrLengthCm: admission.patient?.heightOrLengthCm,
    referenceWeightKg: admission.patient?.referenceWeightKg,
    referenceWeightMethod: admission.patient?.referenceWeightMethod,
  },
  clinicalSnapshots: admission.clinicalSnapshots,
  abgTests: admission.abgTests,
  ventilatorSettings: admission.ventilatorSettings,
  airwayDevices: admission.airwayDevices,
  humidificationDecisions: admission.humidificationDecisions,
  dailyReviews: admission.dailyReviews,
  outcomes: admission.outcomes,
});
