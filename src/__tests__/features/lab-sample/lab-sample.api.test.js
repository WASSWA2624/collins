/**
 * Lab Sample API Tests
 * File: lab-sample.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { labSampleApi } from '@features/lab-sample/lab-sample.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('lab-sample.api', () => {
  it('creates crud api with lab sample endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.LAB_SAMPLES);
    expect(labSampleApi).toBeDefined();
  });
});
