/**
 * Collins API Endpoints Registry
 * Central source of truth for backend routes.
 */

import { API_BASE_URL, API_VERSION } from '@config/env';

const normalizeBaseUrl = (value) => String(value || '').replace(/\/+$/, '');
const baseUrl = `${normalizeBaseUrl(API_BASE_URL)}/api/${API_VERSION}`;

export const endpoints = {
  HEALTH: `${baseUrl}/health`,

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
    CLINICAL_SNAPSHOTS: (id) => `${baseUrl}/admissions/${id}/clinical-snapshots`,
    ABG_TESTS: (id) => `${baseUrl}/admissions/${id}/abg-tests`,
    VENTILATOR_SETTINGS: (id) => `${baseUrl}/admissions/${id}/ventilator-settings`,
    AIRWAY_DEVICE: (id) => `${baseUrl}/admissions/${id}/airway-device`,
    HUMIDIFICATION: (id) => `${baseUrl}/admissions/${id}/humidification`,
    DAILY_REVIEW: (id) => `${baseUrl}/admissions/${id}/daily-review`,
    OUTCOME: (id) => `${baseUrl}/admissions/${id}/outcome`,
  },

  REVIEW: {
    QUEUE: `${baseUrl}/review/queue`,
    APPROVE: (entityType, entityId) => `${baseUrl}/review/${entityType}/${entityId}/approve`,
    REQUEST_CORRECTION: (entityType, entityId) =>
      `${baseUrl}/review/${entityType}/${entityId}/request-correction`,
    EXCLUDE: (entityType, entityId) => `${baseUrl}/review/${entityType}/${entityId}/exclude`,
  },

  DATASET_IMPORTS: {
    PARSE_NOTE: `${baseUrl}/dataset-imports/parse-note`,
    CREATE: `${baseUrl}/dataset-imports`,
    PENDING_REVIEW: `${baseUrl}/dataset-imports/pending-review`,
    REVIEW: (id) => `${baseUrl}/dataset-imports/${id}/review`,
  },

  DATASETS: {
    APPROVED: `${baseUrl}/datasets/approved`,
    EXPORT: (id) => `${baseUrl}/datasets/${id}/export`,
  },

  REFERENCES: {
    ACTIVE: `${baseUrl}/references/active`,
  },

  MODELS: {
    VERSIONS: `${baseUrl}/models/versions`,
  },

  ADMIN: {
    DASHBOARD: `${baseUrl}/admin/dashboard`,
    FACILITIES: `${baseUrl}/admin/facilities`,
    AUDIT_LOGS: `${baseUrl}/admin/audit-logs`,
    DATASET_QUALITY: `${baseUrl}/admin/dataset-quality`,
    MODEL_MONITORING: `${baseUrl}/admin/model-monitoring`,
    VERIFY_FACILITY: (id) => `${baseUrl}/admin/facilities/${id}/verify`,
    CREATE_REFERENCE: `${baseUrl}/admin/references`,
    ACTIVATE_MODEL_SHADOW_MODE: (id) => `${baseUrl}/admin/models/${id}/activate-shadow-mode`,
    RETIRE_MODEL: (id) => `${baseUrl}/admin/models/${id}/retire`,
  },
};
