/**
 * Purchase Order API
 * File: purchase-order.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const purchaseOrderApi = createCrudApi(endpoints.PURCHASE_ORDERS);

export { purchaseOrderApi };
