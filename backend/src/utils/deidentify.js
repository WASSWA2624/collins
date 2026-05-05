const IDENTIFIER_KEYS = new Set([
  'id',
  'patientId',
  'admissionId',
  'facilityId',
  'sourceAdmissionId',
  'userId',
  'enteredByUserId',
  'reviewedByUserId',
  'confirmedByUserId',
  'createdByUserId',
  'approvedByUserId',
  'reviewerUserId',
  'clientRecordId',
  'deviceId',
  'idempotencyKey',
  'registryCode',
  'dateOfBirth',
  'tokenHash',
  'passwordHash',
  'name',
  'optionalName',
  'hospitalNumber',
  'appPatientCode',
  'appAdmissionCode',
  'phone',
  'email',
  'address',
  'nextOfKin',
  'nationalId',
  'patientName',
  'patientIdentifier',
  'mrn',
  'medicalRecordNumber',
  'dob',
  'birthDate',
  'rawNote',
  'notes',
]);

const looksLikeIdentifier = (key) => {
  const normalized = key.toLowerCase();
  return /name|phone|email|address|hospital|identifier|national|kin|rawnote|note/i.test(normalized)
    || normalized === 'id'
    || normalized === 'mrn'
    || normalized === 'dob'
    || normalized.includes('medicalrecord')
    || normalized.includes('birthdate')
    || normalized.endsWith('userid')
    || normalized.endsWith('recordid')
    || normalized.endsWith('deviceid')
    || normalized.endsWith('patientid')
    || normalized.endsWith('admissionid');
};

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

export const findIdentifierPaths = (value, path = []) => {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => findIdentifierPaths(entry, [...path, String(index)]));
  }

  if (!value || typeof value !== 'object' || value instanceof Date) return [];

  return Object.entries(value).flatMap(([key, entry]) => {
    const nextPath = [...path, key];
    if (IDENTIFIER_KEYS.has(key) || looksLikeIdentifier(key)) return [nextPath.join('.')];
    return findIdentifierPaths(entry, nextPath);
  });
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
