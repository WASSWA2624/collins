/**
 * Lab Test Model Tests
 * File: lab-test.model.test.js
 */
import { normalizeLabTest, normalizeLabTestList } from '@features/lab-test';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('lab-test.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeLabTest, normalizeLabTestList);
  });
});
