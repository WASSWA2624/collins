/**
 * ICU Observation API
 * File: icu-observation.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const icuObservationApi = createCrudApi(endpoints.ICU_OBSERVATIONS);

export { icuObservationApi };
