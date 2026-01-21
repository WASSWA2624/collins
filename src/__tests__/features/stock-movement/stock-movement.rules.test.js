/**
 * Stock Movement Rules Tests
 * File: stock-movement.rules.test.js
 */
import {
  parseStockMovementId,
  parseStockMovementListParams,
  parseStockMovementPayload,
} from '@features/stock-movement';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('stock-movement.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseStockMovementId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseStockMovementPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseStockMovementListParams);
  });
});
