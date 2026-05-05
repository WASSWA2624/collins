/**
 * Review Queue Model
 * Normalizes backend review queue contracts for reviewer-facing UI.
 * File: review.model.js
 */

const REVIEW_ENTITY_TYPES = Object.freeze({
  ADMISSION: 'admission',
  ABG_TEST: 'abg-test',
  VENTILATOR_SETTING: 'ventilator-setting',
  DATASET_CASE: 'dataset-case',
  REFERENCE_RULE: 'reference-rule',
  SYNC_CONFLICT: 'sync-conflict',
});

const REVIEW_ACTIONS = Object.freeze({
  APPROVE: 'approve',
  REQUEST_CORRECTION: 'request_correction',
  EXCLUDE: 'exclude',
  TRIAGE: 'triage',
});

const REVIEW_ROLES = Object.freeze([
  'platform_admin',
  'facility_admin',
  'specialist_reviewer',
  'research_governance_officer',
]);

const REVIEW_PERMISSIONS = Object.freeze(['review:write']);

const ENTITY_TYPE_OPTIONS = Object.freeze([
  { value: '', labelKey: 'reviewQueue.filters.all' },
  { value: REVIEW_ENTITY_TYPES.ADMISSION, labelKey: 'reviewQueue.entityTypes.admission' },
  { value: REVIEW_ENTITY_TYPES.ABG_TEST, labelKey: 'reviewQueue.entityTypes.abg-test' },
  { value: REVIEW_ENTITY_TYPES.VENTILATOR_SETTING, labelKey: 'reviewQueue.entityTypes.ventilator-setting' },
  { value: REVIEW_ENTITY_TYPES.DATASET_CASE, labelKey: 'reviewQueue.entityTypes.dataset-case' },
  { value: REVIEW_ENTITY_TYPES.REFERENCE_RULE, labelKey: 'reviewQueue.entityTypes.reference-rule' },
  { value: REVIEW_ENTITY_TYPES.SYNC_CONFLICT, labelKey: 'reviewQueue.entityTypes.sync-conflict' },
]);

const normalizeText = (value) => String(value || '').trim().toLowerCase();
const asArray = (value) => (Array.isArray(value) ? value : []);

const getUserRoles = (user = {}) => [
  ...asArray(user.roles),
  ...asArray(user.roleSummaries).map((summary) => summary?.role),
  ...asArray(user.activeFacility?.roles),
].map(normalizeText).filter(Boolean);

const getUserPermissions = (user = {}) => [
  ...asArray(user.permissions),
  ...asArray(user.activeFacility?.permissions),
  ...asArray(user.memberships).flatMap((membership) => asArray(membership?.permissions)),
].map(normalizeText).filter(Boolean);

const canUserReview = (user = {}) => {
  const roles = new Set(getUserRoles(user));
  const permissions = new Set(getUserPermissions(user));
  return REVIEW_ROLES.some((role) => roles.has(role)) || REVIEW_PERMISSIONS.some((permission) => permissions.has(permission));
};

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const buildReviewItemTitle = ({ entityType, entityId, item }) => {
  if (entityType === REVIEW_ENTITY_TYPES.ADMISSION) {
    return `Admission ${item?.appAdmissionCode || entityId}`;
  }
  if (entityType === REVIEW_ENTITY_TYPES.ABG_TEST) {
    return `ABG ${formatDate(item?.collectedAt) || entityId}`;
  }
  if (entityType === REVIEW_ENTITY_TYPES.VENTILATOR_SETTING) {
    return `Ventilator settings ${formatDate(item?.measuredAt) || entityId}`;
  }
  if (entityType === REVIEW_ENTITY_TYPES.DATASET_CASE) {
    return `Dataset case ${item?.sourceType || entityId}`;
  }
  if (entityType === REVIEW_ENTITY_TYPES.REFERENCE_RULE) {
    return `Reference range ${item?.name || item?.parameterName || entityId}`;
  }
  if (entityType === REVIEW_ENTITY_TYPES.SYNC_CONFLICT) {
    return `Sync ${item?.operation || entityId}`;
  }
  return entityId;
};

