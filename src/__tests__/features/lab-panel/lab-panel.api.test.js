/**
 * Lab Panel API Tests
 * File: lab-panel.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { labPanelApi } from '@features/lab-panel/lab-panel.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('lab-panel.api', () => {
  it('creates crud api with lab panel endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.LAB_PANELS);
    expect(labPanelApi).toBeDefined();
  });
});
