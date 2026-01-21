/**
 * Lab QC Log API Tests
 * File: lab-qc-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { labQcLogApi } from '@features/lab-qc-log/lab-qc-log.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('lab-qc-log.api', () => {
  it('creates crud api with lab qc log endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.LAB_QC_LOGS);
    expect(labQcLogApi).toBeDefined();
  });
});
