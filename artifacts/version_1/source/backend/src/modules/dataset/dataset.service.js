import { prisma } from '../../config/prisma.js';
import { DATASET_EXPORT_ROLES, REVIEW_ROLES, WRITE_ROLES, assertFacilityRole, resolveFacilityScope } from '../../utils/authorization.js';
import { badRequest, forbidden, notFound, reviewerRequired } from '../../utils/errors.js';
import { deidentifyPayload, buildDatasetPayloadFromAdmission, findIdentifierPaths } from '../../utils/deidentify.js';
import { writeAudit } from '../../utils/audit.js';
import { sha256 } from '../../utils/crypto.js';
import { resolveIdempotency, storeIdempotencyResult } from '../../utils/idempotency.js';
import {
  UNSAFE_DATASET_SOURCE_TYPE_MESSAGE,
  UNSAFE_DATASET_SOURCE_TYPE_PATTERN,
} from './dataset.constants.js';

const toJson = (value) => JSON.parse(JSON.stringify(value));
const DATASET_CAPTURE_OPERATION = 'dataset.capture.create';
const DATASET_CAPTURE_ROLES = Object.freeze([...new Set([...WRITE_ROLES, ...REVIEW_ROLES])]);
const DATASET_CAPTURE_SOURCE_TYPE = 'clinical_case_capture';
const DATASET_VENTILATION_REASON_OPTIONS = Object.freeze([
  'Acute hypoxemic respiratory failure',
  'Acute hypercapnic respiratory failure',
  'Mixed hypoxemic and hypercapnic respiratory failure',
  'ARDS requiring ventilatory support',
  'Pneumonia-related respiratory failure',
  'COPD exacerbation with ventilatory failure',
  'Asthma exacerbation with ventilatory failure',
  'Sepsis or shock with respiratory failure',
  'Airway protection',
  'Post-operative ventilatory support',
  'Neuromuscular weakness',
  'Trauma or burns ventilatory support',
  'Cardiac arrest or post-resuscitation support',
  'Weaning or extubation readiness assessment',
  'Other specified clinical reason',
  'Unknown reason',
]);
const DATASET_VENTILATION_REASON_LOOKUP = Object.freeze(
  DATASET_VENTILATION_REASON_OPTIONS.reduce((acc, label) => {
    acc[label.toLowerCase()] = label;
    return acc;
  }, {
    'hypoxemic respiratory failure': 'Acute hypoxemic respiratory failure',
    'hypoxaemic respiratory failure': 'Acute hypoxemic respiratory failure',
    'hypercapnic respiratory failure': 'Acute hypercapnic respiratory failure',
    'respiratory failure': 'Other specified clinical reason',
  })
);

const DATASET_OUTCOME_REFERENCE_CATEGORIES = Object.freeze({
  POSITIVE_REFERENCE: {
    value: 'POSITIVE_REFERENCE',
    sentiment: 'positive',
    recommendationUse: 'eligible_positive_reference_after_review',
    excludeFromRecommendations: false,
  },
  NEGATIVE_OR_HARMFUL: {
    value: 'NEGATIVE_OR_HARMFUL',
    sentiment: 'negative',
    recommendationUse: 'negative_or_harmful_reference_after_review',
    excludeFromRecommendations: false,
  },
  NEUTRAL_REVIEW_ONLY: {
    value: 'NEUTRAL_REVIEW_ONLY',
    sentiment: 'neutral',
    recommendationUse: 'review_only_context',
    excludeFromRecommendations: true,
  },
  EXCLUDE_FROM_RECOMMENDATION: {
    value: 'EXCLUDE_FROM_RECOMMENDATION',
    sentiment: 'excluded',
    recommendationUse: 'excluded_from_recommendation_logic',
    excludeFromRecommendations: true,
  },
  OUTCOME_PENDING: {
    value: 'OUTCOME_PENDING',
    sentiment: 'pending',
    recommendationUse: 'pending_outcome_review',
    excludeFromRecommendations: true,
  },
});

const DATASET_CAPTURE_REQUIRED_PATHS = Object.freeze([
  'caseContext.primaryDiagnosis',
  'caseContext.reasonForVentilation',
  'patient.patientPathway',
  'patient.ageYears',
  'patient.sexForSizeCalculations',
  'clinicalSnapshot.spo2',
  'clinicalSnapshot.fio2',
  'clinicalSnapshot.respiratoryRate',
  'abgTest.ph',
  'abgTest.paco2',
  'ventilatorSetting.mode',
  'ventilatorSetting.tidalVolumeMl',
  'ventilatorSetting.respiratoryRateSet',
  'ventilatorSetting.peep',
  'targetRanges.spo2Lower',
  'targetRanges.spo2Upper',
  'outcome.outcomeType',
  'outcome.referenceUseCategory',
  'provenance.sourceType',
  'provenance.sourceName',
  'provenance.clinicianValidationStatus',
  'quality.reviewerConfidence',
]);

