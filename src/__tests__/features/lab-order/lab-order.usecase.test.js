/**
 * Lab Order Usecase Tests
 * File: lab-order.usecase.test.js
 */
import { listLabOrders, getLabOrder, createLabOrder, updateLabOrder, deleteLabOrder } from '@features/lab-order';
import { labOrderApi } from '@features/lab-order/lab-order.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/lab-order/lab-order.api', () => ({
  labOrderApi: {
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

describe('lab-order.usecase', () => {
  beforeEach(() => {
    labOrderApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    labOrderApi.get.mockResolvedValue({ data: { id: '1' } });
    labOrderApi.create.mockResolvedValue({ data: { id: '1' } });
    labOrderApi.update.mockResolvedValue({ data: { id: '1' } });
    labOrderApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listLabOrders,
      get: getLabOrder,
      create: createLabOrder,
      update: updateLabOrder,
      remove: deleteLabOrder,
    },
    { queueRequestIfOffline }
  );
});
