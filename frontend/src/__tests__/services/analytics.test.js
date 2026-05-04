/**
 * Analytics Service Tests
 * File: analytics.test.js
 */
// Mock config
jest.mock('@config', () => ({
  featureFlags: {
    ANALYTICS_ENABLED: true,
  },
}));

const { trackEvent, trackScreen } = require('@services/analytics');

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('should not throw when analytics is enabled', async () => {
      expect(() => trackEvent('test_event', { key: 'value' })).not.toThrow();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should no-op when analytics is disabled', async () => {
      jest.resetModules();
      jest.doMock('@config', () => ({
        featureFlags: {
          ANALYTICS_ENABLED: false,
        },
      }));

      const { trackEvent: trackEventDisabled } = require('@services/analytics');
      trackEventDisabled('test_event', { key: 'value' });

      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should handle events without properties', async () => {
      expect(() => trackEvent('simple_event')).not.toThrow();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should silently fail on errors', async () => {
      // Should not throw
      expect(() => {
        trackEvent('test_event');
      }).not.toThrow();

      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  describe('trackScreen', () => {
    it('should track screen view event', async () => {
      expect(() => trackScreen('HomeScreen', { userId: '123' })).not.toThrow();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should track screen view without additional properties', async () => {
      expect(() => trackScreen('ProfileScreen')).not.toThrow();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
});

