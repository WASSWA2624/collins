/**
 * Lab QC Log Rules Tests
 * File: lab-qc-log.rules.test.js
 */
import { parseLabQcLogId, parseLabQcLogListParams, parseLabQcLogPayload } from '@features/lab-qc-log';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('lab-qc-log.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseLabQcLogId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseLabQcLogPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseLabQcLogListParams);
  });
});
