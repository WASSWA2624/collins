/**
 * Drug API
 * File: drug.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const drugApi = createCrudApi(endpoints.DRUGS);

export { drugApi };
