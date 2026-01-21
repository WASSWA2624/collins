/**
 * Dispense Log API Tests
 * File: dispense-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { dispenseLogApi } from '@features/dispense-log/dispense-log.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('dispense-log.api', () => {
  it('creates crud api with dispense log endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.DISPENSE_LOGS);
    expect(dispenseLogApi).toBeDefined();
  });
});
