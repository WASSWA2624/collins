/**
 * Pharmacy Order Rules Tests
 * File: pharmacy-order.rules.test.js
 */
import { parsePharmacyOrderId, parsePharmacyOrderListParams, parsePharmacyOrderPayload } from '@features/pharmacy-order';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('pharmacy-order.rules', () => {
  it('parses ids', () => {
    expectIdParser(parsePharmacyOrderId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parsePharmacyOrderPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parsePharmacyOrderListParams);
  });
});
