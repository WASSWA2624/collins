/**
 * Inventory Stock API
 * File: inventory-stock.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const inventoryStockApi = createCrudApi(endpoints.INVENTORY_STOCKS);

export { inventoryStockApi };
