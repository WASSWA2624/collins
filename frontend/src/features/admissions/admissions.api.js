/**
 * Admissions API
 * File: admissions.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const admissionsApi = {
  list: (params = {}) =>
    apiClient({
      url: `${endpoints.ADMISSIONS.LIST}${buildQueryString(params)}`,
      method: 'GET',
    }),
  create: (payload) =>
    apiClient({
      url: endpoints.ADMISSIONS.CREATE,
      method: 'POST',
      body: payload,
    }),
  createPatientReasonStep: (payload) =>
    apiClient({
      url: endpoints.ADMISSIONS.THREE_STEP_PATIENT_REASON,
      method: 'POST',
      body: payload,
    }),
  get: (id) =>
    apiClient({
      url: endpoints.ADMISSIONS.GET(id),
      method: 'GET',
    }),
  patch: (id, payload) =>
    apiClient({
      url: endpoints.ADMISSIONS.UPDATE(id),
      method: 'PATCH',
      body: payload,
    }),
  saveOxygenAbgVentilatorStep: (id, payload) =>
    apiClient({
      url: endpoints.ADMISSIONS.THREE_STEP_OXYGEN_ABG_VENTILATOR(id),
      method: 'POST',
      body: payload,
    }),
  saveReviewStep: (id, payload) =>
    apiClient({
      url: endpoints.ADMISSIONS.THREE_STEP_SAVE_REVIEW(id),
      method: 'POST',
      body: payload,
    }),
};

export { admissionsApi };
