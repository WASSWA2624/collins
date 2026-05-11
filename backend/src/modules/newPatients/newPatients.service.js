import { prisma } from '../../config/prisma.js';
import { assertAdmissionAccess, assertFacilityRole, resolveFacilityScope, REVIEW_ROLES, WRITE_ROLES } from '../../utils/authorization.js';
import { badRequest, conflict, forbidden, notFound, reviewerRequired } from '../../utils/errors.js';
import { writeAudit } from '../../utils/audit.js';
import { resolveIdempotency, storeIdempotencyResult } from '../../utils/idempotency.js';
import { sha256 } from '../../utils/crypto.js';
import { isPlainObject, stripUndefined } from '../../utils/object.js';
import { calculateReferenceWeight } from '../../clinical/calculations.js';
import { calculateHumidificationFlags, calculateVentilationSummary, interpretAbg } from '../../clinical/flags.js';
import { listActiveReferenceRangeRecords } from '../references/references.service.js';

const toJson = (value) => JSON.parse(JSON.stringify(value));

export const latestOnly = { orderBy: { measuredAt: 'desc' }, take: 1 };

export const newPatientInclude = {
  patient: true,
  facility: {
    select: {
      id: true,
      name: true,
      registryCode: true,
      district: true,
      region: true,
      verificationStatus: true,
      abgAvailability: true,
    },
  },
  clinicalSnapshots: { orderBy: { measuredAt: 'desc' }, take: 5 },
  abgTests: { orderBy: { collectedAt: 'desc' }, take: 1 },
  ventilatorSettings: latestOnly,
  airwayDevices: latestOnly,
  humidificationDecisions: latestOnly,
  dailyReviews: { orderBy: { reviewDate: 'desc' }, take: 1 },
  outcomes: { orderBy: { createdAt: 'desc' }, take: 1 },
};

export const fullNewPatientInclude = {
  ...newPatientInclude,
  clinicalSnapshots: { orderBy: { measuredAt: 'desc' } },
  abgTests: { orderBy: { version: 'desc' } },
  ventilatorSettings: { orderBy: { version: 'desc' } },
  airwayDevices: { orderBy: { measuredAt: 'desc' } },
  humidificationDecisions: { orderBy: { measuredAt: 'desc' } },
  dailyReviews: { orderBy: { reviewDate: 'desc' } },
  outcomes: { orderBy: { createdAt: 'desc' } },
};

const createPatientCode = () => `COL-P-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const createNewPatientCode = () => `COL-A-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const patientReferenceFields = new Set([
  'patientPathway',
  'ageYears',
  'ageMonths',
  'gestationalAgeWeeks',
  'correctedAgeWeeks',
  'sexForSizeCalculations',
  'actualWeightKg',
  'heightOrLengthCm',
  'referenceWeightKg',
  'referenceWeightMethod',
]);
const admissionPatchFields = ['bedNumber', 'admissionSource', 'reasonForVentilation', 'status', 'clientUpdatedAt'];
const THREE_STEP_FLOW_VERSION = 'three-step-new-patient-flow@2026-05-10';
const THREE_STEP_SOURCE = 'three_step_new_patient_flow';
const ABG_UPDATE_VALUE_FIELDS = [
  'ph',
  'pao2',
  'paco2',
  'hco3',
  'baseExcess',
  'lactate',
  'spo2AtSample',
];
const VENTILATOR_UPDATE_VALUE_FIELDS = [
  'mode',
  'tidalVolumeMl',
  'respiratoryRateSet',
  'respiratoryRateMeasured',
  'peep',
  'pressureSupport',
  'inspiratoryPressure',
  'peakPressure',
  'plateauPressure',
  'ieRatio',
];
const REMOVED_NEW_PATIENT_FIELDS = new Set(['fio2', 'fio2AtSample', 'ventilatorFio2']);

const withoutIdempotency = (data = {}) => {
  const rest = { ...data };
  delete rest.idempotencyKey;
  delete rest.overrideReason;
  for (const field of REMOVED_NEW_PATIENT_FIELDS) delete rest[field];
  return stripUndefined(rest);
};

const withoutRemovedNewPatientFields = (record = {}) => {
  if (!isPlainObject(record)) return record;
  const data = { ...record };
  for (const field of REMOVED_NEW_PATIENT_FIELDS) delete data[field];
  return data;
};

const cleanNewPatientRecord = (record) => {
  const cleaned = stripNullish(withoutRemovedNewPatientFields(record || {}));
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
};

const stripRemovedFieldsFromNewPatientPayload = (payload = {}) => stripUndefined({
  ...payload,
  clinicalSnapshot: payload.clinicalSnapshot ? cleanNewPatientRecord(payload.clinicalSnapshot) : payload.clinicalSnapshot,
  oxygen: payload.oxygen ? cleanNewPatientRecord(payload.oxygen) : payload.oxygen,
  abg: payload.abg ? cleanNewPatientRecord(payload.abg) : payload.abg,
  abgTest: payload.abgTest ? cleanNewPatientRecord(payload.abgTest) : payload.abgTest,
  ventilator: payload.ventilator ? cleanNewPatientRecord(payload.ventilator) : payload.ventilator,
  ventilatorSetting: payload.ventilatorSetting ? cleanNewPatientRecord(payload.ventilatorSetting) : payload.ventilatorSetting,
});

const getOverrideReason = (payload = {}) => {
  const reason = payload.overrideReason?.trim();
  return reason || null;
};

const resolveNewPatientCreateFacilityId = async (userId, requestedFacilityId) => {
  const facilityId = await resolveFacilityScope(userId, cleanText(requestedFacilityId) || undefined, WRITE_ROLES);
  if (!facilityId) throw forbidden('Facility scope is required to create a New Patient record');
  return facilityId;
};

const hasKeys = (value) => Object.keys(value || {}).length > 0;
const hasClinicalValue = (record, fields) =>
  Boolean(record && fields.some((field) => record[field] !== undefined && record[field] !== null));

const stripNullish = (value) => {
  if (Array.isArray(value)) return value.map(stripNullish).filter((item) => item !== undefined && item !== null);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined && entryValue !== null)
        .map(([key, entryValue]) => [key, stripNullish(entryValue)])
        .filter(([, entryValue]) => entryValue !== undefined && entryValue !== null)
    );
  }
  return value;
};

const hasOwn = (value, field) => Object.prototype.hasOwnProperty.call(value || {}, field);

const withDefaultTimestamp = (record = {}, field = 'measuredAt') => {
  const data = stripNullish(record);
  if (!hasKeys(data) || data[field]) return data;
  return { ...data, [field]: new Date() };
};

const cleanText = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
};

const uniqueStringList = (items = []) => [...new Set(
  (Array.isArray(items) ? items : [])
    .map((item) => cleanText(item))
    .filter(Boolean)
)];

const normalizeFieldKey = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

const deriveScopedToken = (base, suffix, maxLength) => {
  const trimmedBase = cleanText(base);
  if (!trimmedBase) return undefined;

  const candidate = `${trimmedBase}:${suffix}`;
  if (candidate.length <= maxLength) return candidate;

  const hash = sha256(candidate).slice(0, 16);
  return `${trimmedBase.slice(0, maxLength - hash.length - 1)}:${hash}`;
};

const deriveStepIdempotencyKey = (base, suffix) => deriveScopedToken(base, suffix, 160);
const deriveStepClientRecordId = (base, suffix) => deriveScopedToken(base, suffix, 120);

const normalizeUncertainty = (uncertainty = null) => {
  if (!isPlainObject(uncertainty)) return null;
  const fields = uniqueStringList(uncertainty.fields);
  const reason = cleanText(uncertainty.reason);
  const notes = cleanText(uncertainty.notes);
  const isUncertain = uncertainty.isUncertain === true || fields.length > 0 || Boolean(reason || notes);

  if (!isUncertain) return null;
  return stripUndefined({
    isUncertain,
    fields,
    reason,
    notes,
  });
};

const normalizeDeviceContext = (payload = {}) => {
  const context = isPlainObject(payload.deviceContext) ? payload.deviceContext : {};
  const normalized = stripUndefined({
    deviceId: cleanText(context.deviceId) || cleanText(payload.deviceId),
    source: cleanText(context.source),
    oxygenSource: cleanText(context.oxygenSource),
    ventilatorType: cleanText(context.ventilatorType),
    facilityDeviceLabel: cleanText(context.facilityDeviceLabel),
  });
  return hasKeys(normalized) ? normalized : null;
};

const mergeNewPatientFlowMetadata = (existingJson, updates = {}) => {
  const base = isPlainObject(existingJson) ? existingJson : {};
  const previousFlow = isPlainObject(base.newPatientFlow)
    ? base.newPatientFlow
    : isPlainObject(base.admissionFlow)
      ? base.admissionFlow
      : {};
  const rest = { ...base };
  delete rest.admissionFlow;
  return stripNullish({
    ...rest,
    newPatientFlow: {
      ...previousFlow,
      flowVersion: THREE_STEP_FLOW_VERSION,
      ...updates,
      updatedAt: new Date().toISOString(),
    },
  });
};

const extractNewPatientFlowMetadata = (admission = {}) => {
  const snapshots = admission.clinicalSnapshots || [];
  for (const snapshot of snapshots) {
    const flow = snapshot?.comorbiditiesJson?.newPatientFlow || snapshot?.comorbiditiesJson?.admissionFlow;
    if (isPlainObject(flow)) return flow;
  }
  return {};
};

const buildStepWriteMetadata = (record, payload, suffix, { includeSource = false, includeClientUpdatedAt = false } = {}) => {
  const { clientUpdatedAt, source, ...baseRecord } = record || {};
  const deviceContext = normalizeDeviceContext(payload) || {};
  return stripNullish({
    ...baseRecord,
    ...(includeSource ? { source: source || deviceContext.source } : {}),
    clientRecordId: baseRecord.clientRecordId || deriveStepClientRecordId(payload.clientRecordId, suffix),
    clientCreatedAt: baseRecord.clientCreatedAt || payload.clientCreatedAt,
    ...(includeClientUpdatedAt ? { clientUpdatedAt: clientUpdatedAt || payload.clientUpdatedAt } : {}),
    deviceId: baseRecord.deviceId || deviceContext.deviceId || payload.deviceId,
    idempotencyKey: deriveStepIdempotencyKey(payload.idempotencyKey, suffix),
    overrideReason: payload.overrideReason,
  });
};

const normalizePatientForStorage = (patient = {}) => {
  const data = { ...patient };
  const existingName = cleanText(data.optionalName);
  const firstName = cleanText(data.firstName);
  const lastName = cleanText(data.lastName);

  if (!firstName && existingName) {
    const [first, ...rest] = existingName.split(/\s+/);
    data.firstName = cleanText(first);
    data.lastName = cleanText(data.lastName) || cleanText(rest.join(' '));
  } else {
    data.firstName = firstName;
    data.lastName = lastName;
  }

  data.optionalName = cleanText([data.firstName, data.lastName].filter(Boolean).join(' ')) || existingName;

  const ageYears = Number(data.ageYears);
  if (Number.isFinite(ageYears)) {
    data.ageYears = Math.trunc(ageYears);
    if (data.ageMonths == null && ageYears >= 0 && ageYears < 2) {
      data.ageMonths = Math.round(ageYears * 12);
    }
  }
  const ageMonths = Number(data.ageMonths);
  if (Number.isFinite(ageMonths)) {
    data.ageMonths = Math.trunc(ageMonths);
  }
  const ageDays = Number(data.ageDays);
  if (Number.isFinite(ageDays)) {
    data.ageDays = Math.trunc(ageDays);
  }
  return data;
};

