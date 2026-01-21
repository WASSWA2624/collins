/**
 * Stock Adjustment API
 * File: stock-adjustment.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const stockAdjustmentApi = createCrudApi(endpoints.STOCK_ADJUSTMENTS);

export { stockAdjustmentApi };
