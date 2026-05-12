/**
 * LoadingOverlay Component Tests
 * File: LoadingOverlay.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native';
import LoadingOverlayWeb from '@platform/components/feedback/LoadingOverlay/LoadingOverlay.web';
import LoadingOverlayAndroid from '@platform/components/feedback/LoadingOverlay/LoadingOverlay.android';
import LoadingOverlayIOS from '@platform/components/feedback/LoadingOverlay/LoadingOverlay.ios';
import lightTheme from '@theme/light.theme';

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

jest.mock('@platform/components', () => ({
  LoadingSpinner: jest.fn(() => null),
}));

describe('LoadingOverlay Component', () => {
  it('does not render on web when hidden', () => {
    const { queryByLabelText } = render(
      <WebThemeProvider theme={lightTheme}>
        <LoadingOverlayWeb visible={false} />
      </WebThemeProvider>
    );

    expect(queryByLabelText('common.loading')).toBeNull();
  });

  it('renders Android overlay with default title', () => {
    const { getByText } = render(
      <NativeThemeProvider theme={lightTheme}>
        <LoadingOverlayAndroid visible />
      </NativeThemeProvider>
    );

    expect(getByText('shell.loadingOverlay.title')).toBeTruthy();
  });

  it('renders iOS overlay with custom message', () => {
    const { getByText } = render(
      <NativeThemeProvider theme={lightTheme}>
        <LoadingOverlayIOS visible message="Loading data" />
      </NativeThemeProvider>
    );

    expect(getByText('Loading data')).toBeTruthy();
  });
});
