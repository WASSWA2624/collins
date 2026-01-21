/**
 * Lab QC Log Usecase Tests
 * File: lab-qc-log.usecase.test.js
 */
import {
  listLabQcLogs,
  getLabQcLog,
  createLabQcLog,
  updateLabQcLog,
  deleteLabQcLog,
} from '@features/lab-qc-log';
import { labQcLogApi } from '@features/lab-qc-log/lab-qc-log.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/lab-qc-log/lab-qc-log.api', () => ({
  labQcLogApi: {
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

describe('lab-qc-log.usecase', () => {
  beforeEach(() => {
    labQcLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    labQcLogApi.get.mockResolvedValue({ data: { id: '1' } });
    labQcLogApi.create.mockResolvedValue({ data: { id: '1' } });
    labQcLogApi.update.mockResolvedValue({ data: { id: '1' } });
    labQcLogApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listLabQcLogs,
      get: getLabQcLog,
      create: createLabQcLog,
      update: updateLabQcLog,
      remove: deleteLabQcLog,
    },
    { queueRequestIfOffline }
  );
});
