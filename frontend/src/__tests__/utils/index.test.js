/**
 * Utils Barrel Export Tests
 * File: index.test.js
 */
import * as utils from '@utils';

describe('utils/index.js (barrel export)', () => {
  test('should export all utils modules', () => {
    expect(utils.formatDate).toBeDefined();
    expect(utils.formatCurrency).toBeDefined();
    expect(utils.formatNumber).toBeDefined();
    expect(utils.isValidEmail).toBeDefined();
    expect(utils.isValidUrl).toBeDefined();
    expect(utils.clamp).toBeDefined();
    expect(utils.normalizeWhitespace).toBeDefined();
    expect(utils.safeJsonParse).toBeDefined();
    expect(utils.BANNER_VARIANTS).toBeDefined();
  });

  test('should export formatter functions', () => {
    expect(typeof utils.formatDate).toBe('function');
    expect(typeof utils.formatCurrency).toBe('function');
    expect(typeof utils.formatNumber).toBe('function');
  });

  test('should export validator functions', () => {
    expect(typeof utils.isValidEmail).toBe('function');
    expect(typeof utils.isValidUrl).toBe('function');
  });

  test('should export helper functions', () => {
    expect(typeof utils.clamp).toBe('function');
    expect(typeof utils.normalizeWhitespace).toBe('function');
    expect(typeof utils.safeJsonParse).toBe('function');
  });

  test('should have correct barrel export structure', () => {
    const expectedExports = [
      'formatDate',
      'formatCurrency',
      'formatNumber',
      'isValidEmail',
      'isValidUrl',
      'clamp',
      'normalizeWhitespace',
      'safeJsonParse',
      'BANNER_VARIANTS',
    ];
    expectedExports.forEach((exportName) => {
      expect(utils).toHaveProperty(exportName);
    });
  });
});

