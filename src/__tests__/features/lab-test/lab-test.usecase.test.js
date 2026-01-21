/**
 * Lab Test Usecase Tests
 * File: lab-test.usecase.test.js
 */
import { listLabTests, getLabTest, createLabTest, updateLabTest, deleteLabTest } from '@features/lab-test';
import { labTestApi } from '@features/lab-test/lab-test.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/lab-test/lab-test.api', () => ({
  labTestApi: {
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

describe('lab-test.usecase', () => {
  beforeEach(() => {
    labTestApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    labTestApi.get.mockResolvedValue({ data: { id: '1' } });
    labTestApi.create.mockResolvedValue({ data: { id: '1' } });
    labTestApi.update.mockResolvedValue({ data: { id: '1' } });
    labTestApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listLabTests,
      get: getLabTest,
      create: createLabTest,
      update: updateLabTest,
      remove: deleteLabTest,
    },
    { queueRequestIfOffline }
  );
});
