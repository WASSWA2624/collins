/**
 * Lab Order Model Tests
 * File: lab-order.model.test.js
 */
import { normalizeLabOrder, normalizeLabOrderList } from '@features/lab-order';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('lab-order.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeLabOrder, normalizeLabOrderList);
  });
});
