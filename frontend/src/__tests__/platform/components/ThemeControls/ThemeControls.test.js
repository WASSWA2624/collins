/**
 * ThemeControls Component Tests
 * File: ThemeControls.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native';
import ThemeControlsWeb from '@platform/components/navigation/ThemeControls/ThemeControls.web';
import ThemeControlsAndroid from '@platform/components/navigation/ThemeControls/ThemeControls.android';
import ThemeControlsIOS from '@platform/components/navigation/ThemeControls/ThemeControls.ios';
import lightTheme from '@theme/light.theme';
import { THEME_MODES } from '@platform/components/navigation/ThemeControls/types';

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

jest.mock('@platform/components', () => ({
  Select: jest.fn(() => null),
}));

jest.mock('@platform/components/navigation/ThemeControls/useThemeControls', () => ({
  __esModule: true,
  default: () => ({
    theme: 'light',
    options: [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' },
      { label: 'High Contrast', value: 'high-contrast' },
    ],
    setTheme: jest.fn(),
  }),
}));

const getMockSelect = () => require('@platform/components').Select;

describe('ThemeControls Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Web variant and wires Select props', () => {
    const Select = getMockSelect();
    render(
      <WebThemeProvider theme={lightTheme}>
        <ThemeControlsWeb testID="web-theme-controls" className="theme-control" />
      </WebThemeProvider>
    );

    expect(Select).toHaveBeenCalled();
    const selectProps = Select.mock.calls[0][0];
    expect(selectProps).toMatchObject({
      label: 'settings.theme.label',
      value: THEME_MODES.LIGHT,
      accessibilityLabel: 'settings.theme.accessibilityLabel',
      accessibilityHint: 'settings.theme.hint',
      testID: 'web-theme-controls-select',
    });
  });

  it('renders Android variant and wires Select props', () => {
    const Select = getMockSelect();
    render(
      <NativeThemeProvider theme={lightTheme}>
        <ThemeControlsAndroid testID="android-theme-controls" />
      </NativeThemeProvider>
    );

    expect(Select).toHaveBeenCalled();
    const selectProps = Select.mock.calls[0][0];
    expect(selectProps).toMatchObject({
      label: 'settings.theme.label',
      value: THEME_MODES.LIGHT,
      accessibilityLabel: 'settings.theme.accessibilityLabel',
      accessibilityHint: 'settings.theme.hint',
      testID: 'android-theme-controls-select',
    });
  });

  it('renders iOS variant and wires Select props', () => {
    const Select = getMockSelect();
    render(
      <NativeThemeProvider theme={lightTheme}>
        <ThemeControlsIOS testID="ios-theme-controls" />
      </NativeThemeProvider>
    );

    expect(Select).toHaveBeenCalled();
    const selectProps = Select.mock.calls[0][0];
    expect(selectProps).toMatchObject({
      label: 'settings.theme.label',
      value: THEME_MODES.LIGHT,
      accessibilityLabel: 'settings.theme.accessibilityLabel',
      accessibilityHint: 'settings.theme.hint',
      testID: 'ios-theme-controls-select',
    });
  });
});
