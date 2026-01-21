/**
 * ICU Observation Rules Tests
 * File: icu-observation.rules.test.js
 */
import {
  parseIcuObservationId,
  parseIcuObservationListParams,
  parseIcuObservationPayload,
} from '@features/icu-observation';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('icu-observation.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseIcuObservationId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseIcuObservationPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseIcuObservationListParams);
  });
});