const normalizePatientUpdateForStorage = (currentPatient = {}, patientPatch = {}) => {
  const data = { ...patientPatch };
  const hasNamePatch = ['firstName', 'lastName', 'optionalName'].some((field) => hasOwn(data, field));
  if (!hasNamePatch) return data;

  const optionalNameProvided = hasOwn(data, 'optionalName');
  const nameFields = normalizePatientForStorage({
    optionalName: optionalNameProvided ? data.optionalName : currentPatient.optionalName,
    firstName: hasOwn(data, 'firstName')
      ? data.firstName
      : optionalNameProvided
        ? undefined
        : currentPatient.firstName,
    lastName: hasOwn(data, 'lastName')
      ? data.lastName
      : optionalNameProvided
        ? undefined
        : currentPatient.lastName,
  });

  return {
    ...data,
    firstName: nameFields.firstName,
    lastName: nameFields.lastName,
    optionalName: nameFields.optionalName,
  };
};

const preparePatientData = (patient) => {
  const patientData = normalizePatientForStorage(patient);
  const reference = calculateReferenceWeight(patientData);
  return stripUndefined({
    ...patientData,
    appPatientCode: patientData.appPatientCode || createPatientCode(),
    referenceWeightKg: reference.value ?? patientData.referenceWeightKg,
    referenceWeightMethod: reference.method ?? patientData.referenceWeightMethod,
  });
};

const preparePatientUpdateData = (currentPatient, patientPatch = {}) => {
  const patientData = stripUndefined(normalizePatientUpdateForStorage(currentPatient, patientPatch));
  if (!hasKeys(patientData)) return null;
  if (patientData.appPatientCode === null) delete patientData.appPatientCode;
  if (!hasKeys(patientData)) return null;

  const shouldRecalculateReference = Object.keys(patientData).some((field) => patientReferenceFields.has(field));
  if (!shouldRecalculateReference) return patientData;

  const reference = calculateReferenceWeight({ ...currentPatient, ...patientData });
  return stripUndefined({
    ...patientData,
    referenceWeightKg: reference.value,
    referenceWeightMethod: reference.method,
  });
};

const pickNewPatientPatchData = (data) => stripUndefined(Object.fromEntries(
  admissionPatchFields.map((field) => [field, data[field]])
));

const clinicalSnapshotValueFields = [
  'spo2',
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

const hasRecordedClinicalSnapshotValue = (snapshot = {}) =>
  clinicalSnapshotValueFields.some((field) => snapshot[field] !== null && snapshot[field] !== undefined && snapshot[field] !== '');

const getNewPatientRecordForSummary = (admission) => {
  const clinicalSnapshots = admission.clinicalSnapshots || [];
  return {
    patient: admission.patient,
    latestSnapshot: clinicalSnapshots.find(hasRecordedClinicalSnapshotValue) || clinicalSnapshots[0] || null,
    latestAbg: admission.abgTests?.[0] || null,
    latestVentilator: admission.ventilatorSettings?.[0] || null,
    latestAirway: admission.airwayDevices?.[0] || null,
    latestHumidification: admission.humidificationDecisions?.[0] || null,
  };
};

const resolveDecisionSupportReferenceRanges = async (facilityId, { tx = prisma, allowDevelopmentFallback = true } = {}) => (
  listActiveReferenceRangeRecords({
    facilityId,
    client: tx,
    allowDevelopmentFallback,
  })
);

const buildReferenceRangeStatus = (referenceRanges) => {
  if (referenceRanges === undefined) {
    return {
      status: 'development_fallback_unconfirmed',
      verifiedOnly: true,
      pendingBackendConfirmation: true,
      message: 'Development fallback ranges were used; backend reference confirmation is pending.',
    };
  }

  if (!Array.isArray(referenceRanges) || referenceRanges.length === 0) {
    return {
      status: 'missing_verified_records',
      verifiedOnly: true,
      pendingBackendConfirmation: true,
      message: 'No active verified backend reference range records were available for this summary.',
    };
  }

  if (referenceRanges.some((range) => range.source === 'development_fallback_no_reference_repository')) {
    return {
      status: 'development_fallback_unconfirmed',
      verifiedOnly: true,
      pendingBackendConfirmation: true,
      message: 'Development fallback ranges were used because the reference repository was unavailable in this runtime.',
    };
  }

  return {
    status: 'backend_verified',
    verifiedOnly: true,
    pendingBackendConfirmation: false,
    message: 'Calculated with active verified backend reference range records.',
  };
};

export const buildClinicalSummary = (admission, { referenceRanges } = {}) => {
  const { patient, latestSnapshot, latestAbg, latestVentilator, latestHumidification } = getNewPatientRecordForSummary(admission);
  const activeReferenceRanges = Array.isArray(referenceRanges) ? referenceRanges : undefined;
  const ventilationSummary = calculateVentilationSummary({
    patient,
    ventilator: latestVentilator || {},
    latestAbg,
    latestSnapshot,
    ...(activeReferenceRanges ? { referenceRanges: activeReferenceRanges } : {}),
  });
  const abgSummary = latestAbg
    ? interpretAbg(latestAbg, patient, activeReferenceRanges ? { referenceRanges: activeReferenceRanges } : {})
    : null;
  const humidificationFlags = latestHumidification ? calculateHumidificationFlags(latestHumidification) : [];

  return {
    ...ventilationSummary,
    abg: abgSummary,
    humidificationFlags,
    missingData: buildMissingData(admission),
    referenceRangeStatus: buildReferenceRangeStatus(activeReferenceRanges),
  };
};

const buildMissingData = (admission) => {
  const missing = [];
  const { patient, latestSnapshot } = getNewPatientRecordForSummary(admission);
  if (!patient?.patientPathway || ['UNKNOWN', 'OTHER'].includes(patient.patientPathway)) missing.push('patientPathway');
  if (patient?.actualWeightKg == null && patient?.referenceWeightKg == null) missing.push('actualWeightKg/referenceWeightKg');
  if (latestSnapshot?.spo2 == null) missing.push('SpO2');
  return missing;
};

const isMissingFieldPermitted = (field, permittedFields) => {
  const normalizedField = normalizeFieldKey(field);
  return permittedFields.some((permittedField) => {
    const normalizedPermitted = normalizeFieldKey(permittedField);
    return normalizedField === normalizedPermitted
      || normalizedField.includes(normalizedPermitted)
      || normalizedPermitted.includes(normalizedField);
  });
};

const getClinicalFlags = (clinicalSummary = {}) => [
  ...(clinicalSummary.flags || []),
  ...(clinicalSummary.abg?.flags || []),
  ...(clinicalSummary.humidificationFlags || []),
];

export const buildNewPatientReadiness = (admission) => {
  const clinicalSummary = admission.clinicalSummary || buildClinicalSummary(admission);
  const flowMetadata = extractNewPatientFlowMetadata(admission);
  const permittedMissingFields = uniqueStringList(flowMetadata.permittedMissingFields);
  const uncertainty = normalizeUncertainty(flowMetadata.uncertainty);
  const clinicalFlags = getClinicalFlags(clinicalSummary);

  const missingWarnings = (clinicalSummary.missingData || []).map((field) => {
    const permitted = isMissingFieldPermitted(field, permittedMissingFields);
    return {
      code: permitted ? 'PERMITTED_MISSING_DATA' : 'MISSING_DATA',
      severity: permitted ? 'info' : 'yellow',
      field,
      message: permitted
        ? `${field} is documented as unavailable; review when it becomes available.`
        : `${field} is missing; saving is allowed, but clinician review should confirm the gap.`,
    };
  });

  const uncertaintyWarnings = uncertainty ? [{
    code: 'EXPLICIT_UNCERTAINTY',
    severity: 'yellow',
    fields: uncertainty.fields || [],
    message: 'Uncertain values were documented; clinician review should confirm them.',
    reason: uncertainty.reason,
  }] : [];

  const clinicalWarnings = clinicalFlags.map((flag) => ({
    code: flag.code,
    severity: flag.severity || 'info',
    field: flag.field,
    message: flag.message,
    ruleVersion: flag.ruleVersion,
  }));

  const warnings = [...missingWarnings, ...uncertaintyWarnings, ...clinicalWarnings];

  return {
    flowVersion: THREE_STEP_FLOW_VERSION,
    isReadyToSave: true,
    needsReview: warnings.some((warning) => ['red', 'yellow'].includes(warning.severity)),
    missingData: clinicalSummary.missingData || [],
    permittedMissingFields,
    uncertainty,
    warnings,
    blockers: [],
    safetyStatement: clinicalSummary.safetyStatement,
  };
};

const buildThreeStepNewPatientResponse = (step, admission, extra = {}, { referenceRanges } = {}) => {
  const clinicalSummary = admission.clinicalSummary || buildClinicalSummary(admission, { referenceRanges });
  const admissionWithSummary = admission.clinicalSummary ? admission : { ...admission, clinicalSummary };

  return toJson({
    step,
    admission: admissionWithSummary,
    clinicalSummary,
    readiness: buildNewPatientReadiness(admissionWithSummary),
    ...extra,
  });
};

const RECOMMENDATION_DATASET_SELECT = {
  id: true,
  facilityId: true,
  sourceType: true,
  sourcePayloadJson: true,
  structuredPreviewJson: true,
  deidentifiedPayloadJson: true,
  reviewStatus: true,
  approvedForTraining: true,
  datasetVersion: true,
  reviewedAt: true,
  ethicsApprovalId: true,
  governanceJson: true,
};

const RECOMMENDATION_UNITS = Object.freeze({
  tidalVolume: 'mL',
  peep: 'cmH2O',
  respiratoryRate: 'breaths/min',
  ieRatio: '',
  pressureSupport: 'cmH2O',
  inspiratoryPressure: 'cmH2O',
  peakPressure: 'cmH2O',
  plateauPressure: 'cmH2O',
});

const RECOMMENDATION_NUMERIC_FIELDS = Object.freeze([
  { field: 'ageYears', weight: 0.08, width: 100 },
  { field: 'ageMonths', weight: 0.03, width: 1560 },
  { field: 'ageDays', weight: 0.03, width: 47450 },
  { field: 'actualWeightKg', weight: 0.08, width: 120 },
  { field: 'heightOrLengthCm', weight: 0.04, width: 120 },
  { field: 'spo2', weight: 0.25, width: 50 },
  { field: 'respiratoryRate', weight: 0.18, width: 60 },
  { field: 'heartRate', weight: 0.13, width: 180 },
  { field: 'ph', weight: 0.08, width: 1 },
  { field: 'pao2', weight: 0.05, width: 200 },
  { field: 'paco2', weight: 0.05, width: 110 },
]);

const RECOMMENDATION_REQUIRED_INPUTS = Object.freeze(['condition', 'spo2', 'respiratoryRate', 'heartRate']);

const RECOMMENDATION_SOURCE_CATEGORY_LABELS = Object.freeze({
  online_data: 'Online data',
  research_based_data: 'Research-based data',
  clinician_approved_data: 'Clinician-approved data',
  unknown: 'Unknown source',
});

const ADULT_RECOMMENDATION_PATHWAYS = new Set(['ADULT', 'MEDICAL', 'SURGICAL', 'PERI_OPERATIVE', 'TRAUMA', 'BURNS', 'OBSTETRIC']);
const PEDIATRIC_RECOMMENDATION_PATHWAYS = new Set(['INFANT', 'CHILD', 'ADOLESCENT']);

const normalizeRecommendationSourceCategory = (value) => {
  const token = String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (token === 'online' || token === 'online_dataset') return 'online_data';
  if (token === 'research' || token === 'research_based' || token === 'research_paper') return 'research_based_data';
  if (token === 'clinician' || token === 'clinician_approved' || token === 'local_protocol') return 'clinician_approved_data';
  return RECOMMENDATION_SOURCE_CATEGORY_LABELS[token] ? token : 'unknown';
};

const getRecommendationSourceCategoryLabel = (category) =>
  RECOMMENDATION_SOURCE_CATEGORY_LABELS[normalizeRecommendationSourceCategory(category)] || RECOMMENDATION_SOURCE_CATEGORY_LABELS.unknown;

const clampNumber = (value, min, max) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(min, Math.min(max, numeric));
};

