/**
 * Lab Sample API
 * File: lab-sample.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const labSampleApi = createCrudApi(endpoints.LAB_SAMPLES);

export { labSampleApi };
