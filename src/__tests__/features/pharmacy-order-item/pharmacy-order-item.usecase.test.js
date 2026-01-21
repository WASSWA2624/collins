/**
 * Pharmacy Order Item Usecase Tests
 * File: pharmacy-order-item.usecase.test.js
 */
import {
  listPharmacyOrderItems,
  getPharmacyOrderItem,
  createPharmacyOrderItem,
  updatePharmacyOrderItem,
  deletePharmacyOrderItem,
} from '@features/pharmacy-order-item';
import { pharmacyOrderItemApi } from '@features/pharmacy-order-item/pharmacy-order-item.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/pharmacy-order-item/pharmacy-order-item.api', () => ({
  pharmacyOrderItemApi: {
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

describe('pharmacy-order-item.usecase', () => {
  beforeEach(() => {
    pharmacyOrderItemApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    pharmacyOrderItemApi.get.mockResolvedValue({ data: { id: '1' } });
    pharmacyOrderItemApi.create.mockResolvedValue({ data: { id: '1' } });
    pharmacyOrderItemApi.update.mockResolvedValue({ data: { id: '1' } });
    pharmacyOrderItemApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listPharmacyOrderItems,
      get: getPharmacyOrderItem,
      create: createPharmacyOrderItem,
      update: updatePharmacyOrderItem,
      remove: deletePharmacyOrderItem,
    },
    { queueRequestIfOffline }
  );
});
