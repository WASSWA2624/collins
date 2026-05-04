/**
 * Error Handler Tests
 * File: error.handler.test.js
 */
import { normalizeError, handleError } from '@errors/error.handler';
import { logger } from '@logging';

jest.mock('@logging', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('errors/error.handler.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('normalizeError', () => {
    test('should normalize null error', () => {
      const normalized = normalizeError(null);
      expect(normalized).toHaveProperty('code');
      expect(normalized).toHaveProperty('message');
      expect(normalized).toHaveProperty('safeMessage');
      expect(normalized).toHaveProperty('severity');
      expect(normalized.code).toBe('UNKNOWN_ERROR');
    });

    test('should normalize undefined error', () => {
      const normalized = normalizeError(undefined);
      expect(normalized.code).toBe('UNKNOWN_ERROR');
    });

    test('should normalize network errors', () => {
      const networkError = { name: 'NetworkError' };
      const normalized = normalizeError(networkError);
      expect(normalized.code).toBe('NETWORK_ERROR');
      expect(normalized.severity).toBe('warning');
    });

    test('should normalize 401 unauthorized errors', () => {
      const authError = { status: 401 };
      const normalized = normalizeError(authError);
      expect(normalized.code).toBe('UNAUTHORIZED');
      expect(normalized.severity).toBe('error');
    });

    test('should normalize 403 forbidden errors', () => {
      const forbiddenError = { status: 403 };
      const normalized = normalizeError(forbiddenError);
      expect(normalized.code).toBe('FORBIDDEN');
      expect(normalized.severity).toBe('error');
    });

    test('should normalize 500+ server errors', () => {
      const serverError = { status: 500 };
      const normalized = normalizeError(serverError);
      expect(normalized.code).toBe('SERVER_ERROR');
      expect(normalized.severity).toBe('error');
    });

    test('should normalize errors with statusCode', () => {
      const error = { statusCode: 401 };
      const normalized = normalizeError(error);
      expect(normalized.code).toBe('UNAUTHORIZED');
    });

    test('should normalize errors with code', () => {
      const error = { code: 'CUSTOM_ERROR', message: 'Custom error message' };
      const normalized = normalizeError(error);
      expect(normalized.code).toBe('CUSTOM_ERROR');
      expect(normalized.message).toBe('Custom error message');
    });

    test('should use safeMessage from i18n', () => {
      const error = { code: 'NETWORK_ERROR' };
      const normalized = normalizeError(error);
      expect(normalized.safeMessage).toBeTruthy();
      expect(typeof normalized.safeMessage).toBe('string');
    });
  });

  describe('handleError', () => {
    test('should handle error and log it', () => {
      const error = { code: 'TEST_ERROR', message: 'Test error' };
      const normalized = handleError(error, { context: 'test' });
      expect(logger.error).toHaveBeenCalled();
      expect(normalized).toHaveProperty('code');
    });

    test('should include context in log', () => {
      const error = { code: 'TEST_ERROR' };
      handleError(error, { context: 'test' });
      expect(logger.error).toHaveBeenCalledWith(
        'Handled error',
        expect.objectContaining({
          context: { context: 'test' },
        })
      );
    });

    test('should handle invalid context gracefully', () => {
      const error = { code: 'TEST_ERROR' };
      const normalized = handleError(error, 'invalid context');
      expect(normalized).toBeDefined();
      expect(logger.error).toHaveBeenCalled();
    });
  });
});

