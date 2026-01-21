/**
 * Purchase Order Usecase Tests
 * File: purchase-order.usecase.test.js
 */
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrder,
  listPurchaseOrders,
  updatePurchaseOrder,
} from '@features/purchase-order';
import { purchaseOrderApi } from '@features/purchase-order/purchase-order.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/purchase-order/purchase-order.api', () => ({
  purchaseOrderApi: {
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

describe('purchase-order.usecase', () => {
  beforeEach(() => {
    purchaseOrderApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    purchaseOrderApi.get.mockResolvedValue({ data: { id: '1' } });
    purchaseOrderApi.create.mockResolvedValue({ data: { id: '1' } });
    purchaseOrderApi.update.mockResolvedValue({ data: { id: '1' } });
    purchaseOrderApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listPurchaseOrders,
      get: getPurchaseOrder,
      create: createPurchaseOrder,
      update: updatePurchaseOrder,
      remove: deletePurchaseOrder,
    },
    { queueRequestIfOffline }
  );
});
