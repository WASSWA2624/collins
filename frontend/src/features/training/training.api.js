/**
 * Training API
 * Optional remote versioned help catalog. Offline bundled content remains primary.
 * File: training.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const TRAINING_API_ERROR_CODES = Object.freeze({
  REMOTE_UNAVAILABLE: 'TRAINING_REMOTE_CONTENT_UNAVAILABLE',
});

const fetchTrainingHelpCatalogApi = async ({ workflow } = {}) => {
  const query = buildQueryString({ workflow });
  const response = await apiClient({
    url: `${endpoints.TRAINING_HELP.CATALOG}${query}`,
    method: 'GET',
  });

  return response?.data?.data ?? response?.data ?? null;
};

const syncTrainingContentApi = async (options = {}) => {
  try {
    const content = await fetchTrainingHelpCatalogApi(options);
    return { ok: true, content, errorCode: null };
  } catch {
    return { ok: false, content: null, errorCode: TRAINING_API_ERROR_CODES.REMOTE_UNAVAILABLE };
  }
};

export { TRAINING_API_ERROR_CODES, fetchTrainingHelpCatalogApi, syncTrainingContentApi };
