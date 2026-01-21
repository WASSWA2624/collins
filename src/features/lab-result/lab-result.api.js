/**
 * Lab Result API
 * File: lab-result.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const labResultApi = createCrudApi(endpoints.LAB_RESULTS);

export { labResultApi };
