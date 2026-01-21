/**
 * Ambulance API Tests
 * File: ambulance.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { ambulanceApi } from '@features/ambulance/ambulance.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('ambulance.api', () => {
  it('creates crud api with ambulance endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.AMBULANCES);
    expect(ambulanceApi).toBeDefined();
  });
});
