/**
 * LanguageControls Component Tests
 * File: LanguageControls.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native';
import LanguageControlsWeb from '@platform/components/navigation/LanguageControls/LanguageControls.web';
import LanguageControlsAndroid from '@platform/components/navigation/LanguageControls/LanguageControls.android';
import LanguageControlsIOS from '@platform/components/navigation/LanguageControls/LanguageControls.ios';
import lightTheme from '@theme/light.theme';

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

jest.mock('@platform/components', () => ({
  Select: jest.fn(() => null),
}));

jest.mock('@platform/components/navigation/LanguageControls/useLanguageControls', () => ({
  __esModule: true,
  default: () => ({
    locale: 'en',
    options: [{ label: 'English', value: 'en' }],
    setLocale: jest.fn(),
  }),
}));

const getMockSelect = () => require('@platform/components').Select;

describe('LanguageControls Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Web variant and wires Select props', () => {
    const Select = getMockSelect();
    render(
      <WebThemeProvider theme={lightTheme}>
        <LanguageControlsWeb testID="web-language-controls" className="language-control" />
      </WebThemeProvider>
    );

    expect(Select).toHaveBeenCalled();
    const selectProps = Select.mock.calls[0][0];
    expect(selectProps).toMatchObject({
      label: 'settings.language.label',
      value: 'en',
      accessibilityLabel: 'settings.language.accessibilityLabel',
      accessibilityHint: 'settings.language.hint',
      testID: 'web-language-controls-select',
    });
  });

  it('renders Android variant and wires Select props', () => {
    const Select = getMockSelect();
    render(
      <NativeThemeProvider theme={lightTheme}>
        <LanguageControlsAndroid testID="android-language-controls" />
      </NativeThemeProvider>
    );

    expect(Select).toHaveBeenCalled();
    const selectProps = Select.mock.calls[0][0];
    expect(selectProps).toMatchObject({
      label: 'settings.language.label',
      value: 'en',
      accessibilityLabel: 'settings.language.accessibilityLabel',
      accessibilityHint: 'settings.language.hint',
      testID: 'android-language-controls-select',
    });
  });

  it('renders iOS variant and wires Select props', () => {
    const Select = getMockSelect();
    render(
      <NativeThemeProvider theme={lightTheme}>
        <LanguageControlsIOS testID="ios-language-controls" />
      </NativeThemeProvider>
    );

    expect(Select).toHaveBeenCalled();
    const selectProps = Select.mock.calls[0][0];
    expect(selectProps).toMatchObject({
      label: 'settings.language.label',
      value: 'en',
      accessibilityLabel: 'settings.language.accessibilityLabel',
      accessibilityHint: 'settings.language.hint',
      testID: 'ios-language-controls-select',
    });
  });
});
