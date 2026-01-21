/**
 * Purchase Order API Tests
 * File: purchase-order.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { purchaseOrderApi } from '@features/purchase-order/purchase-order.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('purchase-order.api', () => {
  it('creates crud api with purchase order endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.PURCHASE_ORDERS);
    expect(purchaseOrderApi).toBeDefined();
  });
});
