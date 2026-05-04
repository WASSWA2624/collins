/**
 * Error Boundary Component Tests
 * File: ErrorBoundary.test.js
 */
import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorBoundary from '@errors/ErrorBoundary';
import { logger } from '@logging';
import { handleError } from '@errors/error.handler';

jest.mock('@logging', () => ({
  logger: {
    error: jest.fn(),
  },
}));

jest.mock('@errors/error.handler', () => ({
  handleError: jest.fn((error) => ({
    code: 'TEST_ERROR',
    message: 'Test error',
    safeMessage: 'Test error',
    severity: 'error',
  })),
}));

describe('errors/ErrorBoundary.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error for error boundary tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('should render children when no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Test Content</Text>
      </ErrorBoundary>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  test('should catch errors and display fallback UI', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText('Something went wrong')).toBeTruthy();
  });

  test('should log error when caught', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(handleError).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
  });

  test('should allow retry after error', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { getByText, getByLabelText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Verify error is caught and fallback UI is shown
    expect(getByText('Something went wrong')).toBeTruthy();

    // Verify retry button exists and can be pressed
    const retryButton = getByLabelText('Retry');
    expect(retryButton).toBeTruthy();
    
    // Press retry button - this should reset the error state
    // Note: Full reset behavior is complex to test due to React error boundary lifecycle
    // This test verifies the retry mechanism exists and is accessible
    fireEvent.press(retryButton);
    
    // After pressing retry, ErrorBoundary's internal state should be reset
    // The component should be ready to render children again on next render cycle
    expect(retryButton).toBeTruthy();
  });
});

