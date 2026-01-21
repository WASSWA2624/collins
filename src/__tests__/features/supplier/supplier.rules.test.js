/**
 * Supplier Rules Tests
 * File: supplier.rules.test.js
 */
import { parseSupplierId, parseSupplierListParams, parseSupplierPayload } from '@features/supplier';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('supplier.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseSupplierId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseSupplierPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseSupplierListParams);
  });
});
