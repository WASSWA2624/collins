/**
 * Drug Rules Tests
 * File: drug.rules.test.js
 */
import { parseDrugId, parseDrugListParams, parseDrugPayload } from '@features/drug';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('drug.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseDrugId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseDrugPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseDrugListParams);
  });
});
