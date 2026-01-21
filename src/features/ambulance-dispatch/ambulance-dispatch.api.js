/**
 * Ambulance Dispatch API
 * File: ambulance-dispatch.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const ambulanceDispatchApi = createCrudApi(endpoints.AMBULANCE_DISPATCHES);

export { ambulanceDispatchApi };
