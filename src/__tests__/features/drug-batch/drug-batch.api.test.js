/**
 * Drug Batch API Tests
 * File: drug-batch.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { drugBatchApi } from '@features/drug-batch/drug-batch.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('drug-batch.api', () => {
  it('creates crud api with drug batch endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.DRUG_BATCHES);
    expect(drugBatchApi).toBeDefined();
  });
});
