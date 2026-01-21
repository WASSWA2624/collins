/**
 * Drug Batch Usecase Tests
 * File: drug-batch.usecase.test.js
 */
import {
  listDrugBatches,
  getDrugBatch,
  createDrugBatch,
  updateDrugBatch,
  deleteDrugBatch,
} from '@features/drug-batch';
import { drugBatchApi } from '@features/drug-batch/drug-batch.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/drug-batch/drug-batch.api', () => ({
  drugBatchApi: {
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

describe('drug-batch.usecase', () => {
  beforeEach(() => {
    drugBatchApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    drugBatchApi.get.mockResolvedValue({ data: { id: '1' } });
    drugBatchApi.create.mockResolvedValue({ data: { id: '1' } });
    drugBatchApi.update.mockResolvedValue({ data: { id: '1' } });
    drugBatchApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listDrugBatches,
      get: getDrugBatch,
      create: createDrugBatch,
      update: updateDrugBatch,
      remove: deleteDrugBatch,
    },
    { queueRequestIfOffline }
  );
});
