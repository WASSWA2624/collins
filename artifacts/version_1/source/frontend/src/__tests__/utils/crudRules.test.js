/**
 * CRUD Rules Tests
 * File: crudRules.test.js
 */
import { createCrudRules } from '@utils/crudRules';

describe('crudRules', () => {
  it('parses ids, payloads, and list params', () => {
    const rules = createCrudRules();
    expect(rules.parseId('123')).toBe('123');
    expect(rules.parseId(10)).toBe(10);
    expect(rules.parsePayload({ name: 'value' })).toEqual({ name: 'value' });
    expect(rules.parsePayload()).toEqual({});
    expect(rules.parseListParams({ page: 1, limit: 20 })).toEqual({ page: 1, limit: 20 });
    expect(rules.parseListParams()).toEqual({});
  });
});
