/**
 * Lab Result Usecase Tests
 * File: lab-result.usecase.test.js
 */
import { listLabResults, getLabResult, createLabResult, updateLabResult, deleteLabResult } from '@features/lab-result';
import { labResultApi } from '@features/lab-result/lab-result.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/lab-result/lab-result.api', () => ({
  labResultApi: {
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

describe('lab-result.usecase', () => {
  beforeEach(() => {
    labResultApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    labResultApi.get.mockResolvedValue({ data: { id: '1' } });
    labResultApi.create.mockResolvedValue({ data: { id: '1' } });
    labResultApi.update.mockResolvedValue({ data: { id: '1' } });
    labResultApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listLabResults,
      get: getLabResult,
      create: createLabResult,
      update: updateLabResult,
      remove: deleteLabResult,
    },
    { queueRequestIfOffline }
  );
});
