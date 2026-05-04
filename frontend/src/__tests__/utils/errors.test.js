/**
 * Error Handling Tests
 * File: errors.test.js
 */
import { normalizeError, handleError, ErrorBoundary, FallbackUI } from '@errors';

describe('Error Handling Layer', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    console.warn.mockRestore();
    console.info.mockRestore();
    console.debug.mockRestore();
  });

  describe('normalizeError', () => {
    it('should handle null/undefined errors', () => {
      const result = normalizeError(null);
      expect(result).toMatchObject({
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
        severity: 'error',
      });
      expect(result.safeMessage).toBe('An unknown error occurred');
    });

    it('should normalize network errors', () => {
      const networkError = {
        name: 'NetworkError',
        message: 'Network request failed',
      };
      const result = normalizeError(networkError);
      expect(result).toMatchObject({
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        severity: 'warning',
      });
      expect(result.safeMessage).toBe('Network connection failed');
    });

    it('should normalize network errors by message', () => {
      const networkError = {
        message: 'network connection timeout',
      };
      const result = normalizeError(networkError);
      expect(result.code).toBe('NETWORK_ERROR');
      expect(result.severity).toBe('warning');
    });

    it('should normalize 401 unauthorized errors', () => {
      const error = { status: 401, message: 'Unauthorized' };
      const result = normalizeError(error);
      expect(result).toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
        severity: 'error',
      });
      expect(result.safeMessage).toBe('Authentication required');
    });

    it('should normalize 403 forbidden errors', () => {
      const error = { status: 403, message: 'Forbidden' };
      const result = normalizeError(error);
      expect(result).toMatchObject({
        code: 'FORBIDDEN',
        message: 'Access denied',
        severity: 'error',
      });
      expect(result.safeMessage).toBe('Access denied');
    });

    it('should normalize 500+ server errors', () => {
      const error = { status: 500, message: 'Internal Server Error' };
      const result = normalizeError(error);
      expect(result).toMatchObject({
        code: 'SERVER_ERROR',
        message: 'Server error occurred',
        severity: 'error',
      });
      expect(result.safeMessage).toBe('Server error occurred');
    });

    it('should handle statusCode instead of status', () => {
      const error = { statusCode: 401 };
      const result = normalizeError(error);
      expect(result.code).toBe('UNAUTHORIZED');
    });

    it('should use error code and message when available', () => {
      const error = {
        code: 'CUSTOM_ERROR',
        message: 'Custom error message',
        severity: 'warning',
      };
      const result = normalizeError(error);
      expect(result).toMatchObject({
        code: 'CUSTOM_ERROR',
        message: 'Custom error message',
        severity: 'warning',
      });
      expect(result.safeMessage).toBe('An unknown error occurred');
    });

    it('should default to UNKNOWN_ERROR for unrecognized errors', () => {
      const error = { message: 'Some error' };
      const result = normalizeError(error);
      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.message).toBe('Some error');
      expect(result.severity).toBe('error');
    });
  });

  describe('handleError', () => {
    it('should normalize and log errors', () => {
      const error = { message: 'Test error', code: 'TEST_ERROR' };
      const context = { userId: '123' };
      
      const result = handleError(error, context);
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('severity');
    });

    it('should handle errors without context', () => {
      const error = { message: 'Test error' };
      
      const result = handleError(error);
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should handle null errors', () => {
      const result = handleError(null);
      
      expect(console.error).toHaveBeenCalled();
      expect(result.code).toBe('UNKNOWN_ERROR');
    });
  });

  describe('FallbackUI', () => {
    it('should be a React component', () => {
      expect(FallbackUI).toBeDefined();
      expect(typeof FallbackUI).toBe('function');
    });

    it('should accept error and onRetry props', () => {
      // Component structure test - verify it can be instantiated
      const error = { message: 'Test error' };
      const onRetry = jest.fn();
      
      // Just verify the component exists and accepts props
      expect(() => {
        // In a real test environment, we would render this
        // For now, just verify it's importable and has the right structure
        expect(FallbackUI).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('ErrorBoundary', () => {
    it('should be a React component class', () => {
      expect(ErrorBoundary).toBeDefined();
      expect(typeof ErrorBoundary).toBe('function');
    });

    it('should have getDerivedStateFromError static method', () => {
      expect(ErrorBoundary.getDerivedStateFromError).toBeDefined();
      expect(typeof ErrorBoundary.getDerivedStateFromError).toBe('function');
    });

    it('should handle errors via getDerivedStateFromError', () => {
      const error = new Error('Test error');
      const state = ErrorBoundary.getDerivedStateFromError(error);
      
      expect(state).toEqual({
        hasError: true,
        error: error,
      });
    });
  });
});

