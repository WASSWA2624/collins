import { MEMBERSHIP_ROLES } from '../../constants/roles.js';
import { READ_ROLES } from '../../utils/authorization.js';

export const DASHBOARD_WINDOW_DEFAULT_DAYS = 14;
export const DASHBOARD_WINDOW_MAX_DAYS = 90;

export const CLINICIAN_DASHBOARD_ROLES = Object.freeze(READ_ROLES);

export const ADMIN_DASHBOARD_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
]);

export const GOVERNANCE_DASHBOARD_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
]);

export const REVIEW_BACKLOG_STATUSES = Object.freeze(['PENDING', 'CORRECTION_REQUESTED']);

export const DATASET_QUEUE_STATUSES = Object.freeze([
  'SUBMITTED',
  'NEEDS_CORRECTION',
  'REVIEWED',
  'APPROVED_FOR_DATASET',
]);

export const SYNC_ATTENTION_STATUSES = Object.freeze([
  'CONFLICT',
  'FAILED',
  'FAILED_VALIDATION',
  'NEEDS_REVIEW',
]);

export const REFERENCE_APPROVED_STATUSES = Object.freeze([
  'approved',
  'verified',
  'active',
]);

export const REFERENCE_RETIRED_STATUSES = Object.freeze([
  'retired',
  'superseded',
]);
