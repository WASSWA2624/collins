/**
 * Pharmacy Order Usecase Tests
 * File: pharmacy-order.usecase.test.js
 */
import {
  listPharmacyOrders,
  getPharmacyOrder,
  createPharmacyOrder,
  updatePharmacyOrder,
  deletePharmacyOrder,
} from '@features/pharmacy-order';
import { pharmacyOrderApi } from '@features/pharmacy-order/pharmacy-order.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/pharmacy-order/pharmacy-order.api', () => ({
  pharmacyOrderApi: {
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

describe('pharmacy-order.usecase', () => {
  beforeEach(() => {
    pharmacyOrderApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    pharmacyOrderApi.get.mockResolvedValue({ data: { id: '1' } });
    pharmacyOrderApi.create.mockResolvedValue({ data: { id: '1' } });
    pharmacyOrderApi.update.mockResolvedValue({ data: { id: '1' } });
    pharmacyOrderApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listPharmacyOrders,
      get: getPharmacyOrder,
      create: createPharmacyOrder,
      update: updatePharmacyOrder,
      remove: deletePharmacyOrder,
    },
    { queueRequestIfOffline }
  );
});
