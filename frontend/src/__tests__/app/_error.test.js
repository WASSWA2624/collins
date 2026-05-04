/**
 * Error Route Tests
 * File: _error.test.js
 * 
 * Tests the generic error route
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { ErrorScreen } = require('@platform/screens');

jest.mock('@platform/screens', () => ({
  ErrorScreen: jest.fn(() => null),
}));

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Error Route (_error.jsx)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    const ErrorRoute = require('../../app/_error').default;
    renderWithTheme(<ErrorRoute />);
    expect(ErrorScreen).toHaveBeenCalled();
  });

  it('should render ErrorScreen component', () => {
    const ErrorRoute = require('../../app/_error').default;
    renderWithTheme(<ErrorRoute />);
    expect(ErrorScreen).toHaveBeenCalledTimes(1);
  });

  it('should use default export', () => {
    const ErrorRoute = require('../../app/_error');
    expect(ErrorRoute.default).toBeDefined();
    expect(typeof ErrorRoute.default).toBe('function');
  });
});

