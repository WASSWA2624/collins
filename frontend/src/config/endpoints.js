/**
 * AI Vent API Endpoints Registry
 * Central source of truth for backend routes.
 */

import { API_BASE_URL, API_VERSION } from '@config/env';

const normalizeBaseUrl = (value) => String(value || '').replace(/\/+$/, '');
const baseUrl = `${normalizeBaseUrl(API_BASE_URL)}/api/${API_VERSION}`;

export const endpoints = {
  HEALTH: `${baseUrl}/health`,

  HOME: {
    SUMMARY: `${baseUrl}/home/summary`,
  },

  AUTH: {
    CSRF_TOKEN: `${baseUrl}/auth/csrf-token`,
    IDENTIFY: `${baseUrl}/auth/identify`,
    REGISTER: `${baseUrl}/auth/register`,
    LOGIN: `${baseUrl}/auth/login`,
    REFRESH: `${baseUrl}/auth/refresh`,
    LOGOUT: `${baseUrl}/auth/logout`,
    ME: `${baseUrl}/auth/me`,
    FORGOT_PASSWORD: `${baseUrl}/auth/forgot-password`,
    RESET_PASSWORD: `${baseUrl}/auth/reset-password`,
    CHANGE_PASSWORD: `${baseUrl}/auth/change-password`,
    VERIFY_EMAIL: `${baseUrl}/auth/verify-email`,
    VERIFY_PHONE: `${baseUrl}/auth/verify-phone`,
    RESEND_VERIFICATION: `${baseUrl}/auth/resend-verification`,
    MFA_VERIFY: `${baseUrl}/auth/mfa/verify`,
    MFA_RESEND: `${baseUrl}/auth/mfa/resend`,
  },

  ONBOARDING: {
    CONFIG: `${baseUrl}/onboarding/config`,
    STATE: `${baseUrl}/onboarding/state`,
    ACKNOWLEDGE_CLINICAL_SAFETY: `${baseUrl}/onboarding/clinical-safety/acknowledgement`,
  },

  FACILITIES: {
    SEARCH: `${baseUrl}/facilities/search`,
    LIST: `${baseUrl}/facilities`,
    CREATE: `${baseUrl}/facilities`,
    GET: (id) => `${baseUrl}/facilities/${id}`,
    UPDATE: (id) => `${baseUrl}/facilities/${id}`,
    REQUEST_VERIFICATION: (id) => `${baseUrl}/facilities/${id}/request-verification`,
    EQUIPMENT_PROFILE: (id) => `${baseUrl}/facilities/${id}/equipment-profile`,
    MEMBERSHIP_REQUEST: (id) => `${baseUrl}/facilities/${id}/memberships/request`,
    UPDATE_MEMBERSHIP: (facilityId, membershipId) =>
      `${baseUrl}/facilities/${facilityId}/memberships/${membershipId}`,
  },

  MEMBERSHIPS: {
    MY_FACILITIES: `${baseUrl}/me/facilities`,
  },

  ADMISSIONS: {
    LIST: `${baseUrl}/admissions`,
    CREATE: `${baseUrl}/admissions`,
    GET: (id) => `${baseUrl}/admissions/${id}`,
    UPDATE: (id) => `${baseUrl}/admissions/${id}`,
    THREE_STEP_PATIENT_REASON: `${baseUrl}/admissions/three-step/patient-reason`,
    THREE_STEP_OXYGEN_ABG_VENTILATOR: (id) =>
      `${baseUrl}/admissions/${id}/three-step/oxygen-abg-ventilator`,
    THREE_STEP_SAVE_REVIEW: (id) => `${baseUrl}/admissions/${id}/three-step/save-review`,
    ABG_VENTILATOR_UPDATES: (id) => `${baseUrl}/admissions/${id}/abg-ventilator-updates`,
    CLINICAL_SNAPSHOTS: (id) => `${baseUrl}/admissions/${id}/clinical-snapshots`,
    ABG_TESTS: (id) => `${baseUrl}/admissions/${id}/abg-tests`,
    VENTILATOR_SETTINGS: (id) => `${baseUrl}/admissions/${id}/ventilator-settings`,
    AIRWAY_DEVICE: (id) => `${baseUrl}/admissions/${id}/airway-device`,
    HUMIDIFICATION: (id) => `${baseUrl}/admissions/${id}/humidification`,
    DAILY_REVIEW: (id) => `${baseUrl}/admissions/${id}/daily-review`,
    OUTCOME: (id) => `${baseUrl}/admissions/${id}/outcome`,
  },

  TRACKING: {
    LIST: `${baseUrl}/tracking`,
    GET: (id) => `${baseUrl}/tracking/${id}`,
    TIMELINE: (id) => `${baseUrl}/tracking/${id}/timeline`,
  },

  REVIEW: {
    QUEUE: `${baseUrl}/review/queue`,
    APPROVE: (entityType, entityId) => `${baseUrl}/review/${entityType}/${entityId}/approve`,
    REQUEST_CORRECTION: (entityType, entityId) =>
      `${baseUrl}/review/${entityType}/${entityId}/request-correction`,
    EXCLUDE: (entityType, entityId) => `${baseUrl}/review/${entityType}/${entityId}/exclude`,
    TRIAGE: (entityType, entityId) => `${baseUrl}/review/${entityType}/${entityId}/triage`,
  },

  DATASET_IMPORTS: {
    PARSE_NOTE: `${baseUrl}/dataset-imports/parse-note`,
    CREATE: `${baseUrl}/dataset-imports`,
    PENDING_REVIEW: `${baseUrl}/dataset-imports/pending-review`,
    REVIEW: (id) => `${baseUrl}/dataset-imports/${id}/review`,
  },

  DATASETS: {
    APPROVED: `${baseUrl}/datasets/approved`,
    CARD: (id) => `${baseUrl}/datasets/${id}/card`,
    EXPORT: (id) => `${baseUrl}/datasets/${id}/export`,
  },

  REFERENCES: {
    ACTIVE: `${baseUrl}/references/active`,
  },

  SETTINGS: {
    ME: `${baseUrl}/settings/me`,
    FACILITY: (id) => `${baseUrl}/settings/facilities/${id}`,
  },

  MODELS: {
    VERSIONS: `${baseUrl}/models/versions`,
  },

  ADMIN: {
    DASHBOARD: `${baseUrl}/admin/dashboard`,
    FACILITIES: `${baseUrl}/admin/facilities`,
    USERS: `${baseUrl}/admin/users`,
    USER_MEMBERSHIPS: (id) => `${baseUrl}/admin/users/${id}/facility-memberships`,
    USER_MEMBERSHIP: (id, membershipId) => `${baseUrl}/admin/users/${id}/facility-memberships/${membershipId}`,
    AUDIT_LOGS: `${baseUrl}/admin/audit-logs`,
    DATASET_QUALITY: `${baseUrl}/admin/dataset-quality`,
    MODEL_MONITORING: `${baseUrl}/admin/model-monitoring`,
    MODEL_DRIFT_MONITORING: `${baseUrl}/admin/model-monitoring/drift`,
    OVERRIDE_MONITORING: `${baseUrl}/admin/override-monitoring`,
    MODEL_CARDS: `${baseUrl}/admin/models/cards`,
    MODEL_CARD: (id) => `${baseUrl}/admin/models/${id}/card`,
    VERIFY_FACILITY: (id) => `${baseUrl}/admin/facilities/${id}/verify`,
    CREATE_REFERENCE: `${baseUrl}/admin/references`,
    VERIFY_REFERENCE: (id) => `${baseUrl}/admin/references/${id}/verify`,
    REQUEST_REFERENCE_CORRECTION: (id) => `${baseUrl}/admin/references/${id}/request-correction`,
    RETIRE_REFERENCE: (id) => `${baseUrl}/admin/references/${id}/retire`,
    ACTIVATE_MODEL_SHADOW_MODE: (id) => `${baseUrl}/admin/models/${id}/activate-shadow-mode`,
    RECORD_MODEL_SHADOW_OUTPUT: (id) => `${baseUrl}/admin/models/${id}/shadow-outputs`,
    RETIRE_MODEL: (id) => `${baseUrl}/admin/models/${id}/retire`,
  },

  DASHBOARDS: {
    CLINICAL: `${baseUrl}/dashboards/clinical`,
    OPERATIONAL: `${baseUrl}/dashboards/operational`,
    GOVERNANCE: `${baseUrl}/dashboards/governance`,
  },
};
