/**
 * Adverse Event Rules Tests
 * File: adverse-event.rules.test.js
 */
import { parseAdverseEventId, parseAdverseEventListParams, parseAdverseEventPayload } from '@features/adverse-event';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('adverse-event.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseAdverseEventId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseAdverseEventPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseAdverseEventListParams);
  });
});
