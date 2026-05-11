/**
 * Tracking model helpers
 * Converts backend tracking records into stable, role-neutral UI rows.
 * File: tracking.model.js
 */

const REVIEW_STATUS_LABELS = Object.freeze({
  PENDING: 'Review',
  APPROVED: 'Reviewed',
  CORRECTION_REQUESTED: 'Correction requested',
  EXCLUDED: 'Excluded',
});

const SYNC_STATUS_LABELS = Object.freeze({
  conflict: 'Conflict',
  retryable: 'Needs sync review',
  synced: 'Synced',
  duplicate: 'Synced duplicate',
  waiting_to_sync: 'Waiting to sync',
  local_draft: 'Draft',
  failed_validation: 'Validation failed',
  needs_review: 'Needs review',
  reviewed: 'Reviewed',
  not_submitted: 'Not submitted',
});

const ADMISSION_STATUS_LABELS = Object.freeze({
  ACTIVE: 'Active',
  TRANSFERRED: 'Transferred',
  DISCHARGED: 'Discharged',
  DECEASED: 'Deceased',
  CANCELLED: 'Cancelled',
});

const formatDateTime = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

const formatDate = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    dateStyle: 'medium',
  });
};

const formatDateShort = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    dateStyle: 'short',
  });
};

const formatTime = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString(undefined, {
    timeStyle: 'short',
  });
};

const toArray = (value) => (Array.isArray(value) ? value : []);

const cleanString = (value) =>
  typeof value === 'string' ? value.trim() : '';

const getFiniteNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const formatCompactNumber = (value) => {
  const numeric = getFiniteNumber(value);
  if (numeric === null) return '';
  if (Number.isInteger(numeric)) return String(numeric);
  return String(Number(numeric.toFixed(1)));
};

const getPatientValue = (primaryPatient, fallbackPatient, key) => {
  const value = primaryPatient?.[key];
  return value === null || value === undefined || value === ''
    ? fallbackPatient?.[key]
    : value;
};

const buildPatientDisplayName = (
  primaryPatient = {},
  fallbackPatient = {},
  item = {}
) => {
  const firstName = cleanString(
    getPatientValue(primaryPatient, fallbackPatient, 'firstName')
  );
  const lastName = cleanString(
    getPatientValue(primaryPatient, fallbackPatient, 'lastName')
  );
  const composedName = [firstName, lastName].filter(Boolean).join(' ');
  return (
    composedName ||
    cleanString(
      getPatientValue(primaryPatient, fallbackPatient, 'optionalName')
    ) ||
    cleanString(item.optionalName)
  );
};

const buildAgeLabel = (primaryPatient = {}, fallbackPatient = {}) => {
  const years = formatCompactNumber(
    getPatientValue(primaryPatient, fallbackPatient, 'ageYears')
  );
  const months = formatCompactNumber(
    getPatientValue(primaryPatient, fallbackPatient, 'ageMonths')
  );
  const days = formatCompactNumber(
    getPatientValue(primaryPatient, fallbackPatient, 'ageDays')
  );

  return [
    years ? `${years}y` : '',
    months ? `${months}m` : '',
    days ? `${days}d` : '',
  ]
    .filter(Boolean)
    .join(' ');
};

const compactCodeToken = (value) =>
  String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

const buildPatientCode = (...values) => {
  for (const value of values) {
    const token = compactCodeToken(value);
    if (!token) continue;
    if (token.length <= 6) return token;
    return token.slice(-6);
  }
  return '';
};

const normalizeSearchText = (value) =>
  String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const addSearchValue = (values, value, depth = 0, seen = new Set()) => {
  if (value === null || value === undefined || depth > 4) return;
  if (value instanceof Date) {
    values.push(formatDateTime(value), value.toISOString());
    return;
  }
  if (['string', 'number', 'boolean'].includes(typeof value)) {
    values.push(String(value));
    return;
  }
  if (typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((item) => addSearchValue(values, item, depth + 1, seen));
    return;
  }

  Object.values(value).forEach((item) =>
    addSearchValue(values, item, depth + 1, seen)
  );
};

const buildTrackingSearchText = ({
  item,
  patient,
  facility,
  currentStatus,
  admissionStatus,
  patientPathway,
  patientCode,
  missingData,
  risk,
}) => {
  const values = [
    item.admissionId,
    item.id,
    item.patientId,
    patientCode,
    item.appAdmissionCode,
    item.optionalName,
    item.bedNumber,
    admissionStatus,
    patientPathway,
    facility.id,
    facility.name,
    risk.label,
    risk.prompt,
    ...toStringList(missingData),
  ];

  addSearchValue(values, patient);
  addSearchValue(values, currentStatus?.patient);

  return values.map(normalizeSearchText).filter(Boolean).join(' ');
};

