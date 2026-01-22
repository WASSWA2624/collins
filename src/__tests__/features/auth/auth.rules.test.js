/**
 * Auth Rules Tests
 * File: auth.rules.test.js
 */
import { parseAuthPayload, parseCredentials } from '@features/auth';

describe('auth.rules', () => {
  it('parses credentials and payloads', () => {
    expect(parseCredentials({ email: 'user@example.com', password: 'pass', tenant_id: '550e8400-e29b-41d4-a716-446655440000' })).toEqual({
      email: 'user@example.com',
      password: 'pass',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(parseCredentials({
      email: 'user@example.com',
      password: 'pass',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      facility_id: '550e8400-e29b-41d4-a716-446655440001'
    })).toEqual({
      email: 'user@example.com',
      password: 'pass',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      facility_id: '550e8400-e29b-41d4-a716-446655440001'
    });
    expect(parseCredentials({ phone: '256701234567', password: 'pass', tenant_id: '550e8400-e29b-41d4-a716-446655440000' })).toEqual({
      phone: '256701234567',
      password: 'pass',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(parseAuthPayload({ token: 'abc' })).toEqual({ token: 'abc' });
  });

  it('rejects credentials without identifier', () => {
    expect(() => parseCredentials({ password: 'pass', tenant_id: '550e8400-e29b-41d4-a716-446655440000' })).toThrow('identifier_required');
  });

  it('rejects phone numbers with plus sign', () => {
    expect(() => parseCredentials({ phone: '+256701234567', password: 'pass', tenant_id: '550e8400-e29b-41d4-a716-446655440000' })).toThrow();
  });
});
