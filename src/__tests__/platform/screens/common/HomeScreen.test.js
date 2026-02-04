/**
 * HomeScreen Component Tests
 * File: HomeScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

const HomeScreenAndroid = require('@platform/screens/common/HomeScreen/HomeScreen.android').default;
const HomeScreenIOS = require('@platform/screens/common/HomeScreen/HomeScreen.ios').default;
const HomeScreenWeb = require('@platform/screens/common/HomeScreen/HomeScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('HomeScreen', () => {
  const mockT = jest.fn((key, opts) => {
    const translations = {
      'home.title': 'Home',
      'home.welcome.title': 'Welcome Home',
      'home.welcome.message': 'Welcome message',
      'home.welcome.logoLabel': 'App logo',
      'home.overview.title': 'Quick access',
      'home.overview.goTo': opts?.name ? `Go to ${opts.name}` : 'Go to {{name}}',
      'home.overview.assessment.description': 'Start a patient assessment.',
      'home.overview.history.description': 'View and resume past sessions.',
      'home.overview.training.description': 'Browse training topics.',
      'navigation.items.main.assessment': 'Admission',
      'navigation.items.main.history': 'Tracking',
      'navigation.items.main.training': 'Training',
    };
    return translations[key] ?? key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
  });

  it('renders on Android', () => {
    const { getByTestId } = renderWithTheme(<HomeScreenAndroid />);
    expect(getByTestId('home-screen')).toBeTruthy();
  });

  it('renders on iOS', () => {
    const { getByTestId } = renderWithTheme(<HomeScreenIOS />);
    expect(getByTestId('home-screen')).toBeTruthy();
  });

  it('renders on Web', () => {
    const { getByTestId } = renderWithTheme(<HomeScreenWeb />);
    expect(getByTestId('home-screen')).toBeTruthy();
  });
});
