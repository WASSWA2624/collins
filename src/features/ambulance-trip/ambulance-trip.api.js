/**
 * Ambulance Trip API
 * File: ambulance-trip.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const ambulanceTripApi = createCrudApi(endpoints.AMBULANCE_TRIPS);

export { ambulanceTripApi };
