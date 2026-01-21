/**
 * Emergency Case API Tests
 * File: emergency-case.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { emergencyCaseApi } from '@features/emergency-case/emergency-case.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('emergency-case.api', () => {
  it('creates crud api with emergency case endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EMERGENCY_CASES);
    expect(emergencyCaseApi).toBeDefined();
  });
});
