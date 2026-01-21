/**
 * Stock Movement Model Tests
 * File: stock-movement.model.test.js
 */
import { normalizeStockMovement, normalizeStockMovementList } from '@features/stock-movement';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('stock-movement.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeStockMovement, normalizeStockMovementList);
  });
});
