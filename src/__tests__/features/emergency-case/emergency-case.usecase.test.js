/**
 * Emergency Case Usecase Tests
 * File: emergency-case.usecase.test.js
 */
import {
  listEmergencyCases,
  getEmergencyCase,
  createEmergencyCase,
  updateEmergencyCase,
  deleteEmergencyCase,
} from '@features/emergency-case';
import { emergencyCaseApi } from '@features/emergency-case/emergency-case.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/emergency-case/emergency-case.api', () => ({
  emergencyCaseApi: {
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

describe('emergency-case.usecase', () => {
  beforeEach(() => {
    emergencyCaseApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    emergencyCaseApi.get.mockResolvedValue({ data: { id: '1' } });
    emergencyCaseApi.create.mockResolvedValue({ data: { id: '1' } });
    emergencyCaseApi.update.mockResolvedValue({ data: { id: '1' } });
    emergencyCaseApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEmergencyCases,
      get: getEmergencyCase,
      create: createEmergencyCase,
      update: updateEmergencyCase,
      remove: deleteEmergencyCase,
    },
    { queueRequestIfOffline }
  );
});
