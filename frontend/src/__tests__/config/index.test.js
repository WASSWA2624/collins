/**
 * Config Barrel Export Tests
 * File: index.test.js
 */
import * as config from '@config';

describe('config/index.js (barrel export)', () => {
  test('should export all config modules', () => {
    expect(config.NODE_ENV).toBeDefined();
    expect(config.API_BASE_URL).toBeDefined();
    expect(config.API_VERSION).toBeDefined();
    expect(config.PAGINATION).toBeDefined();
    expect(config.TIMEOUTS).toBeDefined();
    expect(config.endpoints).toBeDefined();
    expect(config.featureFlags).toBeDefined();
  });

  test('should export env variables', () => {
    expect(typeof config.NODE_ENV).toBe('string');
    expect(typeof config.API_BASE_URL).toBe('string');
    expect(typeof config.API_VERSION).toBe('string');
  });

  test('should export constants', () => {
    expect(config.PAGINATION).toBeDefined();
    expect(config.TIMEOUTS).toBeDefined();
  });

  test('should export endpoints', () => {
    expect(config.endpoints).toBeDefined();
    expect(config.endpoints.AUTH).toBeDefined();
  });

  test('should export feature flags namespace', () => {
    expect(config.featureFlags).toBeDefined();
    expect(config.featureFlags.OFFLINE_MODE).toBeDefined();
    expect(config.featureFlags.ANALYTICS_ENABLED).toBeDefined();
  });

  test('should have correct barrel export structure', () => {
    // Verify all expected exports are present
    const expectedExports = [
      'NODE_ENV',
      'API_BASE_URL',
      'API_VERSION',
      'PAGINATION',
      'TIMEOUTS',
      'endpoints',
      'featureFlags',
    ];
    expectedExports.forEach((exportName) => {
      expect(config).toHaveProperty(exportName);
    });
  });
});

