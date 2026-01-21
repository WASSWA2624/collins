/**
 * Stock Movement API Tests
 * File: stock-movement.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { stockMovementApi } from '@features/stock-movement/stock-movement.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('stock-movement.api', () => {
  it('creates crud api with stock movement endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.STOCK_MOVEMENTS);
    expect(stockMovementApi).toBeDefined();
  });
});
