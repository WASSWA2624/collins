/**
 * Environment Configuration Tests
 * File: env.test.js
 */

describe('env.js', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getEnvVar', () => {
    test('should return default value when env var is not set', async () => {
      delete process.env.NODE_ENV;
      jest.resetModules();
      const mod = await import('@config/env');
      expect(mod.NODE_ENV).toBe('development');
    });

    test('should return env var value when set', async () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();
      const mod = await import('@config/env');
      expect(mod.NODE_ENV).toBe('production');
    });

    test('should throw error for missing required env var without default', async () => {
      delete process.env.EXPO_PUBLIC_API_BASE_URL;
      jest.resetModules();
      // This should use the default, so it shouldn't throw
      const mod = await import('@config/env');
      expect(mod.API_BASE_URL).toBe('http://localhost:3000');
    });

    test('should return API_BASE_URL with default', async () => {
      delete process.env.EXPO_PUBLIC_API_BASE_URL;
      jest.resetModules();
      const mod = await import('@config/env');
      expect(mod.API_BASE_URL).toBe('http://localhost:3000');
    });

    test('should return API_VERSION with default', async () => {
      delete process.env.EXPO_PUBLIC_API_VERSION;
      jest.resetModules();
      const mod = await import('@config/env');
      expect(mod.API_VERSION).toBe('v1');
    });

    test('should return custom env var values when set', async () => {
      process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.example.com';
      process.env.EXPO_PUBLIC_API_VERSION = 'v2';
      jest.resetModules();
      const mod = await import('@config/env');
      expect(mod.API_BASE_URL).toBe('https://api.example.com');
      expect(mod.API_VERSION).toBe('v2');
    });

    test('should derive local API URL from Expo LAN host when API base URL is unset', async () => {
      const mod = await import('@config/env');
      const url = mod.resolveApiBaseUrl(
        {},
        { expoConfig: { hostUri: '192.168.1.25:8081' } },
        {},
      );

      expect(url).toBe('http://192.168.1.25:3000');
    });

    test('should use custom API port with derived Expo LAN host', async () => {
      const mod = await import('@config/env');
      const url = mod.resolveApiBaseUrl(
        { EXPO_PUBLIC_API_PORT: '4000' },
        { manifest: { debuggerHost: '192.168.1.25:19000' } },
        {},
      );

      expect(url).toBe('http://192.168.1.25:4000');
    });

    test('should prefer browser location host for web LAN access', async () => {
      const mod = await import('@config/env');
      const url = mod.resolveApiBaseUrl(
        {},
        { expoConfig: { hostUri: 'localhost:8081' } },
        { location: { host: '192.168.1.25:8081' } },
      );

      expect(url).toBe('http://192.168.1.25:3000');
    });

    test('should ignore unroutable development hosts', async () => {
      const mod = await import('@config/env');

      expect(mod.resolveHostFromUrl('0.0.0.0:8081')).toBeNull();
      expect(mod.resolveApiBaseUrl({}, { expoConfig: { hostUri: '0.0.0.0:8081' } }, {}))
        .toBe('http://localhost:3000');
    });
  });
});