const DATASET_CAPTURE_NUMERIC_RULES = Object.freeze({
  'patient.ageYears': { min: 0, max: 130, integer: true, message: 'Please enter a valid age in years.' },
  'patient.ageMonths': { min: 0, max: 11, integer: true, message: 'Please enter a valid age in months.' },
  'patient.actualWeightKg': { min: 0.3, max: 300, message: 'Please enter a valid weight in kg.' },
  'patient.heightOrLengthCm': { min: 20, max: 250, message: 'Please enter a valid height or length in cm.' },
  'patient.referenceWeightKg': { min: 0.3, max: 300, message: 'Please enter a valid reference weight in kg.' },
  'clinicalSnapshot.spo2': { min: 0, max: 100, message: 'Please enter a valid SpO2 percentage.' },
  'clinicalSnapshot.fio2': { min: 0.21, max: 1, message: 'Please enter FiO2 as a fraction from 0.21 to 1.0.' },
  'clinicalSnapshot.respiratoryRate': { min: 1, max: 100, message: 'Please enter a valid respiratory rate.' },
  'clinicalSnapshot.heartRate': { min: 0, max: 250, message: 'Please enter a valid heart rate.' },
  'clinicalSnapshot.systolicBp': { min: 0, max: 300, message: 'Please enter a valid systolic BP.' },
  'clinicalSnapshot.diastolicBp': { min: 0, max: 200, message: 'Please enter a valid diastolic BP.' },
  'clinicalSnapshot.meanArterialPressure': { min: 0, max: 250, message: 'Please enter a valid mean arterial pressure.' },
  'clinicalSnapshot.temperatureC': { min: 20, max: 45, message: 'Please enter a valid temperature in Celsius.' },
  'clinicalSnapshot.gcs': { min: 3, max: 15, integer: true, message: 'Please enter a valid GCS score.' },
  'clinicalSnapshot.rass': { min: -5, max: 4, integer: true, message: 'Please enter a valid RASS score.' },
  'abgTest.ph': { min: 6.8, max: 7.8, message: 'Please enter a valid pH value.' },
  'abgTest.pao2': { min: 0, max: 700, message: 'Please enter a valid PaO2 value.' },
  'abgTest.paco2': { min: 0, max: 250, message: 'Please enter a valid PaCO2 value.' },
  'abgTest.baseExcess': { min: -40, max: 40, message: 'Please enter a valid base excess value.' },
  'abgTest.hco3': { min: 0, max: 80, message: 'Please enter a valid HCO3 value.' },
  'abgTest.lactate': { min: 0, max: 30, message: 'Please enter a valid lactate value.' },
  'abgTest.fio2AtSample': { min: 0.21, max: 1, message: 'Please enter FiO2 at sample as a fraction from 0.21 to 1.0.' },
  'abgTest.spo2AtSample': { min: 0, max: 100, message: 'Please enter a valid SpO2 at sample percentage.' },
  'ventilatorSetting.tidalVolumeMl': { min: 0, max: 3000, message: 'Please enter a valid tidal volume.' },
  'ventilatorSetting.vtMlPerKgReferenceWeight': { min: 1, max: 20, message: 'Please enter a valid VT mL/kg reference weight.' },
  'ventilatorSetting.respiratoryRateSet': { min: 0, max: 100, message: 'Please enter a valid set respiratory rate.' },
  'ventilatorSetting.respiratoryRateMeasured': { min: 0, max: 100, message: 'Please enter a valid measured respiratory rate.' },
  'ventilatorSetting.fio2': { min: 0.21, max: 1, message: 'Please enter ventilator FiO2 as a fraction from 0.21 to 1.0.' },
  'ventilatorSetting.peep': { min: 0, max: 50, message: 'Please enter a valid PEEP value.' },
  'ventilatorSetting.pressureSupport': { min: 0, max: 80, message: 'Please enter a valid pressure support value.' },
  'ventilatorSetting.inspiratoryPressure': { min: 0, max: 80, message: 'Please enter a valid inspiratory pressure.' },
  'ventilatorSetting.peakPressure': { min: 0, max: 100, message: 'Please enter a valid peak pressure.' },
  'ventilatorSetting.plateauPressure': { min: 0, max: 80, message: 'Please enter a valid plateau pressure.' },
  'ventilatorSetting.drivingPressure': { min: 0, max: 80, message: 'Please enter a valid driving pressure.' },
  'ventilatorSetting.minuteVolumeLMin': { min: 0, max: 50, message: 'Please enter a valid minute volume.' },
  'ventilatorSetting.autoPeep': { min: 0, max: 50, message: 'Please enter a valid auto-PEEP value.' },
  'ventilatorSetting.leakPercent': { min: 0, max: 100, message: 'Please enter a valid leak percentage.' },
  'targetRanges.spo2Lower': { min: 0, max: 100, message: 'Please enter a valid lower SpO2 target.' },
  'targetRanges.spo2Upper': { min: 0, max: 100, message: 'Please enter a valid upper SpO2 target.' },
  'targetRanges.pao2Lower': { min: 0, max: 700, message: 'Please enter a valid lower PaO2 target.' },
  'targetRanges.pao2Upper': { min: 0, max: 700, message: 'Please enter a valid upper PaO2 target.' },
  'targetRanges.paco2Lower': { min: 0, max: 250, message: 'Please enter a valid lower PaCO2 target.' },
  'targetRanges.paco2Upper': { min: 0, max: 250, message: 'Please enter a valid upper PaCO2 target.' },
  'targetRanges.phLower': { min: 6.8, max: 7.8, message: 'Please enter a valid lower pH target.' },
  'targetRanges.phUpper': { min: 6.8, max: 7.8, message: 'Please enter a valid upper pH target.' },
  'targetRanges.vtMlPerKgLower': { min: 1, max: 20, message: 'Please enter a valid lower VT mL/kg target.' },
  'targetRanges.vtMlPerKgUpper': { min: 1, max: 20, message: 'Please enter a valid upper VT mL/kg target.' },
  'targetRanges.plateauPressureMax': { min: 0, max: 80, message: 'Please enter a valid plateau pressure maximum.' },
  'targetRanges.drivingPressureMax': { min: 0, max: 80, message: 'Please enter a valid driving pressure maximum.' },
  'targetRanges.peepLower': { min: 0, max: 50, message: 'Please enter a valid lower PEEP target.' },
  'targetRanges.peepUpper': { min: 0, max: 50, message: 'Please enter a valid upper PEEP target.' },
  'airwaySupport.internalDiameterMm': { min: 2, max: 12, message: 'Please enter a valid internal diameter.' },
  'airwaySupport.depthCm': { min: 1, max: 40, message: 'Please enter a valid tube depth.' },
  'airwaySupport.cuffPressureCmH2O': { min: 0, max: 80, message: 'Please enter a valid cuff pressure.' },
  'outcome.ventilatorDays': { min: 0, max: 365, message: 'Please enter valid ventilator days.' },
  'outcome.icuLengthOfStayDays': { min: 0, max: 365, message: 'Please enter a valid ICU length of stay.' },
  'outcome.hospitalLengthOfStayDays': { min: 0, max: 1000, message: 'Please enter a valid hospital length of stay.' },
});

