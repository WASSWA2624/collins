/**
 * ICU Observation API Tests
 * File: icu-observation.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { icuObservationApi } from '@features/icu-observation/icu-observation.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('icu-observation.api', () => {
  it('creates crud api with icu observation endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.ICU_OBSERVATIONS);
    expect(icuObservationApi).toBeDefined();
  });
});
