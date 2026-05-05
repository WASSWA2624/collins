/**
 * Dataset Capture Model
 * Parses pasted ICU notes into editable, review-only dataset candidates.
 * File: datasetCapture.model.js
 */

const DATASET_CAPTURE_SOURCE_TYPE = 'pasted_note_capture';

const DATASET_CAPTURE_ROLES = Object.freeze([
  'platform_admin',
  'facility_admin',
  'clinician',
  'icu_nurse',
  'specialist_reviewer',
  'research_governance_officer',
]);

const DATASET_TRAINING_APPROVAL_ROLES = Object.freeze([
  'platform_admin',
  'research_governance_officer',
]);

const DATASET_CAPTURE_FIELD_DEFINITIONS = Object.freeze([
  { path: 'patient.ageYears', label: 'Age years', section: 'Patient', type: 'number' },
  { path: 'patient.sexForSizeCalculations', label: 'Sex for size calculations', section: 'Patient', type: 'text' },
  { path: 'clinicalSnapshot.spo2', label: 'SpO2', section: 'Clinical snapshot', type: 'number' },
  { path: 'clinicalSnapshot.fio2', label: 'FiO2', section: 'Clinical snapshot', type: 'number' },
  { path: 'clinicalSnapshot.respiratoryRate', label: 'Respiratory rate', section: 'Clinical snapshot', type: 'number' },
  { path: 'abgTest.ph', label: 'pH', section: 'ABG', type: 'number' },
  { path: 'abgTest.pao2', label: 'PaO2', section: 'ABG', type: 'number' },
  { path: 'abgTest.paco2', label: 'PaCO2', section: 'ABG', type: 'number' },
  { path: 'abgTest.hco3', label: 'HCO3', section: 'ABG', type: 'number' },
  { path: 'abgTest.lactate', label: 'Lactate', section: 'ABG', type: 'number' },
  { path: 'ventilatorSetting.mode', label: 'Mode', section: 'Ventilator', type: 'text' },
  { path: 'ventilatorSetting.tidalVolumeMl', label: 'Tidal volume mL', section: 'Ventilator', type: 'number' },
  { path: 'ventilatorSetting.respiratoryRateSet', label: 'Set respiratory rate', section: 'Ventilator', type: 'number' },
  { path: 'ventilatorSetting.peep', label: 'PEEP', section: 'Ventilator', type: 'number' },
  { path: 'ventilatorSetting.plateauPressure', label: 'Plateau pressure', section: 'Ventilator', type: 'number' },
  { path: 'ventilatorSetting.peakPressure', label: 'Peak pressure', section: 'Ventilator', type: 'number' },
]);

const NUMERIC_FIELD_PATHS = new Set(
  DATASET_CAPTURE_FIELD_DEFINITIONS
    .filter((field) => field.type === 'number')
    .map((field) => field.path)
);

const emptyPreview = () => ({
  patient: {
    ageYears: null,
    sexForSizeCalculations: null,
  },
  clinicalSnapshot: {
    spo2: null,
    fio2: null,
    respiratoryRate: null,
  },
  abgTest: {
    ph: null,
    pao2: null,
    paco2: null,
    hco3: null,
    lactate: null,
  },
  ventilatorSetting: {
    mode: null,
    tidalVolumeMl: null,
    respiratoryRateSet: null,
    peep: null,
    plateauPressure: null,
    peakPressure: null,
  },
  parserWarnings: [
    'Structured preview requires human review before dataset use.',
    'Raw note text is not submitted or stored with approved datasets.',
  ],
});

const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const extractNumber = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const value = Number(match[1]);
    if (Number.isFinite(value)) return value;
  }
  return null;
};

const extractMode = (text) => {
  const match = text.match(/\bmode\s*[:=]?\s*([A-Za-z0-9 /+-]{2,20})/i);
  return match?.[1]?.trim() || null;
};

const normalizeSex = (text) => {
  if (/\b(male|man)\b/i.test(text)) return 'MALE';
  if (/\b(female|woman)\b/i.test(text)) return 'FEMALE';
  return null;
};

const getByPath = (value, path) => path.split('.').reduce((acc, key) => acc?.[key], value);

