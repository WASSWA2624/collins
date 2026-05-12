/**
 * Settings API
 * Canonical frontend contract for audited backend settings routes.
 */
import { endpoints } from '@config/endpoints';
import { apiClient } from '@services/api';

const getMySettingsApi = () =>
  apiClient({
    url: endpoints.SETTINGS.ME,
    method: 'GET',
  });

const patchMySettingsApi = (payload) =>
  apiClient({
    url: endpoints.SETTINGS.ME,
    method: 'PATCH',
    body: payload,
  });

const getFacilitySettingsApi = (facilityId) =>
  apiClient({
    url: endpoints.SETTINGS.FACILITY(facilityId),
    method: 'GET',
  });

const patchFacilitySettingsApi = (facilityId, payload) =>
  apiClient({
    url: endpoints.SETTINGS.FACILITY(facilityId),
    method: 'PATCH',
    body: payload,
  });

export {
  getMySettingsApi,
  patchMySettingsApi,
  getFacilitySettingsApi,
  patchFacilitySettingsApi,
};
