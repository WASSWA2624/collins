/**
 * SettingsScreen Component Tests
 * File: SettingsScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const { useDispatch, useSelector } = require('react-redux');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@services/storage', () => ({
  async: {
    setItem: jest.fn(),
  },
}));

jest.mock('@platform/components', () => {
  const RN = require('react-native');
  return {
    Text: RN.Text,
    Select: ({ testID }) => React.createElement(RN.View, { testID }),
    Stack: ({ children }) => React.createElement(RN.View, null, children),
    ThemeControls: ({ testID }) => React.createElement(RN.View, { testID }),
    LanguageControls: ({ testID }) => React.createElement(RN.View, { testID }),
  };
});

const SettingsScreenAndroid = require('@platform/screens/settings/SettingsScreen/SettingsScreen.android').default;
const SettingsScreenIOS = require('@platform/screens/settings/SettingsScreen/SettingsScreen.ios').default;
const SettingsScreenWeb = require('@platform/screens/settings/SettingsScreen/SettingsScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('SettingsScreen', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'settings.title': 'Settings',
      'settings.screen.label': 'Settings screen',
      'settings.theme.label': 'Theme',
      'settings.theme.accessibilityLabel': 'Theme selector',
      'settings.theme.hint': 'Change the application theme',
      'settings.density.label': 'Density',
      'settings.density.accessibilityLabel': 'Density mode selector',
      'settings.density.hint': 'Change the spacing and layout density',
      'settings.density.options.compact': 'Compact',
      'settings.density.options.comfortable': 'Comfortable',
      'settings.language.label': 'Language',
      'settings.language.accessibilityLabel': 'Language selector',
      'settings.language.hint': 'Change the application language',
    };
    return translations[key] || key;
  });

  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => {
      const mockState = {
        ui: {
          density: 'comfortable',
        },
      };
      return selector(mockState);
    });
  });

  it('renders on Android', () => {
    const { getByTestId } = renderWithTheme(<SettingsScreenAndroid />);
    expect(getByTestId('settings-screen')).toBeTruthy();
    expect(getByTestId('settings-title')).toBeTruthy();
    expect(getByTestId('settings-theme-section')).toBeTruthy();
    expect(getByTestId('settings-density-section')).toBeTruthy();
    expect(getByTestId('settings-language-section')).toBeTruthy();
  });

  it('renders on iOS', () => {
    const { getByTestId } = renderWithTheme(<SettingsScreenIOS />);
    expect(getByTestId('settings-screen')).toBeTruthy();
    expect(getByTestId('settings-title')).toBeTruthy();
    expect(getByTestId('settings-theme-section')).toBeTruthy();
    expect(getByTestId('settings-density-section')).toBeTruthy();
    expect(getByTestId('settings-language-section')).toBeTruthy();
  });

  it('renders on Web', () => {
    const { getByTestId } = renderWithTheme(<SettingsScreenWeb />);
    expect(getByTestId('settings-screen')).toBeTruthy();
    expect(getByTestId('settings-title')).toBeTruthy();
    expect(getByTestId('settings-theme-section')).toBeTruthy();
    expect(getByTestId('settings-density-section')).toBeTruthy();
    expect(getByTestId('settings-language-section')).toBeTruthy();
  });
});