const getSearchTokens = (query) =>
  normalizeSearchText(query).split(/\s+/).filter(Boolean);

const matchesTrackingSearch = (row, query) => {
  const tokens = getSearchTokens(query);
  if (tokens.length === 0) return true;
  let searchText = row?.searchText;
  if (!searchText) {
    const values = [];
    addSearchValue(values, row);
    searchText = values.map(normalizeSearchText).filter(Boolean).join(' ');
  }
  return tokens.every((token) => searchText.includes(token));
};

const filterTrackingRows = (rows = [], query = '') =>
  toArray(rows).filter((row) => matchesTrackingSearch(row, query));

const toStringList = (value) =>
  (Array.isArray(value) ? value : value ? [value] : [])
    .map((item) =>
      typeof item === 'string'
        ? item.trim()
        : String(item?.field || item?.label || item || '').trim()
    )
    .filter(Boolean);

const titleCaseToken = (value) =>
  String(value || '')
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getFirstClinicalFlagSeverity = (summary = {}) => {
  const flags = [
    ...toArray(summary.flags),
    ...toArray(summary.abg?.flags),
    ...toArray(summary.humidificationFlags),
  ];
  if (flags.some((flag) => flag?.severity === 'red')) return 'red';
  if (flags.some((flag) => flag?.severity === 'yellow')) return 'yellow';
  return null;
};

const getRiskState = (item = {}) => {
  const syncState = item.syncState || {};
  const reviewState = item.reviewState || {};
  const summary = item.currentStatus?.clinicalSummary || {};
  const missingData = toStringList(
    item.currentStatus?.advisory?.missingData || summary.missingData
  );
  const flagSeverity = getFirstClinicalFlagSeverity(summary);

  if (syncState.hasConflicts || syncState.overallStatus === 'conflict') {
    return {
      level: 'red',
      label: 'Conflict',
      prompt: 'Review conflict before using synced status.',
    };
  }
  if (flagSeverity === 'red') {
    return {
      level: 'red',
      label: 'High attention',
      prompt: 'Consider urgent senior review.',
    };
  }
  if (reviewState.needsReview || reviewState.correctionRequestedCount > 0) {
    return {
      level: 'yellow',
      label: 'Needs review',
      prompt: 'Review clinical record and consider senior review.',
    };
  }
  if (flagSeverity === 'yellow' || missingData.length > 0) {
    return {
      level: 'yellow',
      label: 'Missing data',
      prompt: 'Review missing data when available.',
    };
  }
  return {
    level: 'green',
    label: 'Stable tracking',
    prompt: 'Continue scheduled review.',
  };
};

const getReviewLabel = (reviewState = {}) => {
  if (reviewState.correctionRequestedCount > 0)
    return REVIEW_STATUS_LABELS.CORRECTION_REQUESTED;
  if (reviewState.needsReview) return REVIEW_STATUS_LABELS.PENDING;
  const status = reviewState.admissionReviewStatus;
  return (
    REVIEW_STATUS_LABELS[status] ||
    titleCaseToken(status) ||
    'Review status unknown'
  );
};

const getSyncLabel = (syncState = {}) => {
  const status =
    syncState.overallStatus || syncState.latestStatus || 'not_submitted';
  return (
    SYNC_STATUS_LABELS[status] ||
    titleCaseToken(status) ||
    'Sync status unknown'
  );
};

