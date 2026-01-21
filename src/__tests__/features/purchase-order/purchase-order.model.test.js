/**
 * Purchase Order Model Tests
 * File: purchase-order.model.test.js
 */
import { normalizePurchaseOrder, normalizePurchaseOrderList } from '@features/purchase-order';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('purchase-order.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizePurchaseOrder, normalizePurchaseOrderList);
  });
});
