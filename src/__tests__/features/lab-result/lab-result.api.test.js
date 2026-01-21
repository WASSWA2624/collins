/**
 * Lab Result API Tests
 * File: lab-result.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { labResultApi } from '@features/lab-result/lab-result.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('lab-result.api', () => {
  it('creates crud api with lab result endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.LAB_RESULTS);
    expect(labResultApi).toBeDefined();
  });
});
