/**
 * Supplier Usecase Tests
 * File: supplier.usecase.test.js
 */
import { createSupplier, deleteSupplier, getSupplier, listSuppliers, updateSupplier } from '@features/supplier';
import { supplierApi } from '@features/supplier/supplier.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/supplier/supplier.api', () => ({
  supplierApi: {
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

describe('supplier.usecase', () => {
  beforeEach(() => {
    supplierApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    supplierApi.get.mockResolvedValue({ data: { id: '1' } });
    supplierApi.create.mockResolvedValue({ data: { id: '1' } });
    supplierApi.update.mockResolvedValue({ data: { id: '1' } });
    supplierApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listSuppliers,
      get: getSupplier,
      create: createSupplier,
      update: updateSupplier,
      remove: deleteSupplier,
    },
    { queueRequestIfOffline }
  );
});
