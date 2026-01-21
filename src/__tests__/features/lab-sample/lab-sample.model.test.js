/**
 * Lab Sample Model Tests
 * File: lab-sample.model.test.js
 */
import { normalizeLabSample, normalizeLabSampleList } from '@features/lab-sample';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('lab-sample.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeLabSample, normalizeLabSampleList);
  });
});
