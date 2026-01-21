/**
 * Inventory Item Usecase Tests
 * File: inventory-item.usecase.test.js
 */
import {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryItem,
  listInventoryItems,
  updateInventoryItem,
} from '@features/inventory-item';
import { inventoryItemApi } from '@features/inventory-item/inventory-item.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/inventory-item/inventory-item.api', () => ({
  inventoryItemApi: {
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

describe('inventory-item.usecase', () => {
  beforeEach(() => {
    inventoryItemApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    inventoryItemApi.get.mockResolvedValue({ data: { id: '1' } });
    inventoryItemApi.create.mockResolvedValue({ data: { id: '1' } });
    inventoryItemApi.update.mockResolvedValue({ data: { id: '1' } });
    inventoryItemApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listInventoryItems,
      get: getInventoryItem,
      create: createInventoryItem,
      update: updateInventoryItem,
      remove: deleteInventoryItem,
    },
    { queueRequestIfOffline }
  );
});
