/**
 * Inventory Stock API Tests
 * File: inventory-stock.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { inventoryStockApi } from '@features/inventory-stock/inventory-stock.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('inventory-stock.api', () => {
  it('creates crud api with inventory stock endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.INVENTORY_STOCKS);
    expect(inventoryStockApi).toBeDefined();
  });
});
