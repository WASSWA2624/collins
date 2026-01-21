/**
 * Lab Order API
 * File: lab-order.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const labOrderApi = createCrudApi(endpoints.LAB_ORDERS);

export { labOrderApi };
