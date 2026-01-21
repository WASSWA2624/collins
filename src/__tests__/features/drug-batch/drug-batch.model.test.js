/**
 * Drug Batch Model Tests
 * File: drug-batch.model.test.js
 */
import { normalizeDrugBatch, normalizeDrugBatchList } from '@features/drug-batch';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('drug-batch.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeDrugBatch, normalizeDrugBatchList);
  });
});