const DATASET_CAPTURE_RANGE_PAIRS = Object.freeze([
  ['targetRanges.spo2Lower', 'targetRanges.spo2Upper', 'SpO2 lower target must be less than or equal to the upper target.'],
  ['targetRanges.pao2Lower', 'targetRanges.pao2Upper', 'PaO2 lower target must be less than or equal to the upper target.'],
  ['targetRanges.paco2Lower', 'targetRanges.paco2Upper', 'PaCO2 lower target must be less than or equal to the upper target.'],
  ['targetRanges.phLower', 'targetRanges.phUpper', 'pH lower target must be less than or equal to the upper target.'],
  ['targetRanges.vtMlPerKgLower', 'targetRanges.vtMlPerKgUpper', 'VT mL/kg lower target must be less than or equal to the upper target.'],
  ['targetRanges.peepLower', 'targetRanges.peepUpper', 'PEEP lower target must be less than or equal to the upper target.'],
]);

const DATASET_CAPTURE_DATE_PATHS = Object.freeze([
  'outcome.outcomeDate',
  'provenance.sourceAccessedAt',
]);

const DATASET_CAPTURE_DATE_TIME_PATHS = Object.freeze([
  'clinicalSnapshot.measuredAt',
  'abgTest.collectedAt',
  'ventilatorSetting.measuredAt',
]);

const DATASET_CAPTURE_AUTOMATIC_TIMESTAMP_PATHS = DATASET_CAPTURE_DATE_TIME_PATHS;

export const REQUIRED_TRAINING_GOVERNANCE_KEYS = Object.freeze([
  'facilityApproval',
  'dataSharingAgreement',
  'deidentificationReviewed',
]);

export const DATASET_EXPORT_POLICY = Object.freeze({
  deidentifiedOnly: true,
  reviewedOnly: true,
  ethicsApprovalRequired: true,
  datasetVersionRequired: true,
  rawNotesAllowed: false,
  patientIdentifiersAllowed: false,
});

const datasetSelect = {
  id: true,
  facilityId: true,
  sourceAdmissionId: true,
  sourceType: true,
  structuredPreviewJson: true,
  deidentifiedPayloadJson: true,
  deidentificationStatus: true,
  reviewStatus: true,
  approvedForTraining: true,
  ethicsApprovalId: true,
  governanceJson: true,
  datasetVersion: true,
  exclusionReason: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
};

const approvedDatasetSelect = {
  id: true,
  facilityId: true,
  sourceType: true,
  structuredPreviewJson: true,
  deidentifiedPayloadJson: true,
  deidentificationStatus: true,
  reviewStatus: true,
  approvedForTraining: true,
  ethicsApprovalId: true,
  governanceJson: true,
  datasetVersion: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
};

const extractNumber = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const value = Number(match[1]);
    if (Number.isFinite(value)) return value;
  }
  return undefined;
};

const extractRange = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const lower = Number(match[1]);
    const upper = Number(match[2]);
    if (Number.isFinite(lower) && Number.isFinite(upper)) return [lower, upper];
  }
  return [undefined, undefined];
};

const normalizeDiagnosis = (text) => {
  if (/\bcopd\b|chronic obstructive/i.test(text)) return 'COPD';
  if (/\basthma\b/i.test(text)) return 'ASTHMA';
  if (/\bpneumonia\b/i.test(text)) return 'PNEUMONIA';
  if (/\bards\b/i.test(text)) return 'ARDS';
  if (/\bheart failure\b|\bchf\b/i.test(text)) return 'HEART_FAILURE';
  if (/\bsepsis\b/i.test(text)) return 'SEPSIS';
  if (/\btrauma\b/i.test(text)) return 'TRAUMA';
  return undefined;
};

const normalizeVentilatorMode = (text) => {
  if (/\bprvc\b/i.test(text)) return 'PRVC';
  if (/\bsimv\b/i.test(text)) return 'SIMV';
  if (/\b(psv|pressure support)\b/i.test(text)) return 'PSV';
  if (/\b(bipap|niv)\b/i.test(text)) return 'BIPAP';
  if (/\b(volume control|vc)\b/i.test(text)) return 'VC';
  if (/\b(pressure control|pc)\b/i.test(text)) return 'PC';
  return text.match(/\bmode\s*[:=]?\s*([A-Za-z0-9 /+-]{2,20})/i)?.[1]?.trim()?.toUpperCase();
};

const normalizeVentilationReasonValue = (value) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return undefined;
  return DATASET_VENTILATION_REASON_LOOKUP[text.toLowerCase()] || text;
};

const normalizePatientPathway = (text) => {
  if (/\b(neonate|newborn)\b/i.test(text)) return 'NEONATE';
  if (/\b(child|paediatric|pediatric)\b/i.test(text)) return 'CHILD';
  if (/\badolescent\b/i.test(text)) return 'ADOLESCENT';
  return 'ADULT';
};

export const assertDatasetSourceTypeAllowed = (sourceType = '') => {
  if (UNSAFE_DATASET_SOURCE_TYPE_PATTERN.test(sourceType)) {
    throw badRequest(UNSAFE_DATASET_SOURCE_TYPE_MESSAGE);
  }
};

const getPath = (value, path) => path.split('.').reduce((acc, key) => acc?.[key], value);

const setPath = (target, path, value) => {
  const parts = path.split('.');
  const last = parts.pop();
  const parent = parts.reduce((acc, key) => {
    if (!acc[key] || typeof acc[key] !== 'object' || Array.isArray(acc[key])) acc[key] = {};
    return acc[key];
  }, target);
  parent[last] = value;
  return target;
};

const isBlankValue = (value) => value === undefined || value === null || String(value).trim() === '';