const roundToDigits = (value, digits = 1) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  const factor = 10 ** digits;
  return Math.round(numeric * factor) / factor;
};

const asFiniteNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const firstPresent = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return null;
};

const pickLatestRecordWithValue = (records = [], fields = []) => {
  const list = Array.isArray(records) ? records : [];
  return list.find((record) =>
    record && fields.some((field) => record[field] !== undefined && record[field] !== null && record[field] !== '')
  ) || list[0] || {};
};

const normalizeTokenSet = (value) => new Set(
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .map((item) => item.trim())
    .filter((item) => item.length >= 3)
);

const calculateTextSimilarity = (left, right) => {
  const a = normalizeTokenSet(left);
  const b = normalizeTokenSet(right);
  if (a.size === 0 || b.size === 0) return null;

  let overlap = 0;
  a.forEach((token) => {
    if (b.has(token)) overlap += 1;
  });
  return overlap / Math.max(a.size, b.size);
};

const normalizeRecommendationInput = (input = {}) => stripNullish({
  condition: cleanText(input.condition) || cleanText(input.reasonForSupport),
  patientPathway: cleanText(input.patientPathway),
  sexForSizeCalculations: cleanText(input.sexForSizeCalculations),
  ageYears: asFiniteNumber(input.ageYears),
  ageMonths: asFiniteNumber(input.ageMonths),
  ageDays: asFiniteNumber(input.ageDays),
  actualWeightKg: asFiniteNumber(input.actualWeightKg),
  heightOrLengthCm: asFiniteNumber(input.heightOrLengthCm),
  spo2: asFiniteNumber(firstPresent(input.spo2, input.spo2AtSample)),
  respiratoryRate: asFiniteNumber(input.respiratoryRate),
  heartRate: asFiniteNumber(input.heartRate),
  ph: asFiniteNumber(input.ph),
  pao2: asFiniteNumber(input.pao2),
  paco2: asFiniteNumber(input.paco2),
  mode: cleanText(input.mode),
  tidalVolumeMl: asFiniteNumber(input.tidalVolumeMl),
  respiratoryRateSet: asFiniteNumber(input.respiratoryRateSet),
  respiratoryRateMeasured: asFiniteNumber(input.respiratoryRateMeasured),
  peep: asFiniteNumber(input.peep),
  pressureSupport: asFiniteNumber(input.pressureSupport),
  inspiratoryPressure: asFiniteNumber(input.inspiratoryPressure),
  peakPressure: asFiniteNumber(input.peakPressure),
  plateauPressure: asFiniteNumber(input.plateauPressure),
  ieRatio: cleanText(input.ieRatio),
});

const buildRecommendationSettingsFromRecord = (record = {}) => stripNullish({
  mode: cleanText(record.mode),
  tidalVolume: asFiniteNumber(firstPresent(record.tidalVolume, record.tidalVolumeMl)),
  respiratoryRate: asFiniteNumber(firstPresent(record.respiratoryRate, record.respiratoryRateSet)),
  peep: asFiniteNumber(record.peep),
  ieRatio: cleanText(record.ieRatio),
  pressureSupport: asFiniteNumber(record.pressureSupport),
  inspiratoryPressure: asFiniteNumber(record.inspiratoryPressure),
  peakPressure: asFiniteNumber(record.peakPressure),
  plateauPressure: asFiniteNumber(record.plateauPressure),
});

