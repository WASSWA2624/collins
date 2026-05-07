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

const toArray = (value) => (Array.isArray(value) ? value : []);

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

  return {
    id: item.admissionId || item.id,
    admissionId: item.admissionId || item.id,
    patientId: item.patientId || patient.id,
    appAdmissionCode: item.appAdmissionCode || '',
    appPatientCode:
      patient.appPatientCode || item.patient?.appPatientCode || '',
    facilityId: item.facilityId || facility.id || '',
    facilityName: facility.name || 'Active facility',
    bedNumber: item.bedNumber || currentStatus.bedNumber || '',
    admissionStatus,
    admissionStatusLabel:
      ADMISSION_STATUS_LABELS[admissionStatus] ||
      titleCaseToken(admissionStatus) ||
      'Status unknown',
    admittedAt: item.admittedAt || currentStatus.admittedAt || null,
    admittedAtLabel: formatDateTime(
      item.admittedAt || currentStatus.admittedAt
    ),
    updatedAt: item.updatedAt || null,
    patientPathway,
    patientPathwayLabel: titleCaseToken(patientPathway) || 'Pathway unknown',
    referenceWeightKg:
      patient.referenceWeightKg ?? item.patient?.referenceWeightKg ?? null,
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
  formatDateTime,
  normalizeTrackingDetail,
  normalizeTrackingItem,
  normalizeTrackingList,
};
