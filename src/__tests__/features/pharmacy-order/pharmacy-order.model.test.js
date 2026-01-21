/**
 * Pharmacy Order Model Tests
 * File: pharmacy-order.model.test.js
 */
import { normalizePharmacyOrder, normalizePharmacyOrderList } from '@features/pharmacy-order';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('pharmacy-order.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizePharmacyOrder, normalizePharmacyOrderList);
  });
});
