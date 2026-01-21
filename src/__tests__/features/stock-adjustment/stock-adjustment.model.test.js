/**
 * Stock Adjustment Model Tests
 * File: stock-adjustment.model.test.js
 */
import { normalizeStockAdjustment, normalizeStockAdjustmentList } from '@features/stock-adjustment';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('stock-adjustment.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeStockAdjustment, normalizeStockAdjustmentList);
  });
});
