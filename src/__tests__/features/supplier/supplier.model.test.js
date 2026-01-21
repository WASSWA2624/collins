/**
 * Supplier Model Tests
 * File: supplier.model.test.js
 */
import { normalizeSupplier, normalizeSupplierList } from '@features/supplier';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('supplier.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeSupplier, normalizeSupplierList);
  });
});
