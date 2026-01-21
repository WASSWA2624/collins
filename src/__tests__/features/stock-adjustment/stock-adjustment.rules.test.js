/**
 * Stock Adjustment Rules Tests
 * File: stock-adjustment.rules.test.js
 */
import {
  parseStockAdjustmentId,
  parseStockAdjustmentListParams,
  parseStockAdjustmentPayload,
} from '@features/stock-adjustment';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('stock-adjustment.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseStockAdjustmentId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseStockAdjustmentPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseStockAdjustmentListParams);
  });
});
