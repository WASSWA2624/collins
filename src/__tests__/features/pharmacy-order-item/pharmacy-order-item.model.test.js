/**
 * Pharmacy Order Item Model Tests
 * File: pharmacy-order-item.model.test.js
 */
import { normalizePharmacyOrderItem, normalizePharmacyOrderItemList } from '@features/pharmacy-order-item';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('pharmacy-order-item.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizePharmacyOrderItem, normalizePharmacyOrderItemList);
  });
});
