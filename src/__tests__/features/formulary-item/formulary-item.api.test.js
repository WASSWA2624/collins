/**
 * Formulary Item API Tests
 * File: formulary-item.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { formularyItemApi } from '@features/formulary-item/formulary-item.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('formulary-item.api', () => {
  it('creates crud api with formulary item endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.FORMULARY_ITEMS);
    expect(formularyItemApi).toBeDefined();
  });
});
