/**
 * Supplier API Tests
 * File: supplier.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { supplierApi } from '@features/supplier/supplier.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('supplier.api', () => {
  it('creates crud api with supplier endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.SUPPLIERS);
    expect(supplierApi).toBeDefined();
  });
});
