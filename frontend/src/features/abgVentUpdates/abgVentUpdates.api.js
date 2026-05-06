/**
 * ABG and ventilator setting update API
 */
import { endpoints } from '@config/endpoints';
import { apiClient } from '@services/api';

const appendQuery = (url, query = {}) => {
  const params = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  return params ? `${url}?${params}` : url;
};

const unwrapData = (response) => response?.data?.data ?? response?.data ?? null;

const createAbgVentUpdateRequest = (admissionId, body) => ({
  url: endpoints.ADMISSIONS.ABG_VENTILATOR_UPDATES(admissionId),
  method: 'POST',
  body,
});

const listActiveAdmissionsApi = async ({ facilityId, limit = 50 } = {}) => {
  const response = await apiClient({
    url: appendQuery(endpoints.ADMISSIONS.LIST, { facilityId, status: 'ACTIVE', limit }),
    method: 'GET',
  });
  return unwrapData(response);
};

const getAdmissionAbgVentilatorContextApi = async (admissionId) => {
  const response = await apiClient({
    url: endpoints.ADMISSIONS.GET(admissionId),
    method: 'GET',
  });
  const data = unwrapData(response);
  return data?.admission ?? data;
};

const saveAbgVentUpdateApi = async (admissionId, body) => {
  const response = await apiClient(createAbgVentUpdateRequest(admissionId, body));
  return unwrapData(response);
};

const appendAbgTestApi = async (admissionId, body) => {
  const response = await apiClient({
    url: endpoints.ADMISSIONS.ABG_TESTS(admissionId),
    method: 'POST',
    body,
  });
  return unwrapData(response);
};

const appendVentilatorSettingApi = async (admissionId, body) => {
  const response = await apiClient({
    url: endpoints.ADMISSIONS.VENTILATOR_SETTINGS(admissionId),
    method: 'POST',
    body,
  });
  return unwrapData(response);
};

export {
  appendAbgTestApi,
  appendVentilatorSettingApi,
  createAbgVentUpdateRequest,
  getAdmissionAbgVentilatorContextApi,
  listActiveAdmissionsApi,
  saveAbgVentUpdateApi,
};
