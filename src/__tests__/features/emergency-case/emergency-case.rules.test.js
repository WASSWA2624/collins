/**
 * Emergency Case Rules Tests
 * File: emergency-case.rules.test.js
 */
import {
  parseEmergencyCaseId,
  parseEmergencyCaseListParams,
  parseEmergencyCasePayload,
} from '@features/emergency-case';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('emergency-case.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEmergencyCaseId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEmergencyCasePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEmergencyCaseListParams);
  });
});
