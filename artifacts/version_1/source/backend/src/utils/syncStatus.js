export const RETRYABLE_SYNC_STATUSES = Object.freeze([
  'CONFLICT',
  'FAILED',
  'FAILED_VALIDATION',
  'NEEDS_REVIEW',
]);

export const toPublicSyncStatus = (status) => ({
  SYNCED: 'synced',
  DUPLICATE: 'duplicate',
  CONFLICT: 'conflict',
  FAILED_VALIDATION: 'failed_validation',
  NEEDS_REVIEW: 'needs_review',
  FAILED: 'failed',
  LOCAL_DRAFT: 'local_draft',
  WAITING_TO_SYNC: 'waiting_to_sync',
  SYNCING: 'syncing',
  REVIEWED: 'reviewed',
}[status] || 'failed');

export const isRetryableSyncStatus = (status) => RETRYABLE_SYNC_STATUSES.includes(status);
