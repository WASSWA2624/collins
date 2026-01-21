/**
 * Dispense Log Usecase Tests
 * File: dispense-log.usecase.test.js
 */
import {
  listDispenseLogs,
  getDispenseLog,
  createDispenseLog,
  updateDispenseLog,
  deleteDispenseLog,
} from '@features/dispense-log';
import { dispenseLogApi } from '@features/dispense-log/dispense-log.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/dispense-log/dispense-log.api', () => ({
  dispenseLogApi: {
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

describe('dispense-log.usecase', () => {
  beforeEach(() => {
    dispenseLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    dispenseLogApi.get.mockResolvedValue({ data: { id: '1' } });
    dispenseLogApi.create.mockResolvedValue({ data: { id: '1' } });
    dispenseLogApi.update.mockResolvedValue({ data: { id: '1' } });
    dispenseLogApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listDispenseLogs,
      get: getDispenseLog,
      create: createDispenseLog,
      update: updateDispenseLog,
      remove: deleteDispenseLog,
    },
    { queueRequestIfOffline }
  );
});
