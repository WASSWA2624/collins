/**
 * Lab Test Rules Tests
 * File: lab-test.rules.test.js
 */
import { parseLabTestId, parseLabTestListParams, parseLabTestPayload } from '@features/lab-test';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('lab-test.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseLabTestId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseLabTestPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseLabTestListParams);
  });
});
