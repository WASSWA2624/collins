/**
 * Lab Result Rules Tests
 * File: lab-result.rules.test.js
 */
import { parseLabResultId, parseLabResultListParams, parseLabResultPayload } from '@features/lab-result';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('lab-result.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseLabResultId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseLabResultPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseLabResultListParams);
  });
});
