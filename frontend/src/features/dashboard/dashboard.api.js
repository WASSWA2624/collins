/**
 * Dashboard API
 * File: dashboard.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const DASHBOARD_TYPES = Object.freeze({
  CLINICAL: 'clinical',
  OPERATIONAL: 'operational',
  GOVERNANCE: 'governance',
});

const dashboardEndpoints = Object.freeze({
  [DASHBOARD_TYPES.CLINICAL]: endpoints.DASHBOARDS.CLINICAL,
  [DASHBOARD_TYPES.OPERATIONAL]: endpoints.DASHBOARDS.OPERATIONAL,
  [DASHBOARD_TYPES.GOVERNANCE]: endpoints.DASHBOARDS.GOVERNANCE,
});

const loadDashboardApi = (type, params = {}) => {
  const url = dashboardEndpoints[type];
  if (!url) throw new Error(`Unsupported dashboard type: ${type}`);

  return apiClient({
    url: `${url}${buildQueryString(params)}`,
    method: 'GET',
  });
};

export { DASHBOARD_TYPES, loadDashboardApi };
