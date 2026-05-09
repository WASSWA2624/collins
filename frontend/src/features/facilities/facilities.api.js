import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const searchFacilitiesApi = (params = {}) =>
  apiClient({
    url: `${endpoints.FACILITIES.SEARCH}${buildQueryString(params)}`,
    method: 'GET',
  });

export {
  searchFacilitiesApi,
};
