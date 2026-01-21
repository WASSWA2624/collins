/**
 * Lab Sample Usecase Tests
 * File: lab-sample.usecase.test.js
 */
import { listLabSamples, getLabSample, createLabSample, updateLabSample, deleteLabSample } from '@features/lab-sample';
import { labSampleApi } from '@features/lab-sample/lab-sample.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/lab-sample/lab-sample.api', () => ({
  labSampleApi: {
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

describe('lab-sample.usecase', () => {
  beforeEach(() => {
    labSampleApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    labSampleApi.get.mockResolvedValue({ data: { id: '1' } });
    labSampleApi.create.mockResolvedValue({ data: { id: '1' } });
    labSampleApi.update.mockResolvedValue({ data: { id: '1' } });
    labSampleApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listLabSamples,
      get: getLabSample,
      create: createLabSample,
      update: updateLabSample,
      remove: deleteLabSample,
    },
    { queueRequestIfOffline }
  );
});