const getDatasetReadiness = (item = {}) => {
  if (!item || typeof item !== 'object') return null;
  const governance = item.governanceJson || {};
  const governanceChecks = {
    facilityApproval: governance.facilityApproval === true,
    dataSharingAgreement: governance.dataSharingAgreement === true,
    deidentificationReviewed: governance.deidentificationReviewed === true,
  };
  const missingGovernance = Object.entries(governanceChecks)
    .filter(([, ready]) => !ready)
    .map(([key]) => key);

  return {
    approvedForDataset: item.reviewStatus === 'APPROVED_FOR_DATASET' || item.reviewStatus === 'APPROVED_FOR_TRAINING',
    approvedForTraining: item.approvedForTraining === true && item.reviewStatus === 'APPROVED_FOR_TRAINING',
    ethicsApprovalPresent: Boolean(item.ethicsApprovalId),
    datasetVersionPresent: Boolean(item.datasetVersion),
    missingGovernance,
  };
};

const normalizeReviewQueueItem = (value = {}) => {
  const entityType = value.entityType || '';
  const entityId = String(value.entityId || value.item?.id || '');
  const item = value.item && typeof value.item === 'object' ? value.item : {};
  const triage = value.triage && typeof value.triage === 'object' ? value.triage : {};
  const missingData = asArray(triage.missingData);
  const warnings = asArray(triage.warnings);
  const syncConflict = triage.syncConflict || null;

  return {
    entityType,
    entityId,
    facilityId: value.facilityId || item.facilityId || null,
    reviewStatus: value.reviewStatus || item.reviewStatus || item.verificationStatus || item.status || null,
    title: buildReviewItemTitle({ entityType, entityId, item }),
    item,
    triage: {
      priority: triage.priority || 'standard',
      validationStatus: triage.validationStatus || null,
      missingData,
      permittedMissingFields: asArray(triage.permittedMissingFields),
      uncertainty: triage.uncertainty || null,
      warnings,
      syncConflict,
      needsOverrideReason: triage.needsOverrideReason === true,
      returnedToClinician: triage.returnedToClinician === true,
      latestComment: triage.latestComment || null,
      latestOverrideReason: triage.latestOverrideReason || null,
      latestReviewedAt: triage.latestReviewedAt || null,
    },
    datasetReadiness: entityType === REVIEW_ENTITY_TYPES.DATASET_CASE ? getDatasetReadiness(item) : null,
    hasConflict: entityType === REVIEW_ENTITY_TYPES.SYNC_CONFLICT || Boolean(syncConflict),
    needsAttentionCount: missingData.length + warnings.length + (syncConflict ? 1 : 0) + (triage.needsOverrideReason ? 1 : 0),
  };
};

const normalizeReviewQueueResponse = (response = {}) => ({
  items: asArray(response.items || response.data).map(normalizeReviewQueueItem),
  meta: {
    total: Number(response.meta?.total || 0),
    page: Number(response.meta?.page || 1),
    limit: Number(response.meta?.limit || 20),
    hasNextPage: response.meta?.hasNextPage === true,
  },
});

const buildReviewQueueSummary = (items = []) => {
  const list = asArray(items);
  return {
    total: list.length,
    urgent: list.filter((item) => item.triage.priority === 'urgent').length,
    corrections: list.filter((item) => item.triage.returnedToClinician).length,
    conflicts: list.filter((item) => item.hasConflict).length,
    datasetReady: list.filter((item) => item.datasetReadiness?.approvedForDataset).length,
  };
};

export {
  ENTITY_TYPE_OPTIONS,
  REVIEW_ACTIONS,
  REVIEW_ENTITY_TYPES,
  REVIEW_PERMISSIONS,
  REVIEW_ROLES,
  buildReviewQueueSummary,
  canUserReview,
  normalizeReviewQueueItem,
  normalizeReviewQueueResponse,
};
