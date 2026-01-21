/**
 * Inventory Stock Model Tests
 * File: inventory-stock.model.test.js
 */
import { normalizeInventoryStock, normalizeInventoryStockList } from '@features/inventory-stock';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('inventory-stock.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeInventoryStock, normalizeInventoryStockList);
  });
});