const buildRecommendationSourceList = (...sourceGroups) => {
  const sources = sourceGroups
    .flatMap((group) => Array.isArray(group) ? group : [])
    .filter((source) => source && typeof source === 'object');
  const seen = new Set();
  return sources
    .map((source) => stripNullish({
      id: cleanText(source.id),
      type: cleanText(source.type),
      citation: cleanText(source.citation),
      doi: cleanText(source.doi),
      url: cleanText(source.url),
      publisher: cleanText(source.publisher),
      trustLevel: cleanText(source.trustLevel),
      reviewStatus: cleanText(source.reviewStatus),
      sourceCategory: normalizeRecommendationSourceCategory(source.sourceCategory),
    }))
    .filter((source) => {
      const key = source.id || source.url || source.doi || source.citation;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const arrayOfStrings = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => cleanText(item))
    .filter(Boolean);

const extractDatasetRecommendationCandidate = (datasetCase = {}) => {
  const deidentified = isPlainObject(datasetCase.deidentifiedPayloadJson) ? datasetCase.deidentifiedPayloadJson : {};
  const preview = isPlainObject(datasetCase.structuredPreviewJson) ? datasetCase.structuredPreviewJson : {};
  const governance = isPlainObject(datasetCase.governanceJson) ? datasetCase.governanceJson : {};
  const payload = hasKeys(deidentified) ? deidentified : preview;

  const patient = payload.patient || preview.patient || {};
  const snapshot =
    payload.clinicalSnapshot ||
    payload.oxygen ||
    preview.clinicalSnapshot ||
    pickLatestRecordWithValue(payload.clinicalSnapshots, ['spo2', 'respiratoryRate', 'heartRate']);
  const abg =
    payload.abgTest ||
    payload.abg ||
    preview.abgTest ||
    pickLatestRecordWithValue(payload.abgTests, ['ph', 'pao2', 'paco2']);
  const ventilator =
    payload.ventilatorSetting ||
    payload.ventilator ||
    preview.ventilatorSetting ||
    pickLatestRecordWithValue(payload.ventilatorSettings, ['mode', 'tidalVolumeMl', 'respiratoryRateSet', 'peep']);
  const recommendations = payload.recommendations || preview.recommendations || {};
  const evidence = payload.evidence || preview.evidence || {};
  const recommendationSource = governance.recommendationSource || {};

  const settings = buildRecommendationSettingsFromRecord(ventilator);
  if (!hasKeys(settings)) return null;

  const condition = firstPresent(
    payload.caseContext?.reasonForVentilation,
    payload.caseContext?.primaryDiagnosis,
    preview.caseContext?.reasonForVentilation,
    preview.caseContext?.primaryDiagnosis,
    payload.admission?.reasonForVentilation,
    snapshot?.mainCondition
  );
  const sourceCategory = normalizeRecommendationSourceCategory(firstPresent(
    recommendationSource.category,
    governance.sourceCategory,
    evidence.sourceCategory,
    recommendations.sourceCategory,
    payload.caseContext?.sourceCategory,
    preview.sourceCategory
  ));
  const sourceIds = arrayOfStrings([
    ...(Array.isArray(recommendationSource.sourceIds) ? recommendationSource.sourceIds : []),
    ...(Array.isArray(evidence.sourceIds) ? evidence.sourceIds : []),
  ]);
  const sources = buildRecommendationSourceList(recommendationSource.sources, evidence.sources);

  return stripNullish({
    datasetCaseId: datasetCase.id,
    datasetVersion: datasetCase.datasetVersion,
    sourceType: cleanText(datasetCase.sourceType),
    ethicsApprovalId: cleanText(datasetCase.ethicsApprovalId),
    reviewedAt: datasetCase.reviewedAt,
    sourceCategory,
    sourceCategoryLabel: getRecommendationSourceCategoryLabel(sourceCategory),
    sourceIds,
    sources,
    sourceNote: cleanText(evidence.notes) || cleanText(recommendationSource.notes),
    condition: cleanText(condition),
    patientPathway: cleanText(patient.patientPathway),
    sexForSizeCalculations: cleanText(patient.sexForSizeCalculations),
    clinicalParameters: {
      ageYears: asFiniteNumber(patient.ageYears),
      ageMonths: asFiniteNumber(patient.ageMonths),
      ageDays: asFiniteNumber(patient.ageDays),
      actualWeightKg: asFiniteNumber(firstPresent(patient.actualWeightKg, patient.referenceWeightKg)),
      heightOrLengthCm: asFiniteNumber(patient.heightOrLengthCm),
      spo2: asFiniteNumber(firstPresent(snapshot?.spo2, abg?.spo2AtSample)),
      respiratoryRate: asFiniteNumber(snapshot?.respiratoryRate),
      heartRate: asFiniteNumber(snapshot?.heartRate),
      ph: asFiniteNumber(abg?.ph),
      pao2: asFiniteNumber(abg?.pao2),
      paco2: asFiniteNumber(abg?.paco2),
    },
    settings,
    monitoringPoints: arrayOfStrings(recommendations.monitoringPoints),
    riskFactors: arrayOfStrings(recommendations.riskFactors),
  });
};

const getBaseMissingRecommendationInputs = (input = {}) =>
  RECOMMENDATION_REQUIRED_INPUTS.filter((field) => {
    if (field === 'condition') return !cleanText(input.condition);
    return !Number.isFinite(input[field]);
  });

const scoreDatasetRecommendationCandidate = (input, candidate) => {
  let weighted = 0;
  let usedWeight = 0;
  let availableWeight = 0;

  const addScore = (weight, similarity) => {
    availableWeight += weight;
    if (!Number.isFinite(similarity)) return;
    usedWeight += weight;
    weighted += Math.max(0, Math.min(1, similarity)) * weight;
  };

  const conditionSimilarity = calculateTextSimilarity(input.condition, candidate.condition);
  if (cleanText(input.condition)) addScore(0.14, conditionSimilarity);

  if (cleanText(input.patientPathway)) {
    const exactPathway = cleanText(input.patientPathway) === cleanText(candidate.patientPathway);
    addScore(0.04, cleanText(candidate.patientPathway) ? (exactPathway ? 1 : 0.25) : null);
  }

  RECOMMENDATION_NUMERIC_FIELDS.forEach(({ field, weight, width }) => {
    const inputValue = input[field];
    if (!Number.isFinite(inputValue)) return;
    availableWeight += weight;
    const candidateValue = candidate.clinicalParameters?.[field];
    if (!Number.isFinite(candidateValue)) return;
    usedWeight += weight;
    weighted += (1 - Math.min(1, Math.abs(inputValue - candidateValue) / width)) * weight;
  });

  const score = usedWeight > 0 ? weighted / usedWeight : 0;
  const completeness = availableWeight > 0 ? usedWeight / availableWeight : 0;
  const confidenceTier = score >= 0.85 && completeness >= 0.75
    ? 'high'
    : score >= 0.7 && completeness >= 0.5
      ? 'medium'
      : 'low';

  return {
    caseId: candidate.datasetCaseId,
    score: Math.round(score * 1000000) / 1000000,
    completeness: Math.round(completeness * 1000000) / 1000000,
    confidenceTier,
  };
};

const isConditionText = (input, candidate, pattern) =>
  pattern.test(`${input.condition || ''} ${candidate?.condition || ''}`);

const getTidalVolumeTarget = (input, candidate) => {
  const pathway = cleanText(input.patientPathway || candidate?.patientPathway).toUpperCase();
  const severeHypoxemic = isConditionText(input, candidate, /ards|sepsis|pneumonia|hypoxemic/i);

  if (pathway === 'NEONATE') {
    return {
      targetMlPerKg: 5,
      minMlPerKg: 4,
      maxMlPerKg: 6,
      rationale: 'neonatal_volume_targeted_range',
    };
  }

  if (PEDIATRIC_RECOMMENDATION_PATHWAYS.has(pathway)) {
    return {
      targetMlPerKg: severeHypoxemic ? 6 : 6.5,
      minMlPerKg: 5,
      maxMlPerKg: severeHypoxemic ? 7 : 8,
      rationale: severeHypoxemic ? 'pediatric_lung_protective_range' : 'pediatric_initial_physiologic_range',
    };
  }

  if (ADULT_RECOMMENDATION_PATHWAYS.has(pathway) || pathway === 'UNKNOWN' || pathway === 'OTHER') {
    return {
      targetMlPerKg: severeHypoxemic ? 6 : 6.5,
      minMlPerKg: 4,
      maxMlPerKg: 8,
      rationale: severeHypoxemic ? 'adult_lung_protective_pbw_range' : 'adult_initial_pbw_range',
    };
  }

  return {
    targetMlPerKg: 6,
    minMlPerKg: 4,
    maxMlPerKg: 8,
    rationale: 'general_reference_weight_range',
  };
};

const getReferenceWeightForRecommendation = (input) => {
  const patient = stripNullish({
    patientPathway: cleanText(input.patientPathway) || 'UNKNOWN',
    sexForSizeCalculations: cleanText(input.sexForSizeCalculations) || 'UNKNOWN',
    ageYears: asFiniteNumber(input.ageYears),
    ageMonths: asFiniteNumber(input.ageMonths),
    ageDays: asFiniteNumber(input.ageDays),
    actualWeightKg: asFiniteNumber(input.actualWeightKg),
    heightOrLengthCm: asFiniteNumber(input.heightOrLengthCm),
  });
  return calculateReferenceWeight(patient);
};

const getReferenceWeightMissingInputs = (input = {}) => {
  const reference = getReferenceWeightForRecommendation(input);
  if (Number.isFinite(reference.value)) return [];

  const pathway = cleanText(input.patientPathway).toUpperCase();
  if (ADULT_RECOMMENDATION_PATHWAYS.has(pathway)) {
    const missing = [];
    if (!Number.isFinite(input.heightOrLengthCm)) missing.push('heightOrLengthCm');
    if (!['MALE', 'FEMALE'].includes(cleanText(input.sexForSizeCalculations).toUpperCase())) {
      missing.push('sexForSizeCalculations');
    }
    return missing;
  }

  if (pathway === 'NEONATE' || PEDIATRIC_RECOMMENDATION_PATHWAYS.has(pathway)) {
    return Number.isFinite(input.actualWeightKg) ? [] : ['actualWeightKg'];
  }

  return ['patientPathway'];
};

const getMissingRecommendationInputs = (input = {}) => [
  ...new Set([
    ...getBaseMissingRecommendationInputs(input),
    ...getReferenceWeightMissingInputs(input),
  ]),
];

const respiratoryRateRangeFor = (input, candidate) => {
  const pathway = cleanText(input.patientPathway || candidate?.patientPathway).toUpperCase();
  const obstructive = isConditionText(input, candidate, /copd|asthma|hypercapnic/i);

  if (pathway === 'NEONATE') return { min: 25, max: 60 };
  if (pathway === 'INFANT') return { min: 20, max: 45 };
  if (pathway === 'CHILD') return { min: 14, max: 35 };
  if (pathway === 'ADOLESCENT') return { min: 10, max: 30 };
  if (obstructive) return { min: 8, max: 16 };
  return { min: 10, max: 30 };
};

const peepRangeFor = (input, candidate) => {
  const pathway = cleanText(input.patientPathway || candidate?.patientPathway).toUpperCase();
  const severeHypoxemic = isConditionText(input, candidate, /ards|sepsis|pneumonia|hypoxemic/i);
  const obstructive = isConditionText(input, candidate, /copd|asthma|hypercapnic/i);

  if (pathway === 'NEONATE') return { min: 4, max: severeHypoxemic ? 8 : 6 };
  if (pathway === 'INFANT') return { min: 5, max: severeHypoxemic ? 12 : 8 };
  if (pathway === 'CHILD' || pathway === 'ADOLESCENT') return { min: 5, max: severeHypoxemic ? 14 : 10 };
  if (obstructive) return { min: 3, max: 8 };
  return { min: 5, max: severeHypoxemic ? 14 : 10 };
};

const isPressureSupportMode = (mode) =>
  /psv|pressure\s*support|simv|cpap|bipap|niv/i.test(cleanText(mode));

const comfortRespiratoryRateRangeFor = (input, candidate) => {
  const pathway = cleanText(input.patientPathway || candidate?.patientPathway).toUpperCase();
  if (pathway === 'NEONATE') return { min: 25, max: 60 };
  if (pathway === 'INFANT') return { min: 20, max: 45 };
  if (pathway === 'CHILD') return { min: 14, max: 35 };
  if (pathway === 'ADOLESCENT') return { min: 10, max: 28 };
  return { min: 8, max: 30 };
};

const patientBreathingComfortably = (input, candidate) => {
  const rrRange = comfortRespiratoryRateRangeFor(input, candidate);
  const rr = asFiniteNumber(firstPresent(
    input.respiratoryRate,
    candidate?.clinicalParameters?.respiratoryRate
  ));
  const spo2 = asFiniteNumber(firstPresent(input.spo2, candidate?.clinicalParameters?.spo2));
  const ph = asFiniteNumber(firstPresent(input.ph, candidate?.clinicalParameters?.ph));
  const paco2 = asFiniteNumber(firstPresent(input.paco2, candidate?.clinicalParameters?.paco2));
  const obstructiveOrHypercapnic = isConditionText(input, candidate, /copd|asthma|hypercapnic/i);

  const rrComfortable = Number.isFinite(rr) && rr >= rrRange.min && rr <= rrRange.max;
  const spo2Comfortable = Number.isFinite(spo2) && spo2 >= (obstructiveOrHypercapnic ? 88 : 92);
  const phComfortable = !Number.isFinite(ph) || ph >= 7.3;
  const co2Comfortable = !Number.isFinite(paco2) || paco2 <= (obstructiveOrHypercapnic ? 65 : 50);

  return rrComfortable && spo2Comfortable && phComfortable && co2Comfortable;
};

const pressureSupportRangeFor = (input, candidate, baseSettings) => {
  if (!isPressureSupportMode(baseSettings?.mode)) return null;
  const pathway = cleanText(input.patientPathway || candidate?.patientPathway).toUpperCase();
  const comfortable = patientBreathingComfortably(input, candidate);
  if (pathway === 'NEONATE') {
    return {
      min: 4,
      max: comfortable ? 6 : 8,
      rationale: comfortable ? 'neonatal_low_assist_if_spontaneous' : 'neonatal_pressure_support_cap',
    };
  }

  return {
    min: 5,
    max: comfortable ? 8 : 12,
    rationale: comfortable ? 'low_assist_for_comfortable_spontaneous_breathing' : 'bounded_pressure_support_for_distress',
  };
};

const applyRecommendationGuardrails = ({ input, candidate }) => {
  const baseSettings = candidate?.settings || {};
  const target = getTidalVolumeTarget(input, candidate);
  const referenceWeight = getReferenceWeightForRecommendation(input);
  const referenceWeightKg = asFiniteNumber(referenceWeight.value);
  const candidateTidalVolume = asFiniteNumber(baseSettings.tidalVolume);
  const tidalVolumeRangeMl = Number.isFinite(referenceWeightKg)
    ? {
      min: Math.round(referenceWeightKg * target.minMlPerKg),
      max: Math.round(referenceWeightKg * target.maxMlPerKg),
    }
    : null;
  const targetTidalVolume = Number.isFinite(referenceWeightKg)
    ? Math.round(referenceWeightKg * target.targetMlPerKg)
    : null;
  const guardedTidalVolume = tidalVolumeRangeMl && Number.isFinite(targetTidalVolume)
    ? Math.round(clampNumber(targetTidalVolume, tidalVolumeRangeMl.min, tidalVolumeRangeMl.max))
    : null;
  const respiratoryRateRange = respiratoryRateRangeFor(input, candidate);
  const peepRange = peepRangeFor(input, candidate);
  const respiratoryRate = clampNumber(baseSettings.respiratoryRate, respiratoryRateRange.min, respiratoryRateRange.max);
  const peep = clampNumber(baseSettings.peep, peepRange.min, peepRange.max);
  const pressureSupportRange = pressureSupportRangeFor(input, candidate, baseSettings);
  const datasetPressureSupport = asFiniteNumber(baseSettings.pressureSupport);
  const pressureSupport = pressureSupportRange && Number.isFinite(datasetPressureSupport)
    ? clampNumber(datasetPressureSupport, pressureSupportRange.min, pressureSupportRange.max)
    : null;

  return {
    settings: stripNullish({
      ...baseSettings,
      tidalVolume: guardedTidalVolume,
      respiratoryRate,
      peep,
      pressureSupport,
    }),
    calculation: stripNullish({
      referenceWeightKg,
      referenceWeightMethod: cleanText(referenceWeight.method),
      referenceWeightStatus: cleanText(referenceWeight.status),
      targetTidalVolumeMlPerKg: target.targetMlPerKg,
      tidalVolumeMlPerKg: Number.isFinite(referenceWeightKg) && Number.isFinite(guardedTidalVolume)
        ? roundToDigits(guardedTidalVolume / referenceWeightKg, 1)
        : null,
      tidalVolumeRangeMl,
      targetRationale: target.rationale,
      datasetTidalVolumeMl: candidateTidalVolume,
      appliedGuardrail: Number.isFinite(candidateTidalVolume)
        ? candidateTidalVolume !== guardedTidalVolume
        : Number.isFinite(guardedTidalVolume),
      respiratoryRateRange,
      peepRange,
      pressureSupportRange,
      datasetPressureSupport,
      pressureSupportAppliedGuardrail: Number.isFinite(datasetPressureSupport)
        ? datasetPressureSupport !== pressureSupport
        : false,
    }),
  };
};

const buildNoDatasetRecommendation = ({ input, candidateCount = 0 }) => ({
  source: {
    type: 'backend_dataset',
    confidenceTier: 'low',
    matchCount: candidateCount,
    sourceCategory: 'unknown',
    sourceCategoryLabel: getRecommendationSourceCategoryLabel('unknown'),
    missingInputs: getMissingRecommendationInputs(input),
  },
  safety: {
    intendedUseWarning: 'Approved dataset cases did not contain enough comparable ventilator settings for this input.',
    validationRequirement: 'Clinician review is required before applying any ventilator settings.',
    clinicianVisibleModelOutput: false,
  },
  units: RECOMMENDATION_UNITS,
  initialVentilatorSettings: {
    source: null,
    settings: null,
  },
  monitoringPoints: [],
  riskFactors: [],
  complicationHistory: [],
  additionalTestPrompts: [],
  nextActions: [],
  decisionProvenance: {
    reviewStatus: 'approved_dataset_cases',
    sourceNote: 'No sufficiently comparable approved dataset case was available.',
  },
  governance: {
    ruleBasedMvp: true,
    caseMatchingHiddenFromClinicians: true,
    onlineAiClinicianPathEnabled: false,
    patientIdentifiersSentToExternalModelServices: false,
  },
  missingInputs: getMissingRecommendationInputs(input),
});

const buildDatasetRecommendation = ({ input, candidates, ranked }) => {
  const top = ranked[0] || null;
  if (!top) return buildNoDatasetRecommendation({ input, candidateCount: candidates.length });

  const primaryCase = candidates.find((candidate) => candidate.datasetCaseId === top.caseId);
  if (!primaryCase) return buildNoDatasetRecommendation({ input, candidateCount: candidates.length });
  const guarded = applyRecommendationGuardrails({ input, candidate: primaryCase });
  const missingInputs = getMissingRecommendationInputs(input);

  return {
    source: {
      type: 'backend_dataset',
      confidenceTier: top.confidenceTier,
      matchCount: ranked.length,
      matchedCaseId: primaryCase.datasetCaseId,
      datasetVersion: primaryCase.datasetVersion,
      sourceCategory: primaryCase.sourceCategory,
      sourceCategoryLabel: primaryCase.sourceCategoryLabel,
      sourceIds: primaryCase.sourceIds || [],
      sources: primaryCase.sources || [],
      missingInputs,
    },
    safety: {
      intendedUseWarning: 'Suggested from facility-approved, de-identified dataset cases. This is decision support, not an order.',
      validationRequirement: 'Clinician review is required before applying ventilator settings.',
      clinicianVisibleModelOutput: false,
    },
    units: RECOMMENDATION_UNITS,
    initialVentilatorSettings: {
      source: 'datasetCase.ventilatorSetting + patient-specific guardrails',
      settings: guarded.settings,
      calculation: guarded.calculation,
    },
    monitoringPoints: primaryCase.monitoringPoints || [],
    riskFactors: primaryCase.riskFactors || [],
    complicationHistory: [],
    additionalTestPrompts: [],
    nextActions: [],
    decisionProvenance: {
      reviewStatus: 'approved_for_training',
      datasetCaseId: primaryCase.datasetCaseId,
      datasetVersion: primaryCase.datasetVersion,
      sourceCategory: primaryCase.sourceCategory,
      sourceCategoryLabel: primaryCase.sourceCategoryLabel,
      sourceType: primaryCase.sourceType,
      sourceIds: primaryCase.sourceIds || [],
      sources: primaryCase.sources || [],
      ethicsApprovalId: primaryCase.ethicsApprovalId,
      reviewedAt: primaryCase.reviewedAt,
      sourceNote: primaryCase.sourceNote || 'Matched against approved, de-identified dataset cases in this facility.',
      match: top,
    },
    governance: {
      ruleBasedMvp: true,
      caseMatchingHiddenFromClinicians: true,
      onlineAiClinicianPathEnabled: false,
      patientIdentifiersSentToExternalModelServices: false,
    },
    missingInputs,
  };
};

export const recommendNewPatientVentilatorSettings = async (payload = {}, userId) => {
  const facilityId = await resolveFacilityScope(userId, cleanText(payload.facilityId) || undefined, WRITE_ROLES);
  if (!facilityId) throw forbidden('Facility scope is required to generate New Patient ventilator recommendations');

  const input = normalizeRecommendationInput(payload.input);
  const datasetCases = await prisma.datasetCase.findMany({
    where: {
      facilityId,
      approvedForTraining: true,
      reviewStatus: 'APPROVED_FOR_TRAINING',
    },
    select: RECOMMENDATION_DATASET_SELECT,
    orderBy: { reviewedAt: 'desc' },
    take: 1000,
  });

  const candidates = datasetCases
    .map(extractDatasetRecommendationCandidate)
    .filter(Boolean);
  const ranked = candidates
    .map((candidate) => scoreDatasetRecommendationCandidate(input, candidate))
    .filter((match) => match.completeness > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.completeness !== a.completeness) return b.completeness - a.completeness;
      return String(a.caseId || '').localeCompare(String(b.caseId || ''));
    })
    .slice(0, 5);

  return toJson({
    recommendation: buildDatasetRecommendation({ input, candidates, ranked }),
    source: {
      type: 'backend_dataset',
      datasetCaseCount: datasetCases.length,
      candidateCount: candidates.length,
      matchCount: ranked.length,
    },
    missingInputs: getMissingRecommendationInputs(input),
  });
};

