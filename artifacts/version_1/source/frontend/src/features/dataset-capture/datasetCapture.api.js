/**
 * Dataset Capture API
 * File: datasetCapture.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient } from '@services/api';

const parseDatasetNoteApi = (payload) =>
  apiClient({
    url: endpoints.DATASET_IMPORTS.PARSE_NOTE,
    method: 'POST',
    body: payload,
  });

const createDatasetImportApi = (payload) =>
  apiClient({
    url: endpoints.DATASET_IMPORTS.CREATE,
    method: 'POST',
    body: payload,
  });

export { createDatasetImportApi, parseDatasetNoteApi };
