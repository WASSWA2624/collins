/**
 * Helper Utilities Tests
 * File: helpers.test.js
 */

import { clamp, normalizeWhitespace, safeJsonParse } from '@utils';

describe('Helper Utilities', () => {
  describe('clamp', () => {
    test('should clamp within bounds', () => {
      expect(clamp(5, 1, 10)).toBe(5);
      expect(clamp(-1, 0, 10)).toBe(0);
      expect(clamp(100, 0, 10)).toBe(10);
    });

    test('should handle non-number inputs deterministically', () => {
      expect(clamp('5', 1, 10)).toBe(1);
      expect(clamp(5, '1', 10)).toBe(5);
      expect(clamp(5, 1, '10')).toBe(5);
    });
  });

  describe('normalizeWhitespace', () => {
    test('should trim and collapse whitespace', () => {
      expect(normalizeWhitespace('  hello   world  ')).toBe('hello world');
      expect(normalizeWhitespace('\nhello\t\tworld\n')).toBe('hello world');
    });

    test('should return empty string for non-string', () => {
      expect(normalizeWhitespace(null)).toBe('');
      expect(normalizeWhitespace(undefined)).toBe('');
      expect(normalizeWhitespace(123)).toBe('');
    });
  });

  describe('safeJsonParse', () => {
    test('should parse valid json', () => {
      expect(safeJsonParse('{"a":1}')).toEqual({ a: 1 });
    });

    test('should return fallback for invalid json', () => {
      expect(safeJsonParse('{bad}', { ok: false })).toEqual({ ok: false });
    });

    test('should return fallback for non-string', () => {
      expect(safeJsonParse(null, 'x')).toBe('x');
    });
  });
});

