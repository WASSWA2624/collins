/**
 * Application Constants Tests
 * File: constants.test.js
 */
import { PAGINATION, TIMEOUTS } from '@config/constants';

describe('constants.js', () => {
  test('should export PAGINATION constants', () => {
    expect(PAGINATION).toBeDefined();
    expect(PAGINATION.DEFAULT_PAGE).toBe(1);
    expect(PAGINATION.DEFAULT_LIMIT).toBe(20);
    expect(PAGINATION.MAX_LIMIT).toBe(100);
  });

  test('should export TIMEOUTS constants', () => {
    expect(TIMEOUTS).toBeDefined();
    expect(TIMEOUTS.API_REQUEST).toBe(30000);
    expect(TIMEOUTS.NETWORK_CHECK).toBe(5000);
  });

  test('should have correct constant values', () => {
    expect(typeof PAGINATION.DEFAULT_PAGE).toBe('number');
    expect(typeof PAGINATION.DEFAULT_LIMIT).toBe('number');
    expect(typeof PAGINATION.MAX_LIMIT).toBe('number');
    expect(typeof TIMEOUTS.API_REQUEST).toBe('number');
    expect(typeof TIMEOUTS.NETWORK_CHECK).toBe('number');
  });
});

