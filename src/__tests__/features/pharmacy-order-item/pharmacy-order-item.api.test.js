/**
 * Pharmacy Order Item API Tests
 * File: pharmacy-order-item.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { pharmacyOrderItemApi } from '@features/pharmacy-order-item/pharmacy-order-item.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('pharmacy-order-item.api', () => {
  it('creates crud api with pharmacy order item endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.PHARMACY_ORDER_ITEMS);
    expect(pharmacyOrderItemApi).toBeDefined();
  });
});
