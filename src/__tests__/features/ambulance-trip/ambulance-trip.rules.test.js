/**
 * Ambulance Trip Rules Tests
 * File: ambulance-trip.rules.test.js
 */
import {
  parseAmbulanceTripId,
  parseAmbulanceTripListParams,
  parseAmbulanceTripPayload,
} from '@features/ambulance-trip';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('ambulance-trip.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseAmbulanceTripId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseAmbulanceTripPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseAmbulanceTripListParams);
  });
});
