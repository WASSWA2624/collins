/**
 * Lab Order Item Model Tests
 * File: lab-order-item.model.test.js
 */
import { normalizeLabOrderItem, normalizeLabOrderItemList } from '@features/lab-order-item';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('lab-order-item.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeLabOrderItem, normalizeLabOrderItemList);
  });
});
