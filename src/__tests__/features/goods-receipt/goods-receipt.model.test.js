/**
 * Goods Receipt Model Tests
 * File: goods-receipt.model.test.js
 */
import { normalizeGoodsReceipt, normalizeGoodsReceiptList } from '@features/goods-receipt';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('goods-receipt.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeGoodsReceipt, normalizeGoodsReceiptList);
  });
});
