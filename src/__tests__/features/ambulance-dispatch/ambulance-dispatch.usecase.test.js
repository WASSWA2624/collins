/**
 * Ambulance Dispatch Usecase Tests
 * File: ambulance-dispatch.usecase.test.js
 */
import {
  listAmbulanceDispatches,
  getAmbulanceDispatch,
  createAmbulanceDispatch,
  updateAmbulanceDispatch,
  deleteAmbulanceDispatch,
} from '@features/ambulance-dispatch';
import { ambulanceDispatchApi } from '@features/ambulance-dispatch/ambulance-dispatch.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/ambulance-dispatch/ambulance-dispatch.api', () => ({
  ambulanceDispatchApi: {
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

describe('ambulance-dispatch.usecase', () => {
  beforeEach(() => {
    ambulanceDispatchApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    ambulanceDispatchApi.get.mockResolvedValue({ data: { id: '1' } });
    ambulanceDispatchApi.create.mockResolvedValue({ data: { id: '1' } });
    ambulanceDispatchApi.update.mockResolvedValue({ data: { id: '1' } });
    ambulanceDispatchApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listAmbulanceDispatches,
      get: getAmbulanceDispatch,
      create: createAmbulanceDispatch,
      update: updateAmbulanceDispatch,
      remove: deleteAmbulanceDispatch,
    },
    { queueRequestIfOffline }
  );
});
