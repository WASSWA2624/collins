/**
 * Inventory Item Model Tests
 * File: inventory-item.model.test.js
 */
import { normalizeInventoryItem, normalizeInventoryItemList } from '@features/inventory-item';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('inventory-item.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeInventoryItem, normalizeInventoryItemList);
  });
});
