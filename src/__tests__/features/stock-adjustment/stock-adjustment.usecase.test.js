/**
 * Stock Adjustment Usecase Tests
 * File: stock-adjustment.usecase.test.js
 */
import {
  createStockAdjustment,
  deleteStockAdjustment,
  getStockAdjustment,
  listStockAdjustments,
  updateStockAdjustment,
} from '@features/stock-adjustment';
import { stockAdjustmentApi } from '@features/stock-adjustment/stock-adjustment.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/stock-adjustment/stock-adjustment.api', () => ({
  stockAdjustmentApi: {
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

describe('stock-adjustment.usecase', () => {
  beforeEach(() => {
    stockAdjustmentApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    stockAdjustmentApi.get.mockResolvedValue({ data: { id: '1' } });
    stockAdjustmentApi.create.mockResolvedValue({ data: { id: '1' } });
    stockAdjustmentApi.update.mockResolvedValue({ data: { id: '1' } });
    stockAdjustmentApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listStockAdjustments,
      get: getStockAdjustment,
      create: createStockAdjustment,
      update: updateStockAdjustment,
      remove: deleteStockAdjustment,
    },
    { queueRequestIfOffline }
  );
});