const buildPatientReasonSnapshot = (payload) => {
  const clinicalReason = isPlainObject(payload.clinicalReason) ? payload.clinicalReason : {};
  const comorbiditiesJson = isPlainObject(clinicalReason.comorbiditiesJson) ? clinicalReason.comorbiditiesJson : {};
  const specialConditionsJson = isPlainObject(clinicalReason.specialConditionsJson) ? clinicalReason.specialConditionsJson : undefined;
  const reasonForSupport = cleanText(payload.reasonForVentilation) || cleanText(payload.reasonForSupport);

  return stripNullish({
    measuredAt: payload.admittedAt,
    mainCondition: cleanText(clinicalReason.mainCondition) || reasonForSupport,
    comorbiditiesJson: mergeNewPatientFlowMetadata({
      ...comorbiditiesJson,
      specialConditionsJson,
    }, {
      step: 'patient_reason',
      permittedMissingFields: uniqueStringList(payload.permittedMissingFields),
      reasonForSupport,
    }),
    source: `${THREE_STEP_SOURCE}:patient_reason`,
    clientRecordId: deriveStepClientRecordId(payload.clientRecordId, 'patient-reason'),
    deviceId: payload.deviceId,
    clientCreatedAt: payload.clientCreatedAt,
  });
};

const applyClinicalSnapshotFlowMetadata = (record, admission, payload) => {
  const existingFlow = extractNewPatientFlowMetadata(admission);
  const uncertainty = normalizeUncertainty(payload.uncertainty) || existingFlow.uncertainty || null;
  const deviceContext = normalizeDeviceContext(payload) || existingFlow.deviceContext || null;

  return stripNullish({
    ...record,
    source: record?.source || `${THREE_STEP_SOURCE}:oxygen_abg_ventilator`,
    comorbiditiesJson: mergeNewPatientFlowMetadata(record?.comorbiditiesJson, {
      ...existingFlow,
      step: 'oxygen_abg_ventilator',
      uncertainty,
      deviceContext,
    }),
  });
};

const toValidDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const decisionSupportPrompts = {
  AbgTest: 'Review ABG pattern, oxygenation ratios, and trend before documenting clinician interpretation.',
  VentilatorSetting: 'Review calculated safety values, airway pressure trend, and patient pathway before documenting clinician plan.',
};

const buildDecisionSupport = (entityType, record) => {
  if (!decisionSupportPrompts[entityType]) return {};

  const advisoryChecks = Array.isArray(record?.clinicalFlagsJson) ? record.clinicalFlagsJson : [];
  const reviewPrompts = [decisionSupportPrompts[entityType]];

  if (record?.validationStatus === 'impossible') {
    reviewPrompts.unshift('Correct impossible values or request reviewer override before clinical use.');
  } else if (advisoryChecks.some((flag) => flag.severity === 'red')) {
    reviewPrompts.unshift('Urgent clinician review is needed for red advisory checks.');
  }

  return {
    decisionSupport: {
      advisoryChecks,
      reviewPrompts,
    },
  };
};

const assertNoStaleClientAppend = ({ entityType, admission, payload, latest, timestampField }) => {
  const clientUpdatedAt = toValidDate(payload.clientUpdatedAt);
  const serverCreatedAt = toValidDate(latest?.createdAt);

  if (!clientUpdatedAt || !serverCreatedAt || clientUpdatedAt >= serverCreatedAt) return;

  throw conflict('Stale client timestamp for append-only clinical event', [
    {
      path: 'body.clientUpdatedAt',
      message: 'Refresh the admission timeline before submitting this offline clinical event.',
    },
  ], toJson(stripUndefined({
    status: 'conflict',
    conflictType: 'STALE_CLIENT_TIMESTAMP',
    entityType,
    admissionId: admission.id,
    facilityId: admission.facilityId,
    clientRecordId: payload.clientRecordId,
    clientUpdatedAt,
    serverRecord: stripUndefined({
      id: latest.id,
      version: latest.version,
      createdAt: latest.createdAt,
      [timestampField]: latest[timestampField],
      clientRecordId: latest.clientRecordId,
      clientUpdatedAt: latest.clientUpdatedAt,
    }),
    clientPayload: withoutIdempotency(payload),
  })));
};

const assertNoReviewedOverwrite = async (tx, admissionId, userId, { allowClinicianOverride = false, overrideReason = null } = {}) => {
  const admission = await tx.admission.findUnique({
    where: { id: admissionId },
    select: { id: true, facilityId: true, reviewStatus: true },
  });
  if (!admission) throw notFound('New Patient record not found');

  if (admission.reviewStatus === 'APPROVED') {
    try {
      await assertFacilityRole(userId, admission.facilityId, REVIEW_ROLES);
    } catch {
      if (allowClinicianOverride && overrideReason) {
        return {
          ...admission,
          overrideApplied: true,
          overrideReason,
        };
      }
      throw reviewerRequired('Reviewed clinical data cannot be overwritten; submit a new append-only record with overrideReason or request reviewer correction.', [], {
        status: 'needs_review',
        overrideRequired: true,
        reasonField: 'overrideReason',
      });
    }
  }
  return {
    ...admission,
    overrideApplied: false,
    overrideReason: null,
  };
};