const setByPath = (target, path, value) => {
  const parts = path.split('.');
  const last = parts.pop();
  const parent = parts.reduce((acc, key) => {
    if (!acc[key] || typeof acc[key] !== 'object') acc[key] = {};
    return acc[key];
  }, target);
  parent[last] = value;
  return target;
};

const normalizeEditableValue = (path, value) => {
  if (value === null || value === undefined) return null;
  if (!NUMERIC_FIELD_PATHS.has(path)) {
    const text = String(value).trim();
    return text || null;
  }
  if (String(value).trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const flattenDatasetPreview = (preview) => Object.fromEntries(
  DATASET_CAPTURE_FIELD_DEFINITIONS.map((field) => {
    const value = getByPath(preview, field.path);
    return [field.path, value === null || value === undefined ? '' : String(value)];
  })
);

const hydrateDatasetPreview = (fieldValues = {}) => {
  const preview = emptyPreview();
  DATASET_CAPTURE_FIELD_DEFINITIONS.forEach((field) => {
    setByPath(preview, field.path, normalizeEditableValue(field.path, fieldValues[field.path]));
  });
  return preview;
};

const getMissingDatasetFields = (preview) => DATASET_CAPTURE_FIELD_DEFINITIONS
  .filter((field) => {
    const value = getByPath(preview, field.path);
    return value === null || value === undefined || value === '';
  })
  .map((field) => field.path);

const detectIdentifierWarnings = (noteText) => {
  const text = String(noteText || '');
  const warnings = [];
  if (/\b(MRN|medical record|hospital\s*(no|number)|patient\s*(id|name))\b/i.test(text)) {
    warnings.push('identifier_like_field_detected');
  }
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text)) warnings.push('email_detected');
  if (/\+?\d[\d\s().-]{7,}\d/.test(text)) warnings.push('phone_like_value_detected');
  return [...new Set(warnings)];
};

const detectUncertaintyFields = (preview, noteText) => {
  const uncertain = [];
  const text = String(noteText || '');
  if (/\b(about|approx|approximately|estimated|maybe|unclear|unknown)\b/i.test(text)) {
    uncertain.push('patient.ageYears');
  }
  if (preview.patient.sexForSizeCalculations === null) uncertain.push('patient.sexForSizeCalculations');
  if (preview.clinicalSnapshot.fio2 !== null && (preview.clinicalSnapshot.fio2 < 0.21 || preview.clinicalSnapshot.fio2 > 1)) {
    uncertain.push('clinicalSnapshot.fio2');
  }
  if (preview.abgTest.ph !== null && (preview.abgTest.ph < 6.8 || preview.abgTest.ph > 7.8)) {
    uncertain.push('abgTest.ph');
  }
  return [...new Set(uncertain)];
};

