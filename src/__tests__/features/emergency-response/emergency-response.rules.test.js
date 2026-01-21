/**
 * Emergency Response Rules Tests
 * File: emergency-response.rules.test.js
 */
import {
  parseEmergencyResponseId,
  parseEmergencyResponseListParams,
  parseEmergencyResponsePayload,
} from '@features/emergency-response';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('emergency-response.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEmergencyResponseId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEmergencyResponsePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEmergencyResponseListParams);
  });
});
