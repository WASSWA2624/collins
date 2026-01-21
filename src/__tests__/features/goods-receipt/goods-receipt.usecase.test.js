/**
 * Goods Receipt Usecase Tests
 * File: goods-receipt.usecase.test.js
 */
import {
  createGoodsReceipt,
  deleteGoodsReceipt,
  getGoodsReceipt,
  listGoodsReceipts,
  updateGoodsReceipt,
} from '@features/goods-receipt';
import { goodsReceiptApi } from '@features/goods-receipt/goods-receipt.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/goods-receipt/goods-receipt.api', () => ({
  goodsReceiptApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('goods-receipt.usecase', () => {
  beforeEach(() => {
    goodsReceiptApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    goodsReceiptApi.get.mockResolvedValue({ data: { id: '1' } });
    goodsReceiptApi.create.mockResolvedValue({ data: { id: '1' } });
    goodsReceiptApi.update.mockResolvedValue({ data: { id: '1' } });
    goodsReceiptApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listGoodsReceipts,
      get: getGoodsReceipt,
      create: createGoodsReceipt,
      update: updateGoodsReceipt,
      remove: deleteGoodsReceipt,
    },
    { queueRequestIfOffline }
  );
});
