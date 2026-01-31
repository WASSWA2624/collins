/**
 * LandingScreen Component Tests
 * File: LandingScreen.test.js
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const { useRouter } = require('expo-router');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const LandingScreenAndroid = require('@platform/screens/common/LandingScreen/LandingScreen.android').default;
const LandingScreenIOS = require('@platform/screens/common/LandingScreen/LandingScreen.ios').default;
const LandingScreenWeb = require('@platform/screens/common/LandingScreen/LandingScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('LandingScreen', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'landing.title': 'Welcome',
      'landing.hero.title': 'Landing page',
      'landing.hero.description': 'Landing description',
      'landing.cta.getStarted': 'Get Started',
      'landing.cta.getStartedHint': 'Navigate to assessment',
    };
    return translations[key] || key;
  });

  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useRouter.mockReturnValue(mockRouter);
  });

  it('renders on Android', () => {
    const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
    expect(getByTestId('landing-screen')).toBeTruthy();
  });

  it('renders on iOS', () => {
    const { getByTestId } = renderWithTheme(<LandingScreenIOS />);
    expect(getByTestId('landing-screen')).toBeTruthy();
  });

  it('renders on Web', () => {
    const { getByTestId } = renderWithTheme(<LandingScreenWeb />);
    expect(getByTestId('landing-screen')).toBeTruthy();
  });

  it('navigates to /assessment when Get Started pressed (Android)', () => {
    const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
    fireEvent.press(getByTestId('landing-get-started'));
    expect(mockRouter.push).toHaveBeenCalledWith('/assessment');
  });
});

