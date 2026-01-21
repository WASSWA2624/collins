/**
 * Lab Order Item Usecase Tests
 * File: lab-order-item.usecase.test.js
 */
import {
  listLabOrderItems,
  getLabOrderItem,
  createLabOrderItem,
  updateLabOrderItem,
  deleteLabOrderItem,
} from '@features/lab-order-item';
import { labOrderItemApi } from '@features/lab-order-item/lab-order-item.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/lab-order-item/lab-order-item.api', () => ({
  labOrderItemApi: {
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

describe('lab-order-item.usecase', () => {
  beforeEach(() => {
    labOrderItemApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    labOrderItemApi.get.mockResolvedValue({ data: { id: '1' } });
    labOrderItemApi.create.mockResolvedValue({ data: { id: '1' } });
    labOrderItemApi.update.mockResolvedValue({ data: { id: '1' } });
    labOrderItemApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listLabOrderItems,
      get: getLabOrderItem,
      create: createLabOrderItem,
      update: updateLabOrderItem,
      remove: deleteLabOrderItem,
    },
    { queueRequestIfOffline }
  );
});
