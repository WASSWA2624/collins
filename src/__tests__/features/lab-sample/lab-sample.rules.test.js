/**
 * Lab Sample Rules Tests
 * File: lab-sample.rules.test.js
 */
import { parseLabSampleId, parseLabSampleListParams, parseLabSamplePayload } from '@features/lab-sample';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('lab-sample.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseLabSampleId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseLabSamplePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseLabSampleListParams);
  });
});