const normalizeTrackingItem = (item = {}) => {
  const currentStatus = item.currentStatus || {};
  const patient = currentStatus.patient || item.patient || {};
  const admissionPatient = item.patient || {};
  const facility = item.facility || {};
  const clinicalSummary = currentStatus.clinicalSummary || {};
  const missingData = toStringList(
    currentStatus.advisory?.missingData || clinicalSummary.missingData
  );
  const risk = getRiskState(item);
  const admissionStatus =
    item.status || currentStatus.admissionStatus || 'ACTIVE';
  const patientPathway =
    patient.patientPathway || item.patient?.patientPathway || 'UNKNOWN';
  const patientDisplayName = buildPatientDisplayName(
    patient,
    admissionPatient,
    item
  );
  const dateOfBirth = getPatientValue(patient, admissionPatient, 'dateOfBirth');
  const admittedAt = item.admittedAt || currentStatus.admittedAt || null;
  const patientCode = buildPatientCode(
    patient.appPatientCode,
    item.patient?.appPatientCode,
    patient.id,
    item.patientId
  );
  const searchText = buildTrackingSearchText({
    item,
    patient: item.patient || patient,
    facility,
    currentStatus,
    admissionStatus,
    patientPathway,
    patientCode,
    missingData,
    risk,
  });

  return {
    id: item.admissionId || item.id,
    admissionId: item.admissionId || item.id,
    patientId: item.patientId || patient.id,
    patientCode,
    appAdmissionCode: item.appAdmissionCode || '',
    optionalName: patientDisplayName,
    firstName: getPatientValue(patient, admissionPatient, 'firstName') || '',
    lastName: getPatientValue(patient, admissionPatient, 'lastName') || '',
    appPatientCode:
      patient.appPatientCode || item.patient?.appPatientCode || '',
    hospitalNumber:
      getPatientValue(patient, admissionPatient, 'hospitalNumber') || '',
    dateOfBirth: dateOfBirth || null,
    dateOfBirthLabel: formatDate(dateOfBirth),
    ageYears: getPatientValue(patient, admissionPatient, 'ageYears') ?? null,
    ageMonths: getPatientValue(patient, admissionPatient, 'ageMonths') ?? null,
    ageDays: getPatientValue(patient, admissionPatient, 'ageDays') ?? null,
    ageLabel: buildAgeLabel(patient, admissionPatient),
    estimatedAge:
      getPatientValue(patient, admissionPatient, 'estimatedAge') ?? null,
    gestationalAgeWeeks:
      getPatientValue(patient, admissionPatient, 'gestationalAgeWeeks') ??
      null,
    correctedAgeWeeks:
      getPatientValue(patient, admissionPatient, 'correctedAgeWeeks') ?? null,
    sexForSizeCalculations:
      getPatientValue(patient, admissionPatient, 'sexForSizeCalculations') ||
      '',
    actualWeightKg:
      getPatientValue(patient, admissionPatient, 'actualWeightKg') ?? null,
    heightOrLengthCm:
      getPatientValue(patient, admissionPatient, 'heightOrLengthCm') ?? null,
    facilityId: item.facilityId || facility.id || '',
    facilityName: facility.name || 'Active facility',
    bedNumber: item.bedNumber || currentStatus.bedNumber || '',
    admissionStatus,
    admissionStatusLabel:
      ADMISSION_STATUS_LABELS[admissionStatus] ||
      titleCaseToken(admissionStatus) ||
      'Status unknown',
    admittedAt,
    admittedAtLabel: formatDateTime(admittedAt),
    admittedDateLabel: formatDateShort(admittedAt),
    admittedTimeLabel: formatTime(admittedAt),
    updatedAt: item.updatedAt || null,
    patientPathway,
    patientPathwayLabel: titleCaseToken(patientPathway) || 'Pathway unknown',
    referenceWeightKg:
      getPatientValue(patient, admissionPatient, 'referenceWeightKg') ?? null,
    referenceWeightMethod:
      getPatientValue(patient, admissionPatient, 'referenceWeightMethod') ||
      '',
    reviewLabel: getReviewLabel(item.reviewState),
    syncLabel: getSyncLabel(item.syncState),
    risk,
    missingData,
    missingDataLabel:
      missingData.length > 0
        ? missingData.join(', ')
        : 'No missing data flagged',
    currentStatus,
    reviewState: item.reviewState || {},
    syncState: item.syncState || {},
    searchText,
    raw: item,
  };
};

const normalizeTrackingList = (items = []) =>
  toArray(items)
    .map(normalizeTrackingItem)
    .filter((item) => item.admissionId);

const normalizeTrackingDetail = (tracking = {}) => {
  const admission = tracking?.admission || {};
  return {
    ...tracking,
    row: normalizeTrackingItem({
      ...admission,
      admissionId: admission.id || tracking?.admissionId,
      currentStatus: tracking?.currentStatus,
      reviewState: tracking?.reviewState,
      syncState: tracking?.syncState,
    }),
    timeline: toArray(tracking?.timeline),
  };
};

export {
  ADMISSION_STATUS_LABELS,
  REVIEW_STATUS_LABELS,
  SYNC_STATUS_LABELS,
  filterTrackingRows,
  formatDateTime,
  matchesTrackingSearch,
  normalizeTrackingDetail,
  normalizeTrackingItem,
  normalizeTrackingList,
  normalizeSearchText,
};
