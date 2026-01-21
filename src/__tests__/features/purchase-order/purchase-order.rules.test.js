/**
 * Purchase Order Rules Tests
 * File: purchase-order.rules.test.js
 */
import {
  parsePurchaseOrderId,
  parsePurchaseOrderListParams,
  parsePurchaseOrderPayload,
} from '@features/purchase-order';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('purchase-order.rules', () => {
  it('parses ids', () => {
    expectIdParser(parsePurchaseOrderId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parsePurchaseOrderPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parsePurchaseOrderListParams);
  });
});
