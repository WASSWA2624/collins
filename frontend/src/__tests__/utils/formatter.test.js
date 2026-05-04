/**
 * Formatter Utilities Tests
 * File: formatter.test.js
 */

import { formatDate, formatCurrency, formatNumber } from '@utils';

describe('Formatter Utilities', () => {
  describe('formatDate', () => {
    test('should format a valid date', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    test('should return empty string for null', () => {
      expect(formatDate(null)).toBe('');
    });

    test('should return empty string for undefined', () => {
      expect(formatDate(undefined)).toBe('');
    });

    test('should accept date string', () => {
      const formatted = formatDate('2024-01-15');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    test('should accept custom locale', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date, 'fr-FR');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });
  });

  describe('formatCurrency', () => {
    test('should format valid number as currency', () => {
      const formatted = formatCurrency(1234.56);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('1');
    });

    test('should return empty string for non-number', () => {
      expect(formatCurrency('123')).toBe('');
      expect(formatCurrency(null)).toBe('');
      expect(formatCurrency(undefined)).toBe('');
    });

    test('should accept custom currency', () => {
      const formatted = formatCurrency(1234.56, 'EUR');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    test('should accept custom locale', () => {
      const formatted = formatCurrency(1234.56, 'USD', 'fr-FR');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    test('should handle zero', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    test('should handle negative numbers', () => {
      const formatted = formatCurrency(-100);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });
  });

  describe('formatNumber', () => {
    test('should format valid number', () => {
      const formatted = formatNumber(1234567.89);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('1');
    });

    test('should return empty string for non-number', () => {
      expect(formatNumber('123')).toBe('');
      expect(formatNumber(null)).toBe('');
      expect(formatNumber(undefined)).toBe('');
    });

    test('should accept custom locale', () => {
      const formatted = formatNumber(1234567.89, 'fr-FR');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    test('should handle zero', () => {
      const formatted = formatNumber(0);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    test('should handle negative numbers', () => {
      const formatted = formatNumber(-1000);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });
  });
});

