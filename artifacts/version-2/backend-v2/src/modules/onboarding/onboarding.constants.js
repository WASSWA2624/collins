import { REQUESTABLE_MEMBERSHIP_ROLE_VALUES } from '../../constants/roles.js';
import { sha256 } from '../../utils/crypto.js';

export const ONBOARDING_STEPS = Object.freeze([
  'WELCOME',
  'CLINICAL_SAFETY',
  'USER_SETUP',
  'FACILITY_SELECTION',
  'MEMBERSHIP_REQUEST',
  'COMPLETED',
]);

export const ONBOARDING_STATUSES = Object.freeze([
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
]);

export const ONBOARDING_REQUESTABLE_ROLES = REQUESTABLE_MEMBERSHIP_ROLE_VALUES;

export const CLINICAL_SAFETY_ACKNOWLEDGEMENT = Object.freeze({
  code: 'CLINICAL_SAFETY',
  version: 'clinical-safety@2026-05-05',
  required: true,
  statement: 'AI Vent provides documentation support and advisory safety prompts only. It does not replace clinical judgement, issue treatment orders, or determine ventilator settings. A qualified clinician confirms all clinical decisions.',
});

export const CLINICAL_SAFETY_STATEMENT_HASH = sha256({
  code: CLINICAL_SAFETY_ACKNOWLEDGEMENT.code,
  version: CLINICAL_SAFETY_ACKNOWLEDGEMENT.version,
  statement: CLINICAL_SAFETY_ACKNOWLEDGEMENT.statement,
});
