/**
 * Inventory Item API Tests
 * File: inventory-item.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { inventoryItemApi } from '@features/inventory-item/inventory-item.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('inventory-item.api', () => {
  it('creates crud api with inventory item endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.INVENTORY_ITEMS);
    expect(inventoryItemApi).toBeDefined();
  });
});
