/**
 * Formulary Item Rules Tests
 * File: formulary-item.rules.test.js
 */
import {
  parseFormularyItemId,
  parseFormularyItemListParams,
  parseFormularyItemPayload,
} from '@features/formulary-item';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('formulary-item.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseFormularyItemId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseFormularyItemPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseFormularyItemListParams);
  });
});
