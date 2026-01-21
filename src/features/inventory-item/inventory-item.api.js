/**
 * Inventory Item API
 * File: inventory-item.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const inventoryItemApi = createCrudApi(endpoints.INVENTORY_ITEMS);

export { inventoryItemApi };
