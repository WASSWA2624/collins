/**
 * Goods Receipt Rules Tests
 * File: goods-receipt.rules.test.js
 */
import { parseGoodsReceiptId, parseGoodsReceiptListParams, parseGoodsReceiptPayload } from '@features/goods-receipt';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('goods-receipt.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseGoodsReceiptId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseGoodsReceiptPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseGoodsReceiptListParams);
  });
});
