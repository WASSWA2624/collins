/**
 * Ambulance API
 * File: ambulance.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const ambulanceApi = createCrudApi(endpoints.AMBULANCES);

export { ambulanceApi };
