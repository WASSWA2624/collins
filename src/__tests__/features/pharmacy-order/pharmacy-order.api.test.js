/**
 * Pharmacy Order API Tests
 * File: pharmacy-order.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { pharmacyOrderApi } from '@features/pharmacy-order/pharmacy-order.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('pharmacy-order.api', () => {
  it('creates crud api with pharmacy order endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.PHARMACY_ORDERS);
    expect(pharmacyOrderApi).toBeDefined();
  });
});
