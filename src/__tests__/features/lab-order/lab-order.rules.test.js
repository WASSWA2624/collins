/**
 * Lab Order Rules Tests
 * File: lab-order.rules.test.js
 */
import { parseLabOrderId, parseLabOrderListParams, parseLabOrderPayload } from '@features/lab-order';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('lab-order.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseLabOrderId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseLabOrderPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseLabOrderListParams);
  });
});
