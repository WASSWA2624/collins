/**
 * Dispense Log Rules Tests
 * File: dispense-log.rules.test.js
 */
import { parseDispenseLogId, parseDispenseLogListParams, parseDispenseLogPayload } from '@features/dispense-log';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('dispense-log.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseDispenseLogId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseDispenseLogPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseDispenseLogListParams);
  });
});
