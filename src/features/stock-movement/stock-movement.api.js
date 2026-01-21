/**
 * Stock Movement API
 * File: stock-movement.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const stockMovementApi = createCrudApi(endpoints.STOCK_MOVEMENTS);

export { stockMovementApi };
