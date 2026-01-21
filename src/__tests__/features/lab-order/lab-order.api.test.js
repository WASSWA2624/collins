/**
 * Lab Order API Tests
 * File: lab-order.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { labOrderApi } from '@features/lab-order/lab-order.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('lab-order.api', () => {
  it('creates crud api with lab order endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.LAB_ORDERS);
    expect(labOrderApi).toBeDefined();
  });
});