export const listNewPatients = async (userId, { facilityId, status, reviewStatus, patientPathway, page, limit }) => {
  const scopedFacilityId = await resolveFacilityScope(userId, facilityId);
  const where = {
    ...(scopedFacilityId ? { facilityId: scopedFacilityId } : {}),
    ...(status ? { status } : {}),
    ...(reviewStatus ? { reviewStatus } : {}),
    ...(patientPathway ? { patient: { patientPathway } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.admission.findMany({
      where,
      include: newPatientInclude,
      orderBy: { admittedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.admission.count({ where }),
  ]);
  const referenceRanges = await resolveDecisionSupportReferenceRanges(scopedFacilityId, { allowDevelopmentFallback: false });

  return {
    items: items.map((admission) => ({
      ...admission,
      clinicalSummary: buildClinicalSummary(admission, { referenceRanges }),
    })),
    total,
    page,
    limit,
  };
};

export const createNewPatient = async (payload, createdByUserId, auditContext = {}) => {
  const facilityId = await resolveNewPatientCreateFacilityId(createdByUserId, payload.facilityId);
  const admissionPayload = stripRemovedFieldsFromNewPatientPayload({
    ...payload,
    facilityId,
  });

  return prisma.$transaction(async (tx) => {
    const idem = await resolveIdempotency({
      tx,
      userId: createdByUserId,
      facilityId,
      key: admissionPayload.idempotencyKey,
      operation: 'admission.create',
      payload: admissionPayload,
    });
    if (!idem.shouldRun) return { ...idem.responseJson, syncStatus: 'duplicate' };

    const patientData = preparePatientData(admissionPayload.patient);
    const createdPatient = await tx.patient.create({
      data: { ...patientData, facilityId },
    });

    const admission = await tx.admission.create({
      data: stripUndefined({
        patientId: createdPatient.id,
        facilityId,
        appAdmissionCode: admissionPayload.appAdmissionCode || createNewPatientCode(),
        bedNumber: admissionPayload.bedNumber,
        admittedAt: admissionPayload.admittedAt,
        admissionSource: admissionPayload.admissionSource,
        reasonForVentilation: admissionPayload.reasonForVentilation,
        createdByUserId,
        clientRecordId: admissionPayload.clientRecordId,
        deviceId: admissionPayload.deviceId,
        clientCreatedAt: admissionPayload.clientCreatedAt,
        clientUpdatedAt: admissionPayload.clientUpdatedAt,
      }),
    });
    const referenceRanges = await resolveDecisionSupportReferenceRanges(facilityId, { tx });

    if (admissionPayload.clinicalSnapshot) {
      await tx.clinicalSnapshot.create({
        data: stripUndefined({
          admissionId: admission.id,
          ...withoutIdempotency(admissionPayload.clinicalSnapshot),
          enteredByUserId: createdByUserId,
          validationStatus: 'valid_or_missing',
        }),
      });
    }

    if (admissionPayload.abgTest) {
      const abgInterpretation = interpretAbg(admissionPayload.abgTest, createdPatient, { referenceRanges });
      await tx.abgTest.create({
        data: stripUndefined({
          admissionId: admission.id,
          version: 1,
          ...withoutIdempotency(admissionPayload.abgTest),
          enteredByUserId: createdByUserId,
          validationStatus: abgInterpretation.flags.some((flag) => flag.code === 'IMPOSSIBLE_VALUE') ? 'impossible' : 'valid_or_suspicious',
          clinicalFlagsJson: abgInterpretation.flags,
          calculationSummaryJson: { pfRatio: abgInterpretation.pfRatio, sfRatio: abgInterpretation.sfRatio },
        }),
      });
    }

    if (admissionPayload.ventilatorSetting) {
      const latestAbg = admissionPayload.abgTest || null;
      const latestSnapshot = admissionPayload.clinicalSnapshot || null;
      const summary = calculateVentilationSummary({
        patient: createdPatient,
        ventilator: admissionPayload.ventilatorSetting,
        latestAbg,
        latestSnapshot,
        referenceRanges,
      });
      await tx.ventilatorSetting.create({
        data: stripUndefined({
          admissionId: admission.id,
          version: 1,
          ...withoutIdempotency(admissionPayload.ventilatorSetting),
          minuteVolumeLMin: summary.minuteVentilation.value,
          vtMlPerKgReferenceWeight: summary.vtPerKg.value,
          drivingPressure: summary.drivingPressure.value,
          enteredByUserId: createdByUserId,
          validationStatus: summary.flags.some((flag) => flag.code === 'IMPOSSIBLE_VALUE') ? 'impossible' : 'valid_or_suspicious',
          clinicalFlagsJson: summary.flags,
          calculationSummaryJson: summary,
        }),
      });
    }

    if (admissionPayload.airwayDevice) {
      await tx.airwayDevice.create({
        data: stripUndefined({
          admissionId: admission.id,
          ...withoutIdempotency(admissionPayload.airwayDevice),
          enteredByUserId: createdByUserId,
          validationStatus: 'valid_or_missing',
        }),
      });
    }

    if (admissionPayload.humidification) {
      const humidificationFlags = calculateHumidificationFlags(admissionPayload.humidification);
      await tx.humidificationDecision.create({
        data: stripUndefined({
          admissionId: admission.id,
          ...withoutIdempotency(admissionPayload.humidification),
          confirmedByUserId: createdByUserId,
          clinicalFlagsJson: humidificationFlags,
        }),
      });
    }

    const created = await tx.admission.findUnique({ where: { id: admission.id }, include: newPatientInclude });
    const responseJson = toJson({
      admission: created,
      clinicalSummary: buildClinicalSummary(created, { referenceRanges }),
      syncStatus: 'synced',
    });

    await storeIdempotencyResult({
      tx,
      userId: createdByUserId,
      facilityId,
      key: admissionPayload.idempotencyKey,
      operation: 'admission.create',
      requestHash: idem.requestHash,
      responseJson,
      entityType: 'Admission',
      entityId: admission.id,
      clientRecordId: admissionPayload.clientRecordId,
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId: createdByUserId,
      facilityId,
      action: 'ADMISSION_CREATE',
      entityType: 'Admission',
      entityId: admission.id,
      afterJson: responseJson,
    });

    return responseJson;
  });
};

export const getNewPatientById = async (userId, id) => {
  const admissionAccess = await assertAdmissionAccess(userId, id);
  const admission = await prisma.admission.findUnique({ where: { id }, include: fullNewPatientInclude });
  if (!admission) throw notFound('New Patient record not found');
  if (admission.facilityId !== admissionAccess.facilityId) throw notFound('New Patient record not found');
  const referenceRanges = await resolveDecisionSupportReferenceRanges(admission.facilityId, { allowDevelopmentFallback: false });
  return { ...admission, clinicalSummary: buildClinicalSummary(admission, { referenceRanges }) };
};

export const createNewPatientReasonStep = async (payload, userId, auditContext = {}) => {
  const admissionPayload = stripNullish({
    facilityId: payload.facilityId,
    appAdmissionCode: payload.appAdmissionCode,
    bedNumber: payload.bedNumber,
    admittedAt: payload.admittedAt,
    admissionSource: payload.admissionSource,
    reasonForVentilation: cleanText(payload.reasonForVentilation) || cleanText(payload.reasonForSupport),
    patient: payload.patient,
    clinicalSnapshot: buildPatientReasonSnapshot(payload),
    clientRecordId: payload.clientRecordId,
    deviceId: payload.deviceId,
    clientCreatedAt: payload.clientCreatedAt,
    clientUpdatedAt: payload.clientUpdatedAt,
    idempotencyKey: payload.idempotencyKey,
  });

  const result = await createNewPatient(admissionPayload, userId, auditContext);
  const admissionId = result.admission?.id;
  const admission = admissionId ? await getNewPatientById(userId, admissionId) : result.admission;
  const response = buildThreeStepNewPatientResponse('patient_reason', admission, {
    facilityId: admission?.facilityId || payload.facilityId,
    syncStatus: result.syncStatus || 'synced',
  });

  if (admissionId && result.syncStatus !== 'duplicate') {
    await writeAudit({
      ...auditContext,
      userId,
      facilityId: admission.facilityId,
      action: 'ADMISSION_THREE_STEP_PATIENT_REASON',
      entityType: 'Admission',
      entityId: admissionId,
      afterJson: response,
    });
  }

  return response;
};

export const saveNewPatientOxygenAbgVentilatorStep = async (userId, admissionId, payload, auditContext = {}) => {
  await assertAdmissionAccess(userId, admissionId, WRITE_ROLES);
  const admission = await getNewPatientById(userId, admissionId);
  const saved = {};
  const writeStatuses = [];

  const oxygenRecord = stripNullish(withoutRemovedNewPatientFields(payload.oxygen || payload.clinicalSnapshot || {}));
  const shouldStoreFlowSnapshot = hasKeys(stripNullish({
    uncertainty: normalizeUncertainty(payload.uncertainty),
    deviceContext: normalizeDeviceContext(payload),
  }));

  if (hasKeys(oxygenRecord) || shouldStoreFlowSnapshot) {
    const clinicalSnapshotPayload = buildStepWriteMetadata(
      withDefaultTimestamp(applyClinicalSnapshotFlowMetadata(oxygenRecord, admission, payload)),
      payload,
      'oxygen',
      { includeSource: true }
    );
    const result = await addClinicalSnapshot(userId, admissionId, clinicalSnapshotPayload, auditContext);
    saved.clinicalSnapshot = result.clinicalSnapshot;
    writeStatuses.push(result.syncStatus || 'synced');
  }

  const abgRecord = stripNullish(withoutRemovedNewPatientFields(payload.abg || payload.abgTest || {}));
  if (hasKeys(abgRecord)) {
    const abgPayload = buildStepWriteMetadata(abgRecord, payload, 'abg', {
      includeSource: true,
      includeClientUpdatedAt: true,
    });
    const result = await addAbgTest(userId, admissionId, abgPayload, auditContext);
    saved.abgTest = result.abgTest;
    writeStatuses.push(result.syncStatus || 'synced');
  }

  const ventilatorRecord = stripNullish(withoutRemovedNewPatientFields(payload.ventilator || payload.ventilatorSetting || {}));
  if (hasKeys(ventilatorRecord)) {
    const ventilatorPayload = buildStepWriteMetadata(ventilatorRecord, payload, 'ventilator', {
      includeSource: true,
      includeClientUpdatedAt: true,
    });
    const result = await addVentilatorSetting(userId, admissionId, ventilatorPayload, auditContext);
    saved.ventilatorSetting = result.ventilatorSetting;
    writeStatuses.push(result.syncStatus || 'synced');
  }

  const airwayRecord = stripNullish(payload.airwayDevice || {});
  if (hasKeys(airwayRecord)) {
    const airwayPayload = buildStepWriteMetadata(airwayRecord, payload, 'airway');
    const result = await addAirwayDevice(userId, admissionId, airwayPayload, auditContext);
    saved.airwayDevice = result.airwayDevice;
    writeStatuses.push(result.syncStatus || 'synced');
  }

  const humidificationRecord = stripNullish(payload.humidification || {});
  if (hasKeys(humidificationRecord)) {
    const humidificationPayload = buildStepWriteMetadata(humidificationRecord, payload, 'humidification');
    const result = await addHumidification(userId, admissionId, humidificationPayload, auditContext);
    saved.humidificationDecision = result.humidificationDecision;
    writeStatuses.push(result.syncStatus || 'synced');
  }

  const refreshed = await getNewPatientById(userId, admissionId);
  const syncStatus = writeStatuses.length > 0 && writeStatuses.every((status) => status === 'duplicate') ? 'duplicate' : 'synced';
  const response = buildThreeStepNewPatientResponse('oxygen_abg_ventilator', refreshed, {
    facilityId: refreshed.facilityId,
    saved,
    syncStatus,
  });

  if (syncStatus !== 'duplicate') {
    await writeAudit({
      ...auditContext,
      userId,
      facilityId: refreshed.facilityId,
      action: 'ADMISSION_THREE_STEP_OXYGEN_ABG_VENTILATOR',
      entityType: 'Admission',
      entityId: admissionId,
      afterJson: response,
      reason: getOverrideReason(payload),
    });
  }

  return response;
};

export const saveNewPatientAbgVentilatorUpdate = async (userId, admissionId, payload = {}, auditContext = {}) => {
  const admissionAccess = await assertAdmissionAccess(userId, admissionId, WRITE_ROLES);
  const abgRecord = stripNullish(withoutRemovedNewPatientFields(payload.abgTest || {}));
  const ventilatorRecord = stripNullish(withoutRemovedNewPatientFields(payload.ventilatorSetting || {}));

  if (
    !hasClinicalValue(abgRecord, ABG_UPDATE_VALUE_FIELDS) &&
    !hasClinicalValue(ventilatorRecord, VENTILATOR_UPDATE_VALUE_FIELDS)
  ) {
    throw badRequest('At least one ABG or ventilator setting value is required', [
      {
        path: 'body',
        message: 'Enter at least one ABG result or ventilator setting before saving.',
      },
    ]);
  }

  return prisma.$transaction(async (tx) => {
    const idem = await resolveIdempotency({
      tx,
      userId,
      facilityId: admissionAccess.facilityId,
      key: payload.idempotencyKey,
      operation: 'admission.abgVentilatorUpdate',
      payload: { admissionId, ...payload },
    });
    if (!idem.shouldRun) return { ...idem.responseJson, syncStatus: 'duplicate' };

    const reviewedWrite = await assertNoReviewedOverwrite(tx, admissionId, userId, {
      allowClinicianOverride: true,
      overrideReason: getOverrideReason(payload),
    });

    const saved = {};
    if (hasClinicalValue(abgRecord, ABG_UPDATE_VALUE_FIELDS)) {
      const abgPayload = buildStepWriteMetadata(abgRecord, payload, 'abg', {
        includeSource: true,
        includeClientUpdatedAt: true,
      });
      saved.abgTest = await createAbgTestRecord({ tx, userId, admissionId, payload: abgPayload });
    }

    if (hasClinicalValue(ventilatorRecord, VENTILATOR_UPDATE_VALUE_FIELDS)) {
      const ventilatorPayload = buildStepWriteMetadata(ventilatorRecord, payload, 'ventilator', {
        includeSource: true,
        includeClientUpdatedAt: true,
      });
      saved.ventilatorSetting = await createVentilatorSettingRecord({ tx, userId, admissionId, payload: ventilatorPayload });
    }

    const refreshed = await tx.admission.findUnique({ where: { id: admissionId }, include: fullNewPatientInclude });
    const referenceRanges = await resolveDecisionSupportReferenceRanges(admissionAccess.facilityId, { tx });
    const responseJson = buildThreeStepNewPatientResponse(
      'abg_ventilator_update',
      { ...refreshed, clinicalSummary: buildClinicalSummary(refreshed, { referenceRanges }) },
      {
        facilityId: refreshed.facilityId,
        saved,
        reviewState: {
          admissionReviewStatus: reviewedWrite.reviewStatus,
          overrideApplied: reviewedWrite.overrideApplied,
          overrideReasonRequired: false,
        },
        syncStatus: 'synced',
      },
      { referenceRanges },
    );

    await storeIdempotencyResult({
      tx,
      userId,
      facilityId: admissionAccess.facilityId,
      key: payload.idempotencyKey,
      operation: 'admission.abgVentilatorUpdate',
      requestHash: idem.requestHash,
      responseJson,
      entityType: 'Admission',
      entityId: admissionId,
      clientRecordId: payload.clientRecordId,
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: refreshed.facilityId,
      action: 'ADMISSION_ABG_VENTILATOR_UPDATE',
      entityType: 'Admission',
      entityId: admissionId,
      afterJson: responseJson,
      reason: reviewedWrite.overrideReason,
    });

    return responseJson;
  });
};

export const saveNewPatientReviewStep = async (userId, admissionId, payload, auditContext = {}) => {
  const admissionAccess = await assertAdmissionAccess(userId, admissionId, WRITE_ROLES);

  return prisma.$transaction(async (tx) => {
    const idem = await resolveIdempotency({
      tx,
      userId,
      facilityId: admissionAccess.facilityId,
      key: payload.idempotencyKey,
      operation: 'admission.threeStep.saveReview',
      payload: { admissionId, ...payload },
    });
    if (!idem.shouldRun) return { ...idem.responseJson, syncStatus: 'duplicate' };

    const before = await tx.admission.findUnique({ where: { id: admissionId }, include: fullNewPatientInclude });
    if (!before) throw notFound('New Patient record not found');

    const referenceRanges = await resolveDecisionSupportReferenceRanges(before.facilityId, { tx });
    const clinicalSummary = buildClinicalSummary(before, { referenceRanges });
    const readiness = buildNewPatientReadiness({ ...before, clinicalSummary });
    const overrideReasonText = getOverrideReason(payload);

    let reviewAction = null;
    const reviewComment = overrideReasonText || cleanText(payload.reviewNote);
    if (payload.clinicianConfirmed === true || reviewComment) {
      reviewAction = await tx.reviewAction.create({
        data: {
          facilityId: before.facilityId,
          reviewerUserId: userId,
          entityType: 'Admission',
          entityId: admissionId,
          action: overrideReasonText ? 'clinician_override' : 'clinician_save_review',
          statusBefore: before.reviewStatus,
          statusAfter: before.reviewStatus,
          comment: reviewComment,
          beforeJson: { readiness },
          afterJson: {
            readiness,
            clinicianConfirmed: payload.clinicianConfirmed === true,
            overrideReason: overrideReasonText,
          },
        },
      });
    }

    const after = await tx.admission.findUnique({ where: { id: admissionId }, include: fullNewPatientInclude });
    const responseJson = buildThreeStepNewPatientResponse(
      'save_review',
      { ...after, clinicalSummary: buildClinicalSummary(after, { referenceRanges }) },
      {
        facilityId: after.facilityId,
        review: {
          clinicianConfirmed: payload.clinicianConfirmed === true,
          overrideRecorded: Boolean(overrideReasonText),
          reviewActionId: reviewAction?.id || null,
          admissionReviewStatus: after.reviewStatus,
        },
        syncStatus: 'synced',
      },
      { referenceRanges },
    );

    await storeIdempotencyResult({
      tx,
      userId,
      facilityId: before.facilityId,
      key: payload.idempotencyKey,
      operation: 'admission.threeStep.saveReview',
      requestHash: idem.requestHash,
      responseJson,
      entityType: 'Admission',
      entityId: admissionId,
      clientRecordId: payload.clientRecordId,
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: before.facilityId,
      action: 'ADMISSION_THREE_STEP_SAVE_REVIEW',
      entityType: 'Admission',
      entityId: admissionId,
      beforeJson: { readiness },
      afterJson: responseJson,
      reason: overrideReasonText || cleanText(payload.reviewNote),
    });

    return responseJson;
  });
};

export const updateNewPatient = async (userId, id, data, auditContext = {}) => {
  const admission = await assertAdmissionAccess(userId, id, WRITE_ROLES);

  return prisma.$transaction(async (tx) => {
    const idem = await resolveIdempotency({
      tx,
      userId,
      facilityId: admission.facilityId,
      key: data.idempotencyKey,
      operation: 'admission.update',
      payload: { admissionId: id, ...data },
    });
    if (!idem.shouldRun) return { ...idem.responseJson, syncStatus: 'duplicate' };

    const reviewedWrite = await assertNoReviewedOverwrite(tx, id, userId, {
      allowClinicianOverride: true,
      overrideReason: getOverrideReason(data),
    });
    const before = await tx.admission.findUnique({ where: { id }, include: newPatientInclude });
    const admissionPatchData = pickNewPatientPatchData(data);
    const patientPatchData = preparePatientUpdateData(before.patient, data.patient);

    if (patientPatchData) {
      await tx.patient.update({
        where: { id: before.patientId },
        data: patientPatchData,
      });
    }

    const updated = hasKeys(admissionPatchData)
      ? await tx.admission.update({
        where: { id },
        data: admissionPatchData,
        include: newPatientInclude,
      })
      : await tx.admission.findUnique({ where: { id }, include: newPatientInclude });
    const referenceRanges = await resolveDecisionSupportReferenceRanges(admission.facilityId, { tx });

    const responseJson = toJson({
      admission: updated,
      clinicalSummary: buildClinicalSummary(updated, { referenceRanges }),
      reviewState: {
        admissionReviewStatus: reviewedWrite.reviewStatus,
        overrideApplied: reviewedWrite.overrideApplied,
        overrideReasonRequired: false,
      },
      syncStatus: 'synced',
    });

    await storeIdempotencyResult({
      tx,
      userId,
      facilityId: admission.facilityId,
      key: data.idempotencyKey,
      operation: 'admission.update',
      requestHash: idem.requestHash,
      responseJson,
      entityType: 'Admission',
      entityId: id,
    });

    if (hasKeys(admissionPatchData)) {
      await writeAudit({
        tx,
        ...auditContext,
        userId,
        facilityId: admission.facilityId,
        action: 'ADMISSION_UPDATE',
        entityType: 'Admission',
        entityId: id,
        beforeJson: before,
        afterJson: responseJson,
        reason: reviewedWrite.overrideReason,
      });
    }

    if (data.status !== undefined && before.status !== updated.status) {
      await writeAudit({
        tx,
        ...auditContext,
        userId,
        facilityId: admission.facilityId,
        action: 'ADMISSION_LIFECYCLE_UPDATE',
        entityType: 'Admission',
        entityId: id,
        beforeJson: { status: before.status },
        afterJson: { status: updated.status },
        reason: reviewedWrite.overrideReason,
      });
    }

    if (patientPatchData) {
      await writeAudit({
        tx,
        ...auditContext,
        userId,
        facilityId: admission.facilityId,
        action: 'PATIENT_REGISTRATION_UPDATE',
        entityType: 'Patient',
        entityId: before.patientId,
        beforeJson: before.patient,
        afterJson: updated.patient,
        reason: reviewedWrite.overrideReason,
      });
    }

    if (!hasKeys(admissionPatchData) && !patientPatchData) {
      await writeAudit({
        tx,
        ...auditContext,
        userId,
        facilityId: admission.facilityId,
        action: 'ADMISSION_NOOP_UPDATE',
        entityType: 'Admission',
        entityId: id,
        beforeJson: before,
        afterJson: responseJson,
        reason: reviewedWrite.overrideReason,
      });
    }

    return responseJson;
  });
};

const createAppendOnlyRecord = async ({
  userId,
  admissionId,
  payload,
  operation,
  entityType,
  createRecord,
  auditAction,
  auditContext,
}) => {
  const admission = await assertAdmissionAccess(userId, admissionId, WRITE_ROLES);

  return prisma.$transaction(async (tx) => {
    const idem = await resolveIdempotency({
      tx,
      userId,
      facilityId: admission.facilityId,
      key: payload.idempotencyKey,
      operation,
      payload: { admissionId, ...payload },
    });
    if (!idem.shouldRun) return { ...idem.responseJson, syncStatus: 'duplicate' };

    const reviewedWrite = await assertNoReviewedOverwrite(tx, admissionId, userId, {
      allowClinicianOverride: true,
      overrideReason: getOverrideReason(payload),
    });
    const record = await createRecord(tx, admission);
    const refreshed = await tx.admission.findUnique({ where: { id: admissionId }, include: newPatientInclude });
    const referenceRanges = await resolveDecisionSupportReferenceRanges(admission.facilityId, { tx });
    const responseJson = toJson({
      [entityType[0].toLowerCase() + entityType.slice(1)]: record,
      facilityId: admission.facilityId,
      clinicalSummary: buildClinicalSummary(refreshed, { referenceRanges }),
      ...buildDecisionSupport(entityType, record),
      reviewState: {
        admissionReviewStatus: reviewedWrite.reviewStatus,
        overrideApplied: reviewedWrite.overrideApplied,
        overrideReasonRequired: false,
      },
      syncStatus: 'synced',
    });

    await storeIdempotencyResult({
      tx,
      userId,
      facilityId: admission.facilityId,
      key: payload.idempotencyKey,
      operation,
      requestHash: idem.requestHash,
      responseJson,
      entityType,
      entityId: record.id,
      clientRecordId: payload.clientRecordId,
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: admission.facilityId,
      action: auditAction,
      entityType,
      entityId: record.id,
      afterJson: responseJson,
      reason: reviewedWrite.overrideReason,
    });
    return responseJson;
  });
};

export const addClinicalSnapshot = (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'clinicalSnapshot.create',
  entityType: 'ClinicalSnapshot',
  auditAction: 'CLINICAL_SNAPSHOT_CREATE',
  auditContext,
  createRecord: (tx) => tx.clinicalSnapshot.create({
    data: stripUndefined({
      admissionId,
      ...withoutIdempotency(payload),
      enteredByUserId: userId,
      validationStatus: 'valid_or_missing',
    }),
  }),
});

const createAbgTestRecord = async ({ tx, userId, admissionId, payload }) => {
  const admission = await tx.admission.findUnique({ where: { id: admissionId }, include: { patient: true } });
  const latest = await tx.abgTest.findFirst({
    where: { admissionId },
    orderBy: { version: 'desc' },
    select: {
      id: true,
      version: true,
      collectedAt: true,
      clientRecordId: true,
      clientUpdatedAt: true,
      createdAt: true,
    },
  });
  assertNoStaleClientAppend({
    entityType: 'AbgTest',
    admission,
    payload,
    latest,
    timestampField: 'collectedAt',
  });
  const referenceRanges = await resolveDecisionSupportReferenceRanges(admission.facilityId, { tx });
  const abgInterpretation = interpretAbg(payload, admission.patient, { referenceRanges });
  return tx.abgTest.create({
    data: stripUndefined({
      admissionId,
      ...withoutIdempotency(payload),
      version: (latest?.version || 0) + 1,
      enteredByUserId: userId,
      validationStatus: abgInterpretation.flags.some((flag) => flag.code === 'IMPOSSIBLE_VALUE') ? 'impossible' : 'valid_or_suspicious',
      clinicalFlagsJson: abgInterpretation.flags,
      calculationSummaryJson: { pfRatio: abgInterpretation.pfRatio, sfRatio: abgInterpretation.sfRatio },
    }),
  });
};

const createVentilatorSettingRecord = async ({ tx, userId, admissionId, payload }) => {
  const admission = await tx.admission.findUnique({
    where: { id: admissionId },
    include: {
      patient: true,
      abgTests: { orderBy: { collectedAt: 'desc' }, take: 1 },
      clinicalSnapshots: latestOnly,
    },
  });
  const latest = await tx.ventilatorSetting.findFirst({
    where: { admissionId },
    orderBy: { version: 'desc' },
    select: {
      id: true,
      version: true,
      measuredAt: true,
      clientRecordId: true,
      clientUpdatedAt: true,
      createdAt: true,
    },
  });
  assertNoStaleClientAppend({
    entityType: 'VentilatorSetting',
    admission,
    payload,
    latest,
    timestampField: 'measuredAt',
  });
  const referenceRanges = await resolveDecisionSupportReferenceRanges(admission.facilityId, { tx });
  const summary = calculateVentilationSummary({
    patient: admission.patient,
    ventilator: payload,
    latestAbg: admission.abgTests[0] || null,
    latestSnapshot: admission.clinicalSnapshots[0] || null,
    referenceRanges,
  });
  return tx.ventilatorSetting.create({
    data: stripUndefined({
      admissionId,
      ...withoutIdempotency(payload),
      version: (latest?.version || 0) + 1,
      minuteVolumeLMin: summary.minuteVentilation.value,
      vtMlPerKgReferenceWeight: summary.vtPerKg.value,
      drivingPressure: summary.drivingPressure.value,
      enteredByUserId: userId,
      validationStatus: summary.flags.some((flag) => flag.code === 'IMPOSSIBLE_VALUE') ? 'impossible' : 'valid_or_suspicious',
      clinicalFlagsJson: summary.flags,
      calculationSummaryJson: summary,
    }),
  });
};

export const addAbgTest = (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'abgTest.create',
  entityType: 'AbgTest',
  auditAction: 'ABG_TEST_CREATE_VERSION',
  auditContext,
  createRecord: (tx) => createAbgTestRecord({ tx, userId, admissionId, payload }),
});

export const addVentilatorSetting = (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'ventilatorSetting.create',
  entityType: 'VentilatorSetting',
  auditAction: 'VENTILATOR_SETTING_CREATE_VERSION',
  auditContext,
  createRecord: (tx) => createVentilatorSettingRecord({ tx, userId, admissionId, payload }),
});

export const addAirwayDevice = (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'airwayDevice.create',
  entityType: 'AirwayDevice',
  auditAction: 'AIRWAY_DEVICE_CREATE',
  auditContext,
  createRecord: (tx) => tx.airwayDevice.create({
    data: stripUndefined({
      admissionId,
      ...withoutIdempotency(payload),
      enteredByUserId: userId,
      validationStatus: 'valid_or_missing',
    }),
  }),
});

