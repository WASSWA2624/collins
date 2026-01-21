/**
 * Emergency Response Usecase Tests
 * File: emergency-response.usecase.test.js
 */
import {
  listEmergencyResponses,
  getEmergencyResponse,
  createEmergencyResponse,
  updateEmergencyResponse,
  deleteEmergencyResponse,
} from '@features/emergency-response';
import { emergencyResponseApi } from '@features/emergency-response/emergency-response.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/emergency-response/emergency-response.api', () => ({
  emergencyResponseApi: {
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

describe('emergency-response.usecase', () => {
  beforeEach(() => {
    emergencyResponseApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    emergencyResponseApi.get.mockResolvedValue({ data: { id: '1' } });
    emergencyResponseApi.create.mockResolvedValue({ data: { id: '1' } });
    emergencyResponseApi.update.mockResolvedValue({ data: { id: '1' } });
    emergencyResponseApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEmergencyResponses,
      get: getEmergencyResponse,
      create: createEmergencyResponse,
      update: updateEmergencyResponse,
      remove: deleteEmergencyResponse,
    },
    { queueRequestIfOffline }
  );
});
