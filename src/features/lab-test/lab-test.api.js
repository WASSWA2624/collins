/**
 * Lab Test API
 * File: lab-test.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const labTestApi = createCrudApi(endpoints.LAB_TESTS);

export { labTestApi };
