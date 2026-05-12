/**
 * Home API
 * File: home.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const loadHomeSummaryApi = ({ facilityId } = {}) =>
  apiClient({
    url: `${endpoints.HOME.SUMMARY}${buildQueryString({ facilityId })}`,
    method: 'GET',
  });

export { loadHomeSummaryApi };
