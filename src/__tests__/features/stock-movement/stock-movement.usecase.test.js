/**
 * Stock Movement Usecase Tests
 * File: stock-movement.usecase.test.js
 */
import {
  createStockMovement,
  deleteStockMovement,
  getStockMovement,
  listStockMovements,
  updateStockMovement,
} from '@features/stock-movement';
import { stockMovementApi } from '@features/stock-movement/stock-movement.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/stock-movement/stock-movement.api', () => ({
  stockMovementApi: {
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

describe('stock-movement.usecase', () => {
  beforeEach(() => {
    stockMovementApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    stockMovementApi.get.mockResolvedValue({ data: { id: '1' } });
    stockMovementApi.create.mockResolvedValue({ data: { id: '1' } });
    stockMovementApi.update.mockResolvedValue({ data: { id: '1' } });
    stockMovementApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listStockMovements,
      get: getStockMovement,
      create: createStockMovement,
      update: updateStockMovement,
      remove: deleteStockMovement,
    },
    { queueRequestIfOffline }
  );
});
