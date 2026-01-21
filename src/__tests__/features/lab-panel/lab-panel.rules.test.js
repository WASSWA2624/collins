/**
 * Lab Panel Rules Tests
 * File: lab-panel.rules.test.js
 */
import { parseLabPanelId, parseLabPanelListParams, parseLabPanelPayload } from '@features/lab-panel';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('lab-panel.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseLabPanelId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseLabPanelPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseLabPanelListParams);
  });
});
