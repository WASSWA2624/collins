/**
 * NotFound Route Tests
 * File: +not-found.test.js
 * 
 * Tests the 404 not found route
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { NotFoundScreen } = require('@platform/screens');

// Mock expo-router (per Step 8.6 requirements)
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => false),
  }),
  usePathname: () => '/unknown-route',
  useSegments: () => [],
}));

jest.mock('@platform/screens', () => ({
  NotFoundScreen: jest.fn(() => null),
}));

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('NotFound Route (+not-found.jsx)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    const NotFoundRoute = require('../../app/+not-found').default;
    renderWithTheme(<NotFoundRoute />);
    expect(NotFoundScreen).toHaveBeenCalled();
  });

  it('should render NotFoundScreen component', () => {
    const NotFoundRoute = require('../../app/+not-found').default;
    renderWithTheme(<NotFoundRoute />);
    expect(NotFoundScreen).toHaveBeenCalledTimes(1);
  });

  it('should use default export', () => {
    const NotFoundRoute = require('../../app/+not-found');
    expect(NotFoundRoute.default).toBeDefined();
    expect(typeof NotFoundRoute.default).toBe('function');
  });
});