const parseDatasetCaptureNote = (noteText) => {
  const text = normalizeText(noteText);
  const preview = emptyPreview();
  preview.patient.ageYears = extractNumber(text, [/\bage\s*[:=]?\s*(\d{1,3})\b/i, /\b(\d{1,3})\s*y(?:ears?)?\b/i]);
  preview.patient.sexForSizeCalculations = normalizeSex(text);
  preview.clinicalSnapshot.spo2 = extractNumber(text, [/spo2\s*[:=]?\s*(\d{2,3})/i, /saturation\s*[:=]?\s*(\d{2,3})/i]);
  const fio2 = extractNumber(text, [/fio2\s*[:=]?\s*(0?\.\d{1,2})/i, /fio2\s*[:=]?\s*(\d{2,3})\s*%/i]);
  preview.clinicalSnapshot.fio2 = fio2 && fio2 > 1 ? Number((fio2 / 100).toFixed(2)) : fio2;
  preview.clinicalSnapshot.respiratoryRate = extractNumber(text, [/\bRR\s*[:=]?\s*(\d{1,3})/i, /respiratory rate\s*[:=]?\s*(\d{1,3})/i]);
  preview.abgTest.ph = extractNumber(text, [/\bpH\s*[:=]?\s*(\d\.\d{1,3})/i]);
  preview.abgTest.pao2 = extractNumber(text, [/pa[o0]2\s*[:=]?\s*(\d{1,3})/i]);
  preview.abgTest.paco2 = extractNumber(text, [/pa[cC][o0]2\s*[:=]?\s*(\d{1,3})/i]);
  preview.abgTest.hco3 = extractNumber(text, [/hco3\s*[:=]?\s*(\d{1,3})/i]);
  preview.abgTest.lactate = extractNumber(text, [/lactate\s*[:=]?\s*(\d+(?:\.\d+)?)/i]);
  preview.ventilatorSetting.mode = extractMode(text);
  preview.ventilatorSetting.tidalVolumeMl = extractNumber(text, [/\bVT\s*[:=]?\s*(\d{2,4})/i, /tidal volume\s*[:=]?\s*(\d{2,4})/i]);
  preview.ventilatorSetting.respiratoryRateSet = extractNumber(text, [/set\s*RR\s*[:=]?\s*(\d{1,3})/i]);
  preview.ventilatorSetting.peep = extractNumber(text, [/PEEP\s*[:=]?\s*(\d{1,2})/i]);
  preview.ventilatorSetting.plateauPressure = extractNumber(text, [/plateau\s*[:=]?\s*(\d{1,2})/i]);
  preview.ventilatorSetting.peakPressure = extractNumber(text, [/peak\s*[:=]?\s*(\d{1,2})/i]);

  return {
    structuredPreviewJson: preview,
    fieldValues: flattenDatasetPreview(preview),
    missingFields: getMissingDatasetFields(preview),
    uncertaintyFields: detectUncertaintyFields(preview, noteText),
    identifierWarnings: detectIdentifierWarnings(noteText),
    noteStorage: 'raw_note_not_saved',
  };
};

const createDatasetCaptureClientRecordId = (prefix = 'dataset-capture') => {
  const timestamp = Date.now().toString(36);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${timestamp}-${suffix}`;
};

const buildDatasetCaptureSubmission = ({
  facilityId,
  fieldValues,
  idempotencyKey,
  clientRecordId,
  submittedAt,
} = {}) => {
  const recordId = clientRecordId || createDatasetCaptureClientRecordId();
  return {
    facilityId,
    sourceType: DATASET_CAPTURE_SOURCE_TYPE,
    structuredPreviewJson: hydrateDatasetPreview(fieldValues),
    governanceJson: {
      captureType: 'pasted_note',
      rawNoteStored: false,
      externalModelServicesUsed: false,
      pendingHumanReview: true,
      submittedAt: submittedAt || new Date().toISOString(),
    },
    idempotencyKey: idempotencyKey || recordId,
    clientRecordId: recordId,
    clientCreatedAt: submittedAt,
    clientUpdatedAt: submittedAt,
  };
};

const normalizeRoles = (roles) => (Array.isArray(roles) ? roles : [roles])
  .map((role) => String(role || '').trim().toLowerCase())
  .filter(Boolean);

const hasAnyRole = (roles, allowedRoles) => {
  const normalized = normalizeRoles(roles);
  return normalized.some((role) => allowedRoles.includes(role));
};

const canCaptureDatasetCandidate = (roles) => hasAnyRole(roles, DATASET_CAPTURE_ROLES);
const canApproveTrainingDataset = (roles) => hasAnyRole(roles, DATASET_TRAINING_APPROVAL_ROLES);

const resolveDatasetCaptureFacilityId = (user) => {
  const active = user?.activeFacility;
  if (active?.facilityId) return active.facilityId;
  if (active?.id) return active.id;
  const membership = Array.isArray(user?.memberships)
    ? user.memberships.find((item) => item?.status === 'APPROVED' && item?.facilityId)
    : null;
  return membership?.facilityId || null;
};

export {
  DATASET_CAPTURE_FIELD_DEFINITIONS,
  DATASET_CAPTURE_ROLES,
  DATASET_CAPTURE_SOURCE_TYPE,
  DATASET_TRAINING_APPROVAL_ROLES,
  buildDatasetCaptureSubmission,
  canApproveTrainingDataset,
  canCaptureDatasetCandidate,
  createDatasetCaptureClientRecordId,
  detectIdentifierWarnings,
  flattenDatasetPreview,
  getMissingDatasetFields,
  hydrateDatasetPreview,
  parseDatasetCaptureNote,
  resolveDatasetCaptureFacilityId,
};
