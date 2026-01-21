/**
 * Lab Order Item Rules Tests
 * File: lab-order-item.rules.test.js
 */
import {
  parseLabOrderItemId,
  parseLabOrderItemListParams,
  parseLabOrderItemPayload,
} from '@features/lab-order-item';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('lab-order-item.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseLabOrderItemId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseLabOrderItemPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseLabOrderItemListParams);
  });
});
