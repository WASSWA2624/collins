/**
 * Pharmacy Order API
 * File: pharmacy-order.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const pharmacyOrderApi = createCrudApi(endpoints.PHARMACY_ORDERS);

export { pharmacyOrderApi };
