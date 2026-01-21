/**
 * Pharmacy Order Item Rules Tests
 * File: pharmacy-order-item.rules.test.js
 */
import {
  parsePharmacyOrderItemId,
  parsePharmacyOrderItemListParams,
  parsePharmacyOrderItemPayload,
} from '@features/pharmacy-order-item';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('pharmacy-order-item.rules', () => {
  it('parses ids', () => {
    expectIdParser(parsePharmacyOrderItemId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parsePharmacyOrderItemPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parsePharmacyOrderItemListParams);
  });
});
