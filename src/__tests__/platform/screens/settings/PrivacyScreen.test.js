/**
 * PrivacyScreen Component Tests (P011 11.S.13)
 * File: PrivacyScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({ useI18n: jest.fn() }));

jest.mock('@platform/components', () => {
  const RN = require('react-native');
  return {
    Text: ({ children, testID }) => React.createElement(RN.Text, { testID }, children),
    Stack: ({ children }) => React.createElement(RN.View, null, children),
  };
});

const PrivacyScreenAndroid = require('@platform/screens/settings/PrivacyScreen/PrivacyScreen.android').default;
const PrivacyScreenIOS = require('@platform/screens/settings/PrivacyScreen/PrivacyScreen.ios').default;
const PrivacyScreenWeb = require('@platform/screens/settings/PrivacyScreen/PrivacyScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('PrivacyScreen', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'settings.privacy.screen.label': 'Privacy screen',
      'settings.privacy.title': 'Privacy',
      'settings.privacy.localStorage': 'Data stored locally',
      'settings.privacy.localStorageDescription': 'Local-only description',
      'settings.privacy.optionalAI': 'Optional AI behavior',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
  });

  it('renders on Android', () => {
    const { getByTestId } = renderWithTheme(<PrivacyScreenAndroid />);
    expect(getByTestId('privacy-screen')).toBeTruthy();
    expect(getByTestId('privacy-title')).toBeTruthy();
    expect(getByTestId('privacy-content')).toBeTruthy();
  });

  it('renders on iOS', () => {
    const { getByTestId } = renderWithTheme(<PrivacyScreenIOS />);
    expect(getByTestId('privacy-screen')).toBeTruthy();
    expect(getByTestId('privacy-title')).toBeTruthy();
  });

  it('renders on Web', () => {
    const { getByTestId } = renderWithTheme(<PrivacyScreenWeb />);
    expect(getByTestId('privacy-screen')).toBeTruthy();
    expect(getByTestId('privacy-title')).toBeTruthy();
  });
});
