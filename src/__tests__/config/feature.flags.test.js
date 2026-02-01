/**
 * Feature Flags Tests
 * File: feature.flags.test.js
 */
import * as featureFlags from '@config/feature.flags';

describe('feature.flags.js', () => {
  test('should export feature flags', () => {
    expect(featureFlags).toBeDefined();
  });

  test('should export OFFLINE_MODE', () => {
    expect(featureFlags.OFFLINE_MODE).toBeDefined();
    expect(typeof featureFlags.OFFLINE_MODE).toBe('boolean');
  });

  test('should export ANALYTICS_ENABLED', () => {
    expect(featureFlags.ANALYTICS_ENABLED).toBeDefined();
    expect(typeof featureFlags.ANALYTICS_ENABLED).toBe('boolean');
  });

  test('should export AI_AUGMENTATION_ENABLED', () => {
    expect(featureFlags.AI_AUGMENTATION_ENABLED).toBeDefined();
    expect(typeof featureFlags.AI_AUGMENTATION_ENABLED).toBe('boolean');
  });

  test('should have correct feature flag values', () => {
    expect(featureFlags.OFFLINE_MODE).toBe(true);
    expect(featureFlags.ANALYTICS_ENABLED).toBe(false);
    expect(featureFlags.AI_AUGMENTATION_ENABLED).toBe(false);
  });
});

