/**
 * Ambulance Dispatch Rules Tests
 * File: ambulance-dispatch.rules.test.js
 */
import {
  parseAmbulanceDispatchId,
  parseAmbulanceDispatchListParams,
  parseAmbulanceDispatchPayload,
} from '@features/ambulance-dispatch';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('ambulance-dispatch.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseAmbulanceDispatchId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseAmbulanceDispatchPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseAmbulanceDispatchListParams);
  });
});
