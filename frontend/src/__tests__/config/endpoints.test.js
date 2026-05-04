/**
 * API Endpoints Registry Tests
 * File: endpoints.test.js
 */
import { endpoints } from '@config/endpoints';

describe('endpoints.js', () => {
  test('should export endpoints object', () => {
    expect(endpoints).toBeDefined();
    expect(typeof endpoints).toBe('object');
  });

  test('should have AUTH endpoints', () => {
    expect(endpoints.AUTH).toBeDefined();
    expect(endpoints.AUTH.LOGIN).toBeDefined();
    expect(endpoints.AUTH.REGISTER).toBeDefined();
    expect(endpoints.AUTH.REFRESH).toBeDefined();
    expect(endpoints.AUTH.LOGOUT).toBeDefined();
  });

  test('should construct endpoints with base URL and version', () => {
    expect(endpoints.AUTH.LOGIN).toContain('/api/');
    expect(endpoints.AUTH.LOGIN).toContain('/auth/login');
  });

  test('should normalize base URL (remove trailing slashes)', () => {
    // The base URL normalization should be tested via the endpoint construction
    // If base URL has trailing slash, it should be removed
    expect(endpoints.AUTH.LOGIN).not.toMatch(/\/\/api\//);
  });

  test('should have correct endpoint paths', () => {
    expect(endpoints.AUTH.LOGIN).toMatch(/\/auth\/login$/);
    expect(endpoints.AUTH.REGISTER).toMatch(/\/auth\/register$/);
  });
});

