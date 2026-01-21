/**
 * ICU Stay Rules Tests
 * File: icu-stay.rules.test.js
 */
import { parseIcuStayId, parseIcuStayListParams, parseIcuStayPayload } from '@features/icu-stay';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('icu-stay.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseIcuStayId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseIcuStayPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseIcuStayListParams);
  });
});
