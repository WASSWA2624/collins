/**
 * New Patients API
 * File: newPatients.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const newPatientsApi = {
  list: (params = {}) =>
    apiClient({
      url: `${endpoints.NEW_PATIENTS.LIST}${buildQueryString(params)}`,
      method: 'GET',
    }),
  create: (payload) =>
    apiClient({
      url: endpoints.NEW_PATIENTS.CREATE,
      method: 'POST',
      body: payload,
    }),
  createPatientReasonStep: (payload) =>
    apiClient({
      url: endpoints.NEW_PATIENTS.THREE_STEP_PATIENT_REASON,
      method: 'POST',
      body: payload,
    }),
  get: (id) =>
    apiClient({
      url: endpoints.NEW_PATIENTS.GET(id),
      method: 'GET',
    }),
  patch: (id, payload) =>
    apiClient({
      url: endpoints.NEW_PATIENTS.UPDATE(id),
      method: 'PATCH',
      body: payload,
    }),
  saveOxygenAbgVentilatorStep: (id, payload) =>
    apiClient({
      url: endpoints.NEW_PATIENTS.THREE_STEP_OXYGEN_ABG_VENTILATOR(id),
      method: 'POST',
      body: payload,
    }),
  saveReviewStep: (id, payload) =>
    apiClient({
      url: endpoints.NEW_PATIENTS.THREE_STEP_SAVE_REVIEW(id),
      method: 'POST',
      body: payload,
    }),
};

export { newPatientsApi };
