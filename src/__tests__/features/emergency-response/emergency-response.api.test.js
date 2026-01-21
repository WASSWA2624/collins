/**
 * Emergency Response API Tests
 * File: emergency-response.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { emergencyResponseApi } from '@features/emergency-response/emergency-response.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('emergency-response.api', () => {
  it('creates crud api with emergency response endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EMERGENCY_RESPONSES);
    expect(emergencyResponseApi).toBeDefined();
  });
});
