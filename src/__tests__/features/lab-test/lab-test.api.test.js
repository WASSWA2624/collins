/**
 * Lab Test API Tests
 * File: lab-test.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { labTestApi } from '@features/lab-test/lab-test.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('lab-test.api', () => {
  it('creates crud api with lab test endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.LAB_TESTS);
    expect(labTestApi).toBeDefined();
  });
});
