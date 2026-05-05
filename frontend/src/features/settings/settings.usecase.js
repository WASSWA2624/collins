/**
 * Settings use cases
 */
import { handleError } from '@errors';
import {
  getFacilitySettingsApi,
  getMySettingsApi,
  patchFacilitySettingsApi,
  patchMySettingsApi,
} from './settings.api';
import { normalizeFacilitySettings, normalizeUserSettings } from './settings.model';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const unwrapSettings = (response) =>
  response?.data?.data?.settings ??
  response?.data?.settings ??
  response?.data?.data ??
  response?.data ??
  null;

const loadMySettingsUseCase = () =>
  execute(async () => {
    const response = await getMySettingsApi();
    return normalizeUserSettings(unwrapSettings(response));
  });

const updateMySettingsUseCase = (payload) =>
  execute(async () => {
    const response = await patchMySettingsApi(payload);
    return normalizeUserSettings(unwrapSettings(response));
  });

const loadFacilitySettingsUseCase = (facilityId) =>
  execute(async () => {
    if (!facilityId) return null;
    const response = await getFacilitySettingsApi(facilityId);
    return normalizeFacilitySettings(unwrapSettings(response));
  });

const updateFacilitySettingsUseCase = (facilityId, payload) =>
  execute(async () => {
    if (!facilityId) throw new Error('facilityId is required');
    const response = await patchFacilitySettingsApi(facilityId, payload);
    return normalizeFacilitySettings(unwrapSettings(response));
  });

export {
  loadMySettingsUseCase,
  updateMySettingsUseCase,
  loadFacilitySettingsUseCase,
  updateFacilitySettingsUseCase,
  unwrapSettings,
};