export const addHumidification = (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'humidification.create',
  entityType: 'HumidificationDecision',
  auditAction: 'HUMIDIFICATION_CREATE',
  auditContext,
  createRecord: (tx) => tx.humidificationDecision.create({
    data: stripUndefined({
      admissionId,
      ...withoutIdempotency(payload),
      confirmedByUserId: userId,
      clinicalFlagsJson: calculateHumidificationFlags(payload),
    }),
  }),
});

export const addDailyReview = (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'dailyReview.create',
  entityType: 'DailyVentilationReview',
  auditAction: 'DAILY_REVIEW_CREATE',
  auditContext,
  createRecord: (tx) => tx.dailyVentilationReview.create({
    data: stripUndefined({
      admissionId,
      ...withoutIdempotency(payload),
      reviewedByUserId: userId,
      clinicalFlagsJson: {
        readinessPrompt: 'Daily liberation/readiness checklist saved. Clinician confirms readiness and final plan.',
      },
    }),
  }),
});

export const addOutcome = async (userId, admissionId, payload, auditContext = {}) => createAppendOnlyRecord({
  userId,
  admissionId,
  payload,
  operation: 'outcome.create',
  entityType: 'Outcome',
  auditAction: 'OUTCOME_CREATE',
  auditContext,
  createRecord: async (tx, admission) => {
    const outcome = await tx.outcome.create({
      data: stripUndefined({
        admissionId,
        ...withoutIdempotency(payload),
        enteredByUserId: userId,
      }),
    });

    const statusMap = {
      TRANSFERRED: 'TRANSFERRED',
      DISCHARGED: 'DISCHARGED',
      DECEASED: 'DECEASED',
      STILL_ADMITTED: 'ACTIVE',
    };
    if (statusMap[payload.outcomeType]) {
      const nextStatus = statusMap[payload.outcomeType];
      await tx.admission.update({ where: { id: admissionId }, data: { status: nextStatus } });
      if (admission.status !== nextStatus) {
        await writeAudit({
          tx,
          ...auditContext,
          userId,
          facilityId: admission.facilityId,
          action: 'ADMISSION_LIFECYCLE_UPDATE',
          entityType: 'Admission',
          entityId: admissionId,
          beforeJson: { status: admission.status },
          afterJson: { status: nextStatus, outcomeId: outcome.id },
        });
      }
    }
    return outcome;
  },
});

