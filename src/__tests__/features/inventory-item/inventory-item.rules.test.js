/**
 * Inventory Item Rules Tests
 * File: inventory-item.rules.test.js
 */
import {
  parseInventoryItemId,
  parseInventoryItemListParams,
  parseInventoryItemPayload,
} from '@features/inventory-item';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('inventory-item.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseInventoryItemId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseInventoryItemPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseInventoryItemListParams);
  });
});
