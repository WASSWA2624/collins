/**
 * Critical Alert Usecase Tests
 * File: critical-alert.usecase.test.js
 */
import {
  listCriticalAlerts,
  getCriticalAlert,
  createCriticalAlert,
  updateCriticalAlert,
  deleteCriticalAlert,
} from '@features/critical-alert';
import { criticalAlertApi } from '@features/critical-alert/critical-alert.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/critical-alert/critical-alert.api', () => ({
  criticalAlertApi: {
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

describe('critical-alert.usecase', () => {
  beforeEach(() => {
    criticalAlertApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    criticalAlertApi.get.mockResolvedValue({ data: { id: '1' } });
    criticalAlertApi.create.mockResolvedValue({ data: { id: '1' } });
    criticalAlertApi.update.mockResolvedValue({ data: { id: '1' } });
    criticalAlertApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listCriticalAlerts,
      get: getCriticalAlert,
      create: createCriticalAlert,
      update: updateCriticalAlert,
      remove: deleteCriticalAlert,
    },
    { queueRequestIfOffline }
  );
});
