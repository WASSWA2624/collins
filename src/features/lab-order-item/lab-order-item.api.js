/**
 * Lab Order Item API
 * File: lab-order-item.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const labOrderItemApi = createCrudApi(endpoints.LAB_ORDER_ITEMS);

export { labOrderItemApi };
