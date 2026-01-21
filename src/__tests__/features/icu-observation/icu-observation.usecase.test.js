/**
 * ICU Observation Usecase Tests
 * File: icu-observation.usecase.test.js
 */
import {
  listIcuObservations,
  getIcuObservation,
  createIcuObservation,
  updateIcuObservation,
  deleteIcuObservation,
} from '@features/icu-observation';
import { icuObservationApi } from '@features/icu-observation/icu-observation.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/icu-observation/icu-observation.api', () => ({
  icuObservationApi: {
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

describe('icu-observation.usecase', () => {
  beforeEach(() => {
    icuObservationApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    icuObservationApi.get.mockResolvedValue({ data: { id: '1' } });
    icuObservationApi.create.mockResolvedValue({ data: { id: '1' } });
    icuObservationApi.update.mockResolvedValue({ data: { id: '1' } });
    icuObservationApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listIcuObservations,
      get: getIcuObservation,
      create: createIcuObservation,
      update: updateIcuObservation,
      remove: deleteIcuObservation,
    },
    { queueRequestIfOffline }
  );
});
