/**
 * Drug Model Tests
 * File: drug.model.test.js
 */
import { normalizeDrug, normalizeDrugList } from '@features/drug';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('drug.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeDrug, normalizeDrugList);
  });
});