const isValidDateString = (value) => {
  const text = String(value || '').trim();
  if (!text) return true;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const parsed = new Date(`${text}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === text;
  }
  return !Number.isNaN(new Date(text).getTime());
};

const isValidDateTimeString = (value) => {
  const text = String(value || '').trim();
  if (!text) return true;
  return !Number.isNaN(new Date(text).getTime());
};

const normalizeCaptureTimestamp = (value) => {
  if (isBlankValue(value)) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const resolveAutomaticCaptureTimestamp = (payload = {}, structuredPreviewJson = {}) => {
  const candidates = [
    getPath(structuredPreviewJson, 'captureMetadata.submittedAt'),
    getPath(structuredPreviewJson, 'captureMetadata.capturedAt'),
    payload.governanceJson?.submittedAt,
    payload.clientUpdatedAt,
    payload.clientCreatedAt,
  ];
  for (const candidate of candidates) {
    const timestamp = normalizeCaptureTimestamp(candidate);
    if (timestamp) return timestamp;
  }
  return new Date().toISOString();
};

const hasSectionCaptureData = (sectionValue, timestampKey) => {
  if (!sectionValue || typeof sectionValue !== 'object') return false;
  return Object.entries(sectionValue).some(([key, value]) => key !== timestampKey && !isBlankValue(value));
};

const applyAutomaticCaptureTimestamps = (structuredPreviewJson = {}, payload = {}) => {
  const timestamp = resolveAutomaticCaptureTimestamp(payload, structuredPreviewJson);
  DATASET_CAPTURE_AUTOMATIC_TIMESTAMP_PATHS.forEach((path) => {
    const parts = path.split('.');
    const timestampKey = parts[parts.length - 1];
    const sectionPath = parts.slice(0, -1).join('.');
    const sectionValue = getPath(structuredPreviewJson, sectionPath);
    const currentValue = getPath(structuredPreviewJson, path);
    if (hasSectionCaptureData(sectionValue, timestampKey) && !normalizeCaptureTimestamp(currentValue)) {
      setPath(structuredPreviewJson, path, timestamp);
    }
  });
  return structuredPreviewJson;
};

const validateDatasetCaptureStructuredPreview = (structuredPreviewJson = {}) => {
  const errors = [];

  DATASET_CAPTURE_REQUIRED_PATHS.forEach((path) => {
    if (isBlankValue(getPath(structuredPreviewJson, path))) {
      errors.push({ path: `structuredPreviewJson.${path}`, message: 'This field is required before submitting.' });
    }
  });

  Object.entries(DATASET_CAPTURE_NUMERIC_RULES).forEach(([path, rule]) => {
    const value = getPath(structuredPreviewJson, path);
    if (isBlankValue(value)) return;
    const numberValue = Number(value);
    if (
      !Number.isFinite(numberValue) ||
      (rule.integer && !Number.isInteger(numberValue)) ||
      (Number.isFinite(rule.min) && numberValue < rule.min) ||
      (Number.isFinite(rule.max) && numberValue > rule.max)
    ) {
      errors.push({ path: `structuredPreviewJson.${path}`, message: rule.message });
    }
  });

  DATASET_CAPTURE_RANGE_PAIRS.forEach(([lowerPath, upperPath, message]) => {
    const lower = getPath(structuredPreviewJson, lowerPath);
    const upper = getPath(structuredPreviewJson, upperPath);
    if (isBlankValue(lower) || isBlankValue(upper)) return;
    const lowerNumber = Number(lower);
    const upperNumber = Number(upper);
    if (Number.isFinite(lowerNumber) && Number.isFinite(upperNumber) && lowerNumber > upperNumber) {
      errors.push({ path: `structuredPreviewJson.${upperPath}`, message });
    }
  });

  DATASET_CAPTURE_DATE_PATHS.forEach((path) => {
    const value = getPath(structuredPreviewJson, path);
    if (!isBlankValue(value) && !isValidDateString(value)) {
      errors.push({ path: `structuredPreviewJson.${path}`, message: 'Please enter a valid date.' });
    }
  });

  DATASET_CAPTURE_DATE_TIME_PATHS.forEach((path) => {
    const value = getPath(structuredPreviewJson, path);
    if (!isBlankValue(value) && !isValidDateTimeString(value)) {
      errors.push({ path: `structuredPreviewJson.${path}`, message: 'Please enter a valid date/time.' });
    }
  });

  const ventilationReason = getPath(structuredPreviewJson, 'caseContext.reasonForVentilation');
  if (!isBlankValue(ventilationReason)) {
    const text = String(ventilationReason).trim();
    if (text.length < 3 || text.length > 160) {
      errors.push({
        path: 'structuredPreviewJson.caseContext.reasonForVentilation',
        message: 'Enter a clear de-identified reason between 3 and 160 characters.',
      });
    }
  }

  const referenceUseCategory = getPath(structuredPreviewJson, 'outcome.referenceUseCategory');
  if (!isBlankValue(referenceUseCategory) && !DATASET_OUTCOME_REFERENCE_CATEGORIES[referenceUseCategory]) {
    errors.push({
      path: 'structuredPreviewJson.outcome.referenceUseCategory',
      message: 'Outcome label is required before submitting the dataset.',
    });
  }

  const outcomeType = getPath(structuredPreviewJson, 'outcome.outcomeType');
  const worseningSignals = [
    getPath(structuredPreviewJson, 'outcome.reintubationWithin48h') === 'YES',
    getPath(structuredPreviewJson, 'outcome.responseAt1Hour') === 'WORSE',
    getPath(structuredPreviewJson, 'outcome.responseAt6Hours') === 'WORSE',
    getPath(structuredPreviewJson, 'outcome.responseAt24Hours') === 'WORSE',
  ];
  if (referenceUseCategory === 'POSITIVE_REFERENCE' && (outcomeType === 'DECEASED' || worseningSignals.some(Boolean))) {
    errors.push({
      path: 'structuredPreviewJson.outcome.referenceUseCategory',
      message: 'Poor, unsafe, or worsening outcomes cannot be marked as positive reference cases without correction.',
    });
  }
  if (
    outcomeType === 'OUTCOME_PENDING' &&
    referenceUseCategory &&
    !['OUTCOME_PENDING', 'NEUTRAL_REVIEW_ONLY', 'EXCLUDE_FROM_RECOMMENDATION'].includes(referenceUseCategory)
  ) {
    errors.push({
      path: 'structuredPreviewJson.outcome.referenceUseCategory',
      message: 'Outcome-pending records must be marked pending, review only, or excluded from recommendation logic.',
    });
  }

  if (errors.length > 0) throw badRequest('Dataset capture validation failed', errors);
};

const buildDatasetOutcomeReview = (structuredPreviewJson = {}) => {
  const selectedCategory = getPath(structuredPreviewJson, 'outcome.referenceUseCategory') || 'OUTCOME_PENDING';
  const profile = DATASET_OUTCOME_REFERENCE_CATEGORIES[selectedCategory] || DATASET_OUTCOME_REFERENCE_CATEGORIES.OUTCOME_PENDING;
  return {
    referenceUseCategory: profile.value,
    outcomeSentiment: profile.sentiment,
    recommendationUse: profile.recommendationUse,
    excludeFromRecommendations: profile.excludeFromRecommendations,
    clinicianAssigned: true,
    requiresHumanReview: true,
  };
};

const normalizeDatasetCapturePayload = (payload) => {
  if (payload.sourceType !== DATASET_CAPTURE_SOURCE_TYPE) return payload;

  const structuredPreviewJson = toJson(payload.structuredPreviewJson);
  const reasonForVentilation = normalizeVentilationReasonValue(getPath(structuredPreviewJson, 'caseContext.reasonForVentilation'));
  if (reasonForVentilation) {
    setPath(structuredPreviewJson, 'caseContext.reasonForVentilation', reasonForVentilation);
  }
  applyAutomaticCaptureTimestamps(structuredPreviewJson, payload);
  validateDatasetCaptureStructuredPreview(structuredPreviewJson);
  const outcomeReview = buildDatasetOutcomeReview(structuredPreviewJson);
  setPath(structuredPreviewJson, 'captureMetadata.outcomeReview', outcomeReview);

  return {
    ...payload,
    structuredPreviewJson,
    governanceJson: {
      ...(payload.governanceJson || {}),
      captureType: payload.governanceJson?.captureType || 'structured_clinician_entry',
      rawNoteStored: false,
      externalModelServicesUsed: false,
      pendingHumanReview: true,
      clinicianValidationStatus: getPath(structuredPreviewJson, 'provenance.clinicianValidationStatus') || 'PENDING_CLINICIAN_VALIDATION',
      outcomeReview,
      sourceProvenance: {
        ...(payload.governanceJson?.sourceProvenance || {}),
        sourceType: getPath(structuredPreviewJson, 'provenance.sourceType') || 'CLINICIAN_CHART_ABSTRACTION',
        sourceName: getPath(structuredPreviewJson, 'provenance.sourceName') || null,
        sourceReference: getPath(structuredPreviewJson, 'provenance.sourceReference') || null,
        sourceUrl: getPath(structuredPreviewJson, 'provenance.sourceUrl') || null,
        sourceCitation: getPath(structuredPreviewJson, 'provenance.sourceCitation') || null,
        sourceAccessedAt: getPath(structuredPreviewJson, 'provenance.sourceAccessedAt') || null,
      },
    },
  };
};

const filterReviewedAdmissionRecords = (admission) => ({
  ...admission,
  abgTests: (admission.abgTests || []).filter((record) => record.reviewStatus === 'APPROVED'),
  ventilatorSettings: (admission.ventilatorSettings || []).filter((record) => record.reviewStatus === 'APPROVED'),
});

export const buildReviewedAdmissionDatasetPayload = (admission) => buildDatasetPayloadFromAdmission(filterReviewedAdmissionRecords(admission));

export const parseIcuNote = async ({ noteText, facilityId }, userId, auditContext = {}) => {
  await assertFacilityRole(userId, facilityId, DATASET_CAPTURE_ROLES);
  const text = noteText.replace(/\s+/g, ' ');
  const fio2 = (() => {
    const value = extractNumber(text, [/fio2\s*[:=]?\s*(0?\.\d{1,2})/i, /fio2\s*[:=]?\s*(\d{2,3})\s*%/i]);
    if (value === undefined) return undefined;
    return value > 1 ? Number((value / 100).toFixed(2)) : value;
  })();
  const peep = extractNumber(text, [/PEEP\s*[:=]?\s*(\d{1,2})/i]);
  const plateauPressure = extractNumber(text, [/plateau\s*[:=]?\s*(\d{1,2})/i]);
  const [spo2Lower, spo2Upper] = extractRange(text, [/target\s*spo2\s*[:=]?\s*(\d{2,3})\s*[-to]+\s*(\d{2,3})/i]);
  const [paco2Lower, paco2Upper] = extractRange(text, [/target\s*paco2\s*[:=]?\s*(\d{1,3})\s*[-to]+\s*(\d{1,3})/i]);

  const preview = {
    captureMetadata: {
      schemaVersion: 'clinical_case_v1',
      entryMode: 'structured_clinician_entry',
      rawNoteStored: false,
    },
    caseContext: {
      primaryDiagnosis: normalizeDiagnosis(text),
      reasonForVentilation: /\bhypercap/i.test(text)
        ? 'Acute hypercapnic respiratory failure'
        : /\bhypox/i.test(text)
          ? 'Acute hypoxemic respiratory failure'
          : undefined,
      ventilationIndication: /\bhypercap/i.test(text)
        ? 'HYPERCAPNIA'
        : /\bhypox/i.test(text)
          ? 'HYPOXEMIA'
          : undefined,
    },
    patient: {
      patientPathway: normalizePatientPathway(text),
      ageYears: extractNumber(text, [/\bage\s*[:=]?\s*(\d{1,3})\b/i, /\b(\d{1,3})\s*y(?:ears?)?\b/i]),
      sexForSizeCalculations: /\bmale\b|\bman\b/i.test(text) ? 'MALE' : /\bfemale\b|\bwoman\b/i.test(text) ? 'FEMALE' : undefined,
      actualWeightKg: extractNumber(text, [/\bweight\s*[:=]?\s*(\d{1,3}(?:\.\d+)?)\s*kg/i]),
      heightOrLengthCm: extractNumber(text, [/\bheight\s*[:=]?\s*(\d{2,3}(?:\.\d+)?)\s*cm/i]),
    },
    clinicalContext: {
      copdPhenotype: /\bcopd\b/i.test(text) ? 'ACUTE_HYPERCAPNIC_EXACERBATION' : undefined,
    },
    clinicalSnapshot: {
      spo2: extractNumber(text, [/spo2\s*[:=]?\s*(\d{2,3})/i, /saturation\s*[:=]?\s*(\d{2,3})/i]),
      fio2,
      respiratoryRate: extractNumber(text, [/\bRR\s*[:=]?\s*(\d{1,3})/i, /respiratory rate\s*[:=]?\s*(\d{1,3})/i]),
      heartRate: extractNumber(text, [/\bHR\s*[:=]?\s*(\d{1,3})/i, /heart rate\s*[:=]?\s*(\d{1,3})/i]),
    },
    abgTest: {
      ph: extractNumber(text, [/\bpH\s*[:=]?\s*(\d\.\d{1,3})/i]),
      pao2: extractNumber(text, [/pa[o0]2\s*[:=]?\s*(\d{1,3})/i]),
      paco2: extractNumber(text, [/pa[cC][o0]2\s*[:=]?\s*(\d{1,3})/i]),
      hco3: extractNumber(text, [/hco3\s*[:=]?\s*(\d{1,3})/i]),
      lactate: extractNumber(text, [/lactate\s*[:=]?\s*(\d+(?:\.\d+)?)/i]),
      fio2AtSample: fio2,
    },
    ventilatorSetting: {
      mode: normalizeVentilatorMode(text),
      tidalVolumeMl: extractNumber(text, [/\bVT\s*[:=]?\s*(\d{2,4})/i, /tidal volume\s*[:=]?\s*(\d{2,4})/i]),
      respiratoryRateSet: extractNumber(text, [/set\s*RR\s*[:=]?\s*(\d{1,3})/i]),
      fio2,
      peep,
      plateauPressure,
      peakPressure: extractNumber(text, [/peak\s*[:=]?\s*(\d{1,2})/i]),
      drivingPressure: Number.isFinite(plateauPressure) && Number.isFinite(peep)
        ? plateauPressure - peep
        : undefined,
    },
    targetRanges: {
      spo2Lower,
      spo2Upper,
      paco2Lower,
      paco2Upper,
    },
    provenance: {
      sourceType: 'CLINICIAN_CHART_ABSTRACTION',
      sourceName: 'Pasted ICU note structured preview',
      sourceReference: undefined,
      sourceUrl: undefined,
      sourceCitation: undefined,
      sourceAccessedAt: undefined,
      clinicianValidationStatus: 'PENDING_CLINICIAN_VALIDATION',
    },
    quality: {
      reviewerConfidence: 'NEEDS_REVIEW',
    },
    parserWarnings: [
      'Structured preview requires human review before dataset use.',
      'Raw note text was not stored in the training payload.',
    ],
  };

  const deidentifiedPreview = deidentifyPayload(preview);
  await writeAudit({
    ...auditContext,
    userId,
    facilityId,
    action: 'DATASET_NOTE_PARSE_PREVIEW',
    entityType: 'DatasetCase',
    afterJson: { fields: Object.keys(deidentifiedPreview) },
  });

  const requiredPreviewPaths = [
    'caseContext.primaryDiagnosis',
    'caseContext.reasonForVentilation',
    'patient.patientPathway',
    'patient.ageYears',
    'patient.sexForSizeCalculations',
    'clinicalSnapshot.spo2',
    'clinicalSnapshot.fio2',
    'clinicalSnapshot.respiratoryRate',
    'abgTest.ph',
    'abgTest.paco2',
    'ventilatorSetting.mode',
    'ventilatorSetting.tidalVolumeMl',
    'ventilatorSetting.respiratoryRateSet',
    'ventilatorSetting.peep',
    'targetRanges.spo2Lower',
    'targetRanges.spo2Upper',
    'outcome.outcomeType',
    'outcome.referenceUseCategory',
    'provenance.sourceType',
    'provenance.sourceName',
    'provenance.clinicianValidationStatus',
    'quality.reviewerConfidence',
  ];
  const getPreviewPath = (path) => path.split('.').reduce((acc, key) => acc?.[key], deidentifiedPreview);

  return {
    structuredPreviewJson: deidentifiedPreview,
    missingFields: requiredPreviewPaths.filter((path) => {
      const value = getPreviewPath(path);
      return value === undefined || value === null || value === '';
    }),
    noteStorage: 'raw_note_not_saved',
  };
};

const buildDatasetPayload = async ({ facilityId, sourceAdmissionId, sourceType, structuredPreviewJson }) => {
  assertDatasetSourceTypeAllowed(sourceType);
  if (!sourceAdmissionId) return deidentifyPayload(structuredPreviewJson);

  const admission = await prisma.admission.findUnique({
    where: { id: sourceAdmissionId },
    include: {
      patient: true,
      clinicalSnapshots: true,
      abgTests: true,
      ventilatorSettings: true,
      airwayDevices: true,
      humidificationDecisions: true,
      dailyReviews: true,
      outcomes: true,
    },
  });
  if (!admission) throw notFound('Source admission not found');
  if (admission.facilityId !== facilityId) throw notFound('Source admission not found');
  if (admission.reviewStatus !== 'APPROVED') {
    throw reviewerRequired('Source admission must be reviewed before dataset approval.');
  }
  return buildReviewedAdmissionDatasetPayload(admission);
};

export const createDatasetImport = async (payload, userId, auditContext = {}) => {
  await assertFacilityRole(userId, payload.facilityId, DATASET_CAPTURE_ROLES);
  const normalizedPayload = normalizeDatasetCapturePayload(payload);
  const deidentifiedPayloadJson = await buildDatasetPayload(normalizedPayload);

  return prisma.$transaction(async (tx) => {
    const idem = await resolveIdempotency({
      tx,
      userId,
      facilityId: normalizedPayload.facilityId,
      key: normalizedPayload.idempotencyKey,
      operation: DATASET_CAPTURE_OPERATION,
      payload: normalizedPayload,
    });

    if (!idem.shouldRun) {
      const datasetCase = idem.responseJson?.datasetCase || idem.responseJson;
      return datasetCase ? { ...datasetCase, syncStatus: 'duplicate' } : idem.responseJson;
    }

    const datasetCase = await tx.datasetCase.create({
      data: {
        facilityId: normalizedPayload.facilityId,
        sourceAdmissionId: normalizedPayload.sourceAdmissionId,
        sourceType: normalizedPayload.sourceType,
        structuredPreviewJson: deidentifyPayload(normalizedPayload.structuredPreviewJson),
        sourcePayloadJson: null,
        deidentifiedPayloadJson,
        deidentificationStatus: 'deidentified_server_side',
        reviewStatus: 'SUBMITTED',
        governanceJson: normalizedPayload.governanceJson,
      },
      select: datasetSelect,
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: normalizedPayload.facilityId,
      action: 'DATASET_CAPTURE_CREATE',
      entityType: 'DatasetCase',
      entityId: datasetCase.id,
      afterJson: datasetCase,
    });

    const responseJson = toJson({
      datasetCase,
      syncStatus: payload.idempotencyKey ? 'synced' : undefined,
    });

    await storeIdempotencyResult({
      tx,
      userId,
      facilityId: normalizedPayload.facilityId,
      key: normalizedPayload.idempotencyKey,
      operation: DATASET_CAPTURE_OPERATION,
      requestHash: idem.requestHash,
      responseJson,
      entityType: 'DatasetCase',
      entityId: datasetCase.id,
      clientRecordId: normalizedPayload.clientRecordId,
    });

    return normalizedPayload.idempotencyKey ? { ...datasetCase, syncStatus: 'synced' } : datasetCase;
  });
};

export const listPendingDatasetImports = async (userId, { facilityId, page, limit }) => {
  const scopedFacilityId = await resolveFacilityScope(userId, facilityId, REVIEW_ROLES);
  const where = {
    ...(scopedFacilityId ? { facilityId: scopedFacilityId } : {}),
    reviewStatus: { in: ['SUBMITTED', 'NEEDS_CORRECTION', 'REVIEWED', 'APPROVED_FOR_DATASET'] },
  };

  const [items, total] = await Promise.all([
    prisma.datasetCase.findMany({ where, select: datasetSelect, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.datasetCase.count({ where }),
  ]);
  return { items, total, page, limit };
};

const assertTrainingGovernance = (payload) => {
  if (!payload.ethicsApprovalId) throw badRequest('ethicsApprovalId is required before approving data for training');
  if (!payload.datasetVersion) throw badRequest('datasetVersion is required before approving data for training');
  const governance = payload.governanceJson || {};
  const missing = REQUIRED_TRAINING_GOVERNANCE_KEYS.filter((key) => governance[key] !== true);
  if (missing.length > 0) {
    throw badRequest('Governance metadata is incomplete', missing.map((key) => ({ path: `governanceJson.${key}`, message: 'Must be true before training approval' })));
  }
};

const getMissingExportGovernance = (datasetCase) => {
  const governance = datasetCase.governanceJson || {};
  return REQUIRED_TRAINING_GOVERNANCE_KEYS.filter((key) => governance[key] !== true);
};

export const buildDatasetCard = (datasetCase) => ({
  datasetCaseId: datasetCase.id,
  datasetVersion: datasetCase.datasetVersion || null,
  ethicsApprovalId: datasetCase.ethicsApprovalId || null,
  facilityId: datasetCase.facilityId,
  sourceType: datasetCase.sourceType,
  reviewStatus: datasetCase.reviewStatus,
  approvedForTraining: datasetCase.approvedForTraining === true,
  deidentificationStatus: datasetCase.deidentificationStatus || null,
  reviewedAt: datasetCase.reviewedAt || null,
  governanceChecks: Object.fromEntries(
    REQUIRED_TRAINING_GOVERNANCE_KEYS.map((key) => [key, datasetCase.governanceJson?.[key] === true])
  ),
  exportPolicy: DATASET_EXPORT_POLICY,
});

export const assertDatasetCaseExportEligible = (datasetCase) => {
  assertDatasetSourceTypeAllowed(datasetCase.sourceType);

  if (!datasetCase.approvedForTraining || datasetCase.reviewStatus !== 'APPROVED_FOR_TRAINING') {
    throw forbidden('Only reviewed, de-identified, approved-for-training dataset cases can be exported');
  }

  if (!datasetCase.ethicsApprovalId || !datasetCase.datasetVersion) {
    throw forbidden('Dataset export requires ethics approval and dataset version metadata');
  }

  if (!String(datasetCase.deidentificationStatus || '').startsWith('deidentified')) {
    throw forbidden('Dataset export requires server-side de-identification status');
  }

  const missingGovernance = getMissingExportGovernance(datasetCase);
  if (missingGovernance.length > 0) {
    throw forbidden('Dataset export requires complete governance metadata', missingGovernance.map((key) => ({
      path: `governanceJson.${key}`,
      message: 'Must be true before export',
    })));
  }

  const identifierPaths = findIdentifierPaths(datasetCase.deidentifiedPayloadJson);
  if (identifierPaths.length > 0) {
    throw forbidden('Dataset export payload still contains identifier-like fields', identifierPaths.map((path) => ({
      path: `deidentifiedPayloadJson.${path}`,
      message: 'Remove identifier-like field before export',
    })));
  }
};

export const reviewDatasetImport = async (id, payload, userId, auditContext = {}) => {
  const existing = await prisma.datasetCase.findUnique({ where: { id }, select: { ...datasetSelect, approvedForTraining: true } });
  if (!existing) throw notFound('Dataset case not found');
  await assertFacilityRole(userId, existing.facilityId, REVIEW_ROLES);
  assertDatasetSourceTypeAllowed(existing.sourceType);
  if (payload.action === 'approve_for_training') {
    await assertFacilityRole(userId, existing.facilityId, DATASET_EXPORT_ROLES);
  }

  let data;
  if (payload.action === 'request_correction') {
    data = { reviewStatus: 'NEEDS_CORRECTION', reviewedByUserId: userId, reviewedAt: new Date() };
  } else if (payload.action === 'approve_for_dataset') {
    data = {
      reviewStatus: 'APPROVED_FOR_DATASET',
      reviewedByUserId: userId,
      reviewedAt: new Date(),
      deidentifiedPayloadJson: deidentifyPayload(payload.correctedPayloadJson || existing.deidentifiedPayloadJson),
    };
  } else if (payload.action === 'approve_for_training') {
    assertTrainingGovernance(payload);
    if (!['APPROVED_FOR_DATASET', 'APPROVED_FOR_TRAINING'].includes(existing.reviewStatus)) {
      throw reviewerRequired('Dataset case must be approved for dataset before training approval.');
    }
    data = {
      reviewStatus: 'APPROVED_FOR_TRAINING',
      approvedForTraining: true,
      approvedByUserId: userId,
      reviewedByUserId: userId,
      reviewedAt: new Date(),
      ethicsApprovalId: payload.ethicsApprovalId,
      datasetVersion: payload.datasetVersion,
      governanceJson: payload.governanceJson,
      deidentifiedPayloadJson: deidentifyPayload(payload.correctedPayloadJson || existing.deidentifiedPayloadJson),
    };
  } else {
    data = {
      reviewStatus: 'EXCLUDED',
      approvedForTraining: false,
      reviewedByUserId: userId,
      reviewedAt: new Date(),
      exclusionReason: payload.exclusionReason || payload.reviewerComment || 'Excluded by reviewer',
    };
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.datasetCase.update({ where: { id }, data, select: datasetSelect });
    await tx.reviewAction.create({
      data: {
        facilityId: existing.facilityId,
        reviewerUserId: userId,
        entityType: 'DatasetCase',
        entityId: id,
        action: payload.action,
        statusBefore: existing.reviewStatus,
        statusAfter: updated.reviewStatus,
        comment: payload.reviewerComment,
        beforeJson: existing,
        afterJson: updated,
      },
    });
    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: existing.facilityId,
      action: payload.action === 'exclude' ? 'DATASET_EXCLUSION' : 'DATASET_REVIEW',
      entityType: 'DatasetCase',
      entityId: id,
      beforeJson: existing,
      afterJson: updated,
      reason: payload.reviewerComment,
    });
    return updated;
  });
};

export const listApprovedDatasets = async (userId, { facilityId, datasetVersion, page, limit }) => {
  const scopedFacilityId = await resolveFacilityScope(userId, facilityId, REVIEW_ROLES);
  const where = {
    ...(scopedFacilityId ? { facilityId: scopedFacilityId } : {}),
    ...(datasetVersion ? { datasetVersion } : {}),
    approvedForTraining: true,
    reviewStatus: 'APPROVED_FOR_TRAINING',
  };
  const [items, total] = await Promise.all([
    prisma.datasetCase.findMany({ where, select: approvedDatasetSelect, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.datasetCase.count({ where }),
  ]);
  return {
    items: items.map((item) => ({
      ...item,
      datasetCard: buildDatasetCard(item),
    })),
    total,
    page,
    limit,
  };
};

export const getDatasetCaseCard = async (id, userId) => {
  const datasetCase = await prisma.datasetCase.findUnique({ where: { id }, select: datasetSelect });
  if (!datasetCase) throw notFound('Dataset case not found');
  await assertFacilityRole(userId, datasetCase.facilityId, DATASET_EXPORT_ROLES);
  assertDatasetSourceTypeAllowed(datasetCase.sourceType);

  return {
    datasetCard: buildDatasetCard(datasetCase),
    exportEligible: (() => {
      try {
        assertDatasetCaseExportEligible(datasetCase);
        return true;
      } catch {
        return false;
      }
    })(),
  };
};

export const exportDatasetCase = async (id, { reason }, userId, auditContext = {}) => {
  const datasetCase = await prisma.datasetCase.findUnique({ where: { id }, select: datasetSelect });
  if (!datasetCase) throw notFound('Dataset case not found');
  await assertFacilityRole(userId, datasetCase.facilityId, DATASET_EXPORT_ROLES);
  assertDatasetCaseExportEligible(datasetCase);

  const exportedAt = new Date();
  const payload = deidentifyPayload(datasetCase.deidentifiedPayloadJson);
  const datasetCard = buildDatasetCard(datasetCase);
  const exportPayload = toJson({
    exportId: sha256(`${datasetCase.id}:${userId}:${auditContext.requestId || ''}:${exportedAt.toISOString()}`).slice(0, 24),
    datasetCaseId: datasetCase.id,
    datasetVersion: datasetCase.datasetVersion,
    ethicsApprovalId: datasetCase.ethicsApprovalId,
    exportedAt,
    datasetCard,
    exportPolicy: DATASET_EXPORT_POLICY,
    payload,
  });

  const auditLog = await writeAudit({
    ...auditContext,
    userId,
    facilityId: datasetCase.facilityId,
    action: 'DATASET_EXPORT',
    entityType: 'DatasetCase',
    entityId: id,
    afterJson: {
      exportId: exportPayload.exportId,
      datasetCaseId: id,
      datasetVersion: datasetCase.datasetVersion,
      ethicsApprovalId: datasetCase.ethicsApprovalId,
      exportedAt,
      datasetCard,
    },
    reason,
  });

  return {
    ...exportPayload,
    audit: {
      auditLogId: auditLog.id,
      action: auditLog.action,
      requestId: auditLog.requestId,
    },
  };
};
