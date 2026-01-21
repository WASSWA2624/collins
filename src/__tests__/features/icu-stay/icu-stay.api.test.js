/**
 * ICU Stay API Tests
 * File: icu-stay.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { icuStayApi } from '@features/icu-stay/icu-stay.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('icu-stay.api', () => {
  it('creates crud api with icu stay endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.ICU_STAYS);
    expect(icuStayApi).toBeDefined();
  });
});
