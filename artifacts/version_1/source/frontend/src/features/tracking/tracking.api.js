/**
 * Tracking API
 * Backend-backed active admission tracking endpoints.
 * File: tracking.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const listTrackingAdmissionsApi = (params = {}) =>
  apiClient({
    url: `${endpoints.TRACKING.LIST}${buildQueryString(params)}`,
    method: 'GET',
  });

const getTrackingAdmissionApi = (admissionId) =>
  apiClient({
    url: endpoints.TRACKING.GET(admissionId),
    method: 'GET',
  });

const getTrackingTimelineApi = (admissionId) =>
  apiClient({
    url: endpoints.TRACKING.TIMELINE(admissionId),
    method: 'GET',
  });

export {
  getTrackingAdmissionApi,
  getTrackingTimelineApi,
  listTrackingAdmissionsApi,
};
