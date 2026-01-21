/**
 * Critical Alert API Tests
 * File: critical-alert.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { criticalAlertApi } from '@features/critical-alert/critical-alert.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('critical-alert.api', () => {
  it('creates crud api with critical alert endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.CRITICAL_ALERTS);
    expect(criticalAlertApi).toBeDefined();
  });
});
