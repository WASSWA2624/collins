/**
 * Stock Adjustment API Tests
 * File: stock-adjustment.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { stockAdjustmentApi } from '@features/stock-adjustment/stock-adjustment.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('stock-adjustment.api', () => {
  it('creates crud api with stock adjustment endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.STOCK_ADJUSTMENTS);
    expect(stockAdjustmentApi).toBeDefined();
  });
});
