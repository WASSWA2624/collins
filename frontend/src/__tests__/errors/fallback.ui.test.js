/**
 * Fallback UI Component Tests
 * File: fallback.ui.test.js
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FallbackUI from '@errors/fallback.ui';
import { ThemeProvider } from 'styled-components/native';
import { getTheme } from '@theme';

describe('errors/fallback.ui.jsx', () => {
  const theme = getTheme('light');

  const renderWithTheme = (component) => {
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
  };

  test('should render component', () => {
    const { getByText } = renderWithTheme(<FallbackUI />);
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  test('should display error message', () => {
    const error = { safeMessage: 'Custom error message' };
    const { getByText } = renderWithTheme(<FallbackUI error={error} />);
    expect(getByText('Custom error message')).toBeTruthy();
  });

  test('should display default message when no error', () => {
    const { getByText } = renderWithTheme(<FallbackUI />);
    expect(getByText('An unexpected error occurred')).toBeTruthy();
  });

  test('should render retry button when onRetry provided', () => {
    const onRetry = jest.fn();
    const { getByText } = renderWithTheme(<FallbackUI onRetry={onRetry} />);
    const retryButton = getByText('Retry');
    expect(retryButton).toBeTruthy();
  });

  test('should not render retry button when onRetry not provided', () => {
    const { queryByText } = renderWithTheme(<FallbackUI />);
    expect(queryByText('Retry')).toBeNull();
  });

  test('should call onRetry when retry button pressed', () => {
    const onRetry = jest.fn();
    const { getByLabelText } = renderWithTheme(<FallbackUI onRetry={onRetry} />);
    const retryButton = getByLabelText('Retry');
    fireEvent.press(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  test('should use i18n text', () => {
    const { getByText } = renderWithTheme(<FallbackUI />);
    // These should come from en.json
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('An unexpected error occurred')).toBeTruthy();
  });
});

