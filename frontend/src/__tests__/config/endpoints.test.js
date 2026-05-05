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

  test('should have settings endpoint paths', () => {
    expect(endpoints.SETTINGS.ME).toMatch(/\/settings\/me$/);
    expect(endpoints.SETTINGS.FACILITY('facility-1')).toMatch(/\/settings\/facilities\/facility-1$/);
  });

  test('should have Tracking endpoint paths', () => {
    expect(endpoints.TRACKING.LIST).toMatch(/\/tracking$/);
    expect(endpoints.TRACKING.GET('adm-1')).toMatch(/\/tracking\/adm-1$/);
    expect(endpoints.TRACKING.TIMELINE('adm-1')).toMatch(/\/tracking\/adm-1\/timeline$/);
  });
});
