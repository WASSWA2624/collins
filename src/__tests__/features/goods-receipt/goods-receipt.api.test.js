/**
 * Goods Receipt API Tests
 * File: goods-receipt.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { goodsReceiptApi } from '@features/goods-receipt/goods-receipt.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('goods-receipt.api', () => {
  it('creates crud api with goods receipt endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.GOODS_RECEIPTS);
    expect(goodsReceiptApi).toBeDefined();
  });
});
