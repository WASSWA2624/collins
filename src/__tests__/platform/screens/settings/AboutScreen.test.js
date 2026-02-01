/**
 * AboutScreen Component Tests (P011 11.S.14)
 * File: AboutScreen.test.js
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

const AboutScreenAndroid = require('@platform/screens/settings/AboutScreen/AboutScreen.android').default;
const AboutScreenIOS = require('@platform/screens/settings/AboutScreen/AboutScreen.ios').default;
const AboutScreenWeb = require('@platform/screens/settings/AboutScreen/AboutScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('AboutScreen', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'settings.about.screen.label': 'About screen',
      'settings.about.title': 'About',
      'settings.about.appName': 'Ventilation decision support',
      'settings.about.version': 'Version',
      'settings.about.prototypeScope': 'Prototype scope text',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
  });

  it('renders on Android', () => {
    const { getByTestId } = renderWithTheme(<AboutScreenAndroid />);
    expect(getByTestId('about-screen')).toBeTruthy();
    expect(getByTestId('about-title')).toBeTruthy();
    expect(getByTestId('about-content')).toBeTruthy();
  });

  it('renders on iOS', () => {
    const { getByTestId } = renderWithTheme(<AboutScreenIOS />);
    expect(getByTestId('about-screen')).toBeTruthy();
    expect(getByTestId('about-title')).toBeTruthy();
  });

  it('renders on Web', () => {
    const { getByTestId } = renderWithTheme(<AboutScreenWeb />);
    expect(getByTestId('about-screen')).toBeTruthy();
    expect(getByTestId('about-title')).toBeTruthy();
  });
});
