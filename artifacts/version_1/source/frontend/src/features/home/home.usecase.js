/**
 * Home Use Cases
 * File: home.usecase.js
 */
import { handleError } from '@errors';
import { loadHomeSummaryApi } from './home.api';
import { normalizeHomeSummary } from './home.model';

const unwrap = (res) => res?.data?.data ?? res?.data;

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const loadHomeSummaryUseCase = async ({ facilityId } = {}) =>
  execute(async () => {
    const response = await loadHomeSummaryApi({ facilityId });
    return normalizeHomeSummary(unwrap(response));
  });

export { loadHomeSummaryUseCase };
