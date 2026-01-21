/**
 * Pharmacy Order Item API
 * File: pharmacy-order-item.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const pharmacyOrderItemApi = createCrudApi(endpoints.PHARMACY_ORDER_ITEMS);

export { pharmacyOrderItemApi };
