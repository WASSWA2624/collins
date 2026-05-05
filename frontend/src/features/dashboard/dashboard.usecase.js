/**
 * Dashboard Use Cases
 * File: dashboard.usecase.js
 */
import { handleError } from '@errors';
import { loadDashboardApi } from './dashboard.api';
import { normalizeDashboard } from './dashboard.model';

const unwrap = (res) => res?.data?.data ?? res?.data;

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const loadDashboardUseCase = async (type, params = {}) =>
  execute(async () => {
    const response = await loadDashboardApi(type, params);
    return normalizeDashboard(type, unwrap(response));
  });

export { loadDashboardUseCase };
