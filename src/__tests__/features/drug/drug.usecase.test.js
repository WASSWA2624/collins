/**
 * Drug Usecase Tests
 * File: drug.usecase.test.js
 */
import { listDrugs, getDrug, createDrug, updateDrug, deleteDrug } from '@features/drug';
import { drugApi } from '@features/drug/drug.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/drug/drug.api', () => ({
  drugApi: {
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

describe('drug.usecase', () => {
  beforeEach(() => {
    drugApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    drugApi.get.mockResolvedValue({ data: { id: '1' } });
    drugApi.create.mockResolvedValue({ data: { id: '1' } });
    drugApi.update.mockResolvedValue({ data: { id: '1' } });
    drugApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listDrugs,
      get: getDrug,
      create: createDrug,
      update: updateDrug,
      remove: deleteDrug,
    },
    { queueRequestIfOffline }
  );
});
