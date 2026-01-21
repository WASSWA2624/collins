/**
 * Inventory Stock Rules Tests
 * File: inventory-stock.rules.test.js
 */
import {
  parseInventoryStockId,
  parseInventoryStockListParams,
  parseInventoryStockPayload,
} from '@features/inventory-stock';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('inventory-stock.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseInventoryStockId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseInventoryStockPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseInventoryStockListParams);
  });
});
