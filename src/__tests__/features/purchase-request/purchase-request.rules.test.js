/**
 * Purchase Request Rules Tests
 * File: purchase-request.rules.test.js
 */
import {
  parsePurchaseRequestId,
  parsePurchaseRequestListParams,
  parsePurchaseRequestPayload,
} from '@features/purchase-request';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('purchase-request.rules', () => {
  it('parses ids', () => {
    expectIdParser(parsePurchaseRequestId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parsePurchaseRequestPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parsePurchaseRequestListParams);
  });
});
