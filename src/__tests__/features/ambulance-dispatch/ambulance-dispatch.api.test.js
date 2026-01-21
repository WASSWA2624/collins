/**
 * Ambulance Dispatch API Tests
 * File: ambulance-dispatch.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { ambulanceDispatchApi } from '@features/ambulance-dispatch/ambulance-dispatch.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('ambulance-dispatch.api', () => {
  it('creates crud api with ambulance dispatch endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.AMBULANCE_DISPATCHES);
    expect(ambulanceDispatchApi).toBeDefined();
  });
});
