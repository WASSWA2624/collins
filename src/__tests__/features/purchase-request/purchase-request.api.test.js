/**
 * Purchase Request API Tests
 * File: purchase-request.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { purchaseRequestApi } from '@features/purchase-request/purchase-request.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('purchase-request.api', () => {
  it('creates crud api with purchase request endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.PURCHASE_REQUESTS);
    expect(purchaseRequestApi).toBeDefined();
  });
});
