/**
 * Adverse Event API Tests
 * File: adverse-event.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { adverseEventApi } from '@features/adverse-event/adverse-event.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('adverse-event.api', () => {
  it('creates crud api with adverse event endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.ADVERSE_EVENTS);
    expect(adverseEventApi).toBeDefined();
  });
});