export const assertNoConflictForSync = async ({ admissionId, clientUpdatedAt }) => {
  if (!admissionId || !clientUpdatedAt) return null;
  const admission = await prisma.admission.findUnique({
    where: { id: admissionId },
    select: { id: true, facilityId: true, updatedAt: true, reviewStatus: true },
  });
  if (!admission) throw notFound('New Patient record not found');
  if (admission.reviewStatus === 'APPROVED') {
    throw conflict('Reviewed admission requires reviewer resolution before sync overwrite', [], {
      status: 'conflict',
      facilityId: admission.facilityId,
      admissionId: admission.id,
      reviewStatus: admission.reviewStatus,
      preserveReviewedData: true,
      resolution: 'submit_new_append_only_record_or_request_reviewer_correction',
      serverUpdatedAt: admission.updatedAt,
      clientUpdatedAt,
    });
  }
  if (new Date(clientUpdatedAt) < admission.updatedAt) {
    throw conflict('Another update exists. Keep both values for reviewer?', [], {
      status: 'conflict',
      facilityId: admission.facilityId,
      admissionId: admission.id,
      reviewStatus: admission.reviewStatus,
      preserveReviewedData: true,
      resolution: 'keep_server_record_and_route_client_payload_for_review',
      serverUpdatedAt: admission.updatedAt,
      clientUpdatedAt,
    });
  }
  return admission;
};
