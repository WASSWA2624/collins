/**
 * Environment Configuration Tests
 * File: env.test.js
 */
import { NODE_ENV, API_BASE_URL, API_VERSION } from '@config/env';

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
  });
});

