/**
 * Config Layer Tests
 * File: config.test.js
 */

describe('Config Layer', () => {
  const originalEnv = process.env;

  const loadConfig = async () => {
    const mod = await import('@config');
    return mod;
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('env.js', () => {
    test('should return default values when env vars are not set', async () => {
      delete process.env.NODE_ENV;
      delete process.env.EXPO_PUBLIC_API_BASE_URL;
      delete process.env.EXPO_PUBLIC_API_VERSION;

      jest.resetModules();
      const config = await loadConfig();

      expect(config.NODE_ENV).toBe('development');
      expect(config.API_BASE_URL).toBe('http://localhost:3000');
      expect(config.API_VERSION).toBe('v1');
    });

    test('should return env var values when set', async () => {
      process.env.NODE_ENV = 'production';
      process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.example.com';
      process.env.EXPO_PUBLIC_API_VERSION = 'v2';

      jest.resetModules();
      const config = await loadConfig();

      expect(config.NODE_ENV).toBe('production');
      expect(config.API_BASE_URL).toBe('https://api.example.com');
      expect(config.API_VERSION).toBe('v2');
    });
  });

  describe('constants.js', () => {
    test('should export pagination constants', async () => {
      const config = await loadConfig();

      expect(config.PAGINATION).toBeDefined();
      expect(config.PAGINATION.DEFAULT_PAGE).toBe(1);
      expect(config.PAGINATION.DEFAULT_LIMIT).toBe(20);
      expect(config.PAGINATION.MAX_LIMIT).toBe(100);
    });

    test('should export timeout constants', async () => {
      const config = await loadConfig();

      expect(config.TIMEOUTS).toBeDefined();
      expect(config.TIMEOUTS.API_REQUEST).toBe(30000);
      expect(config.TIMEOUTS.NETWORK_CHECK).toBe(5000);
    });
  });

  describe('endpoints.js', () => {
    test('should construct endpoints correctly', async () => {
      process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.example.com';
      process.env.EXPO_PUBLIC_API_VERSION = 'v1';

      jest.resetModules();
      const config = await loadConfig();

      expect(config.endpoints.AUTH.LOGIN).toBe(
        'https://api.example.com/api/v1/auth/login'
      );
      expect(config.endpoints.AUTH.REGISTER).toBe(
        'https://api.example.com/api/v1/auth/register'
      );
    });

    test('should normalize base URL when it contains a trailing slash', async () => {
      process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.example.com/';
      process.env.EXPO_PUBLIC_API_VERSION = 'v1';

      jest.resetModules();
      const config = await loadConfig();

      expect(config.endpoints.AUTH.LOGIN).toBe(
        'https://api.example.com/api/v1/auth/login'
      );
    });
  });

  describe('feature.flags.js', () => {
    test('should export feature flags namespace', async () => {
      const config = await loadConfig();

      expect(config.featureFlags).toBeDefined();
      expect(config.featureFlags.OFFLINE_MODE).toBe(true);
      expect(config.featureFlags.ANALYTICS_ENABLED).toBe(false);
    });
  });

  describe('index.js (barrel export)', () => {
    test('should export all config modules', async () => {
      const config = await loadConfig();

      expect(config.NODE_ENV).toBeDefined();
      expect(config.API_BASE_URL).toBeDefined();
      expect(config.API_VERSION).toBeDefined();

      expect(config.PAGINATION).toBeDefined();
      expect(config.TIMEOUTS).toBeDefined();

      expect(config.endpoints).toBeDefined();
      expect(config.endpoints.AUTH).toBeDefined();

      expect(config.featureFlags).toBeDefined();
    });
  });
});


