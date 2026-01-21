/**
 * Lab Result Model Tests
 * File: lab-result.model.test.js
 */
import { normalizeLabResult, normalizeLabResultList } from '@features/lab-result';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('lab-result.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeLabResult, normalizeLabResultList);
  });
});
