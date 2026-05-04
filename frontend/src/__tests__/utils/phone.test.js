/**
 * Phone Utils Tests
 * File: phone.test.js
 */
import { normalizePhoneNumber } from '@utils';

describe('normalizePhoneNumber', () => {
  it('removes non-digit characters', () => {
    expect(normalizePhoneNumber('+256 701-234-567')).toBe('256701234567');
  });

  it('returns empty string for empty input', () => {
    expect(normalizePhoneNumber('')).toBe('');
    expect(normalizePhoneNumber(null)).toBe('');
  });
});
