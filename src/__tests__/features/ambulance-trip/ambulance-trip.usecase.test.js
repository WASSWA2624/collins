/**
 * Ambulance Trip Usecase Tests
 * File: ambulance-trip.usecase.test.js
 */
import {
  listAmbulanceTrips,
  getAmbulanceTrip,
  createAmbulanceTrip,
  updateAmbulanceTrip,
  deleteAmbulanceTrip,
} from '@features/ambulance-trip';
import { ambulanceTripApi } from '@features/ambulance-trip/ambulance-trip.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/ambulance-trip/ambulance-trip.api', () => ({
  ambulanceTripApi: {
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

describe('ambulance-trip.usecase', () => {
  beforeEach(() => {
    ambulanceTripApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    ambulanceTripApi.get.mockResolvedValue({ data: { id: '1' } });
    ambulanceTripApi.create.mockResolvedValue({ data: { id: '1' } });
    ambulanceTripApi.update.mockResolvedValue({ data: { id: '1' } });
    ambulanceTripApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listAmbulanceTrips,
      get: getAmbulanceTrip,
      create: createAmbulanceTrip,
      update: updateAmbulanceTrip,
      remove: deleteAmbulanceTrip,
    },
    { queueRequestIfOffline }
  );
});
