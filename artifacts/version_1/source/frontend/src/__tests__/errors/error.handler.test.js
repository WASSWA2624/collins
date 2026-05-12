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

    test('should normalize React Native fetch connection errors', () => {
      const networkError = new Error('Network request failed');
      const normalized = normalizeError(networkError);
      expect(normalized.code).toBe('NETWORK_ERROR');
      expect(normalized.severity).toBe('warning');
    });

    test('should normalize request timeouts', () => {
      const timeoutError = new Error('Request timeout');
      const normalized = normalizeError(timeoutError);
      expect(normalized.code).toBe('REQUEST_TIMEOUT');
      expect(normalized.severity).toBe('warning');
    });

    test('should normalize 401 unauthorized errors', () => {
      const authError = { status: 401 };
      const normalized = normalizeError(authError);
      expect(normalized.code).toBe('UNAUTHORIZED');
      expect(normalized.severity).toBe('error');
    });

    test('should normalize invalid sign-in credentials from backend message', () => {
      const authError = { status: 401, message: 'Invalid email or password' };
      const normalized = normalizeError(authError);
      expect(normalized.code).toBe('INVALID_CREDENTIALS');
      expect(normalized.safeMessage).toContain('Invalid email or password');
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

    test('should normalize gateway and unavailable backend errors', () => {
      const serverError = { status: 503 };
      const normalized = normalizeError(serverError);
      expect(normalized.code).toBe('BACKEND_UNAVAILABLE');
      expect(normalized.severity).toBe('error');
    });

    test('should normalize missing backend API routes', () => {
      const notFoundError = {
        status: 404,
        statusText: 'Not Found',
        message: 'Cannot POST /api/v1/missing-route',
      };
      const normalized = normalizeError(notFoundError);
      expect(normalized.code).toBe('BACKEND_ENDPOINT_NOT_FOUND');
      expect(normalized.severity).toBe('error');
    });

    test('should normalize missing admission records without reporting an undeployed route', () => {
      const notFoundError = {
        status: 404,
        statusText: 'Not Found',
        message: 'Admission not found',
      };
      const normalized = normalizeError(notFoundError);
      expect(normalized.code).toBe('ADMISSION_NOT_FOUND');
      expect(normalized.safeMessage).toContain('admission record');
    });

    test('should normalize invalid backend responses', () => {
      const invalidResponse = { code: 'BACKEND_INVALID_RESPONSE', message: 'Invalid login response' };
      const normalized = normalizeError(invalidResponse);
      expect(normalized.code).toBe('BACKEND_INVALID_RESPONSE');
      expect(normalized.safeMessage).toContain('invalid sign-in response');
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
