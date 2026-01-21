/**
 * Drug Batch Rules Tests
 * File: drug-batch.rules.test.js
 */
import { parseDrugBatchId, parseDrugBatchListParams, parseDrugBatchPayload } from '@features/drug-batch';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('drug-batch.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseDrugBatchId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseDrugBatchPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseDrugBatchListParams);
  });
});
