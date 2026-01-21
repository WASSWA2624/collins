/**
 * Drug API Tests
 * File: drug.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { drugApi } from '@features/drug/drug.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('drug.api', () => {
  it('creates crud api with drug endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.DRUGS);
    expect(drugApi).toBeDefined();
  });
});
