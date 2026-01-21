/**
 * Inventory Stock Usecase Tests
 * File: inventory-stock.usecase.test.js
 */
import {
  createInventoryStock,
  deleteInventoryStock,
  getInventoryStock,
  listInventoryStocks,
  updateInventoryStock,
} from '@features/inventory-stock';
import { inventoryStockApi } from '@features/inventory-stock/inventory-stock.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/inventory-stock/inventory-stock.api', () => ({
  inventoryStockApi: {
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

describe('inventory-stock.usecase', () => {
  beforeEach(() => {
    inventoryStockApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    inventoryStockApi.get.mockResolvedValue({ data: { id: '1' } });
    inventoryStockApi.create.mockResolvedValue({ data: { id: '1' } });
    inventoryStockApi.update.mockResolvedValue({ data: { id: '1' } });
    inventoryStockApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listInventoryStocks,
      get: getInventoryStock,
      create: createInventoryStock,
      update: updateInventoryStock,
      remove: deleteInventoryStock,
    },
    { queueRequestIfOffline }
  );
});
