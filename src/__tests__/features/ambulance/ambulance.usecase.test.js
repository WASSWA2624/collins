/**
 * Ambulance Usecase Tests
 * File: ambulance.usecase.test.js
 */
import {
  listAmbulances,
  getAmbulance,
  createAmbulance,
  updateAmbulance,
  deleteAmbulance,
} from '@features/ambulance';
import { ambulanceApi } from '@features/ambulance/ambulance.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/ambulance/ambulance.api', () => ({
  ambulanceApi: {
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

describe('ambulance.usecase', () => {
  beforeEach(() => {
    ambulanceApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    ambulanceApi.get.mockResolvedValue({ data: { id: '1' } });
    ambulanceApi.create.mockResolvedValue({ data: { id: '1' } });
    ambulanceApi.update.mockResolvedValue({ data: { id: '1' } });
    ambulanceApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listAmbulances,
      get: getAmbulance,
      create: createAmbulance,
      update: updateAmbulance,
      remove: deleteAmbulance,
    },
    { queueRequestIfOffline }
  );
});
