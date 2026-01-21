/**
 * Ambulance Trip API Tests
 * File: ambulance-trip.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { ambulanceTripApi } from '@features/ambulance-trip/ambulance-trip.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('ambulance-trip.api', () => {
  it('creates crud api with ambulance trip endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.AMBULANCE_TRIPS);
    expect(ambulanceTripApi).toBeDefined();
  });
});
