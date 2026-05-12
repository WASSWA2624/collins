import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const searchFacilitiesApi = (params = {}) =>
  apiClient({
    url: `${endpoints.FACILITIES.SEARCH}${buildQueryString(params)}`,
    method: 'GET',
  });

const listAdminFacilitiesApi = () =>
  apiClient({
    url: endpoints.ADMIN.FACILITIES,
    method: 'GET',
  });

const createFacilityApi = (payload) =>
  apiClient({
    url: endpoints.ADMIN.FACILITIES,
    method: 'POST',
    body: payload,
  });

const updateFacilityApi = (id, payload) =>
  apiClient({
    url: endpoints.ADMIN.FACILITY(id),
    method: 'PATCH',
    body: payload,
  });

const deleteFacilityApi = (id) =>
  apiClient({
    url: endpoints.ADMIN.FACILITY(id),
    method: 'DELETE',
  });

export {
  createFacilityApi,
  deleteFacilityApi,
  listAdminFacilitiesApi,
  searchFacilitiesApi,
  updateFacilityApi,
};
