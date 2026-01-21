/**
 * Lab Order Item API Tests
 * File: lab-order-item.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { labOrderItemApi } from '@features/lab-order-item/lab-order-item.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('lab-order-item.api', () => {
  it('creates crud api with lab order item endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.LAB_ORDER_ITEMS);
    expect(labOrderItemApi).toBeDefined();
  });
});
