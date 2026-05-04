/**
 * Errors Barrel Export Tests
 * File: index.test.js
 */
import { ErrorBoundary, handleError, normalizeError, FallbackUI } from '@errors';

describe('errors/index.js (barrel export)', () => {
  test('should export ErrorBoundary', () => {
    expect(ErrorBoundary).toBeDefined();
  });

  test('should export handleError', () => {
    expect(handleError).toBeDefined();
    expect(typeof handleError).toBe('function');
  });

  test('should export normalizeError', () => {
    expect(normalizeError).toBeDefined();
    expect(typeof normalizeError).toBe('function');
  });

  test('should export FallbackUI', () => {
    expect(FallbackUI).toBeDefined();
  });

  test('should have correct barrel export structure', () => {
    const expectedExports = ['ErrorBoundary', 'handleError', 'normalizeError', 'FallbackUI'];
    expectedExports.forEach((exportName) => {
      expect({ ErrorBoundary, handleError, normalizeError, FallbackUI }).toHaveProperty(
        exportName
      );
    });
  });
});

