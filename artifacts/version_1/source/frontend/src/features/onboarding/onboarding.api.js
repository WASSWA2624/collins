/**
 * Onboarding API.
 * Reuses backend onboarding persistence when auth is available.
 */
import { endpoints } from '@config/endpoints';
import { apiClient } from '@services/api';

const getOnboardingConfigApi = () =>
  apiClient({
    url: endpoints.ONBOARDING.CONFIG,
    method: 'GET',
  });

const getOnboardingStateApi = () =>
  apiClient({
    url: endpoints.ONBOARDING.STATE,
    method: 'GET',
  });

const updateOnboardingStateApi = (payload) =>
  apiClient({
    url: endpoints.ONBOARDING.STATE,
    method: 'PATCH',
    body: payload,
  });

const acknowledgeClinicalSafetyApi = (payload) =>
  apiClient({
    url: endpoints.ONBOARDING.ACKNOWLEDGE_CLINICAL_SAFETY,
    method: 'POST',
    body: payload,
  });

export {
  acknowledgeClinicalSafetyApi,
  getOnboardingConfigApi,
  getOnboardingStateApi,
  updateOnboardingStateApi,
};
