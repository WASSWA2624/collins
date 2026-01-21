/**
 * Critical Alert Rules Tests
 * File: critical-alert.rules.test.js
 */
import {
  parseCriticalAlertId,
  parseCriticalAlertListParams,
  parseCriticalAlertPayload,
} from '@features/critical-alert';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('critical-alert.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseCriticalAlertId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseCriticalAlertPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseCriticalAlertListParams);
  });
});
