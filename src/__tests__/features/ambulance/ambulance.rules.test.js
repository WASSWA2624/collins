/**
 * Ambulance Rules Tests
 * File: ambulance.rules.test.js
 */
import { parseAmbulanceId, parseAmbulanceListParams, parseAmbulancePayload } from '@features/ambulance';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('ambulance.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseAmbulanceId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseAmbulancePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseAmbulanceListParams);
  });
});
