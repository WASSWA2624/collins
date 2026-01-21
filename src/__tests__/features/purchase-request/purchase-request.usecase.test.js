/**
 * Purchase Request Usecase Tests
 * File: purchase-request.usecase.test.js
 */
import {
  createPurchaseRequest,
  deletePurchaseRequest,
  getPurchaseRequest,
  listPurchaseRequests,
  updatePurchaseRequest,
} from '@features/purchase-request';
import { purchaseRequestApi } from '@features/purchase-request/purchase-request.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/purchase-request/purchase-request.api', () => ({
  purchaseRequestApi: {
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

describe('purchase-request.usecase', () => {
  beforeEach(() => {
    purchaseRequestApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    purchaseRequestApi.get.mockResolvedValue({ data: { id: '1' } });
    purchaseRequestApi.create.mockResolvedValue({ data: { id: '1' } });
    purchaseRequestApi.update.mockResolvedValue({ data: { id: '1' } });
    purchaseRequestApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listPurchaseRequests,
      get: getPurchaseRequest,
      create: createPurchaseRequest,
      update: updatePurchaseRequest,
      remove: deletePurchaseRequest,
    },
    { queueRequestIfOffline }
  );
});
