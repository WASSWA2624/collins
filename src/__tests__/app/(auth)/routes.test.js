/**
 * Auth Routes Tests
 * File: routes.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  VerifyEmailScreen,
  VerifyPhoneScreen,
} = require('@platform/screens');

jest.mock('@platform/screens', () => ({
  LoginScreen: jest.fn(() => null),
  RegisterScreen: jest.fn(() => null),
  ForgotPasswordScreen: jest.fn(() => null),
  ResetPasswordScreen: jest.fn(() => null),
  VerifyEmailScreen: jest.fn(() => null),
  VerifyPhoneScreen: jest.fn(() => null),
}));

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login route', () => {
    const LoginRoute = require('../../../app/(auth)/login').default;
    renderWithTheme(<LoginRoute />);
    expect(LoginScreen).toHaveBeenCalled();
  });

  it('renders register route', () => {
    const RegisterRoute = require('../../../app/(auth)/register').default;
    renderWithTheme(<RegisterRoute />);
    expect(RegisterScreen).toHaveBeenCalled();
  });

  it('renders forgot password route', () => {
    const ForgotRoute = require('../../../app/(auth)/forgot-password').default;
    renderWithTheme(<ForgotRoute />);
    expect(ForgotPasswordScreen).toHaveBeenCalled();
  });

  it('renders reset password route', () => {
    const ResetRoute = require('../../../app/(auth)/reset-password').default;
    renderWithTheme(<ResetRoute />);
    expect(ResetPasswordScreen).toHaveBeenCalled();
  });

  it('renders verify email route', () => {
    const VerifyEmailRoute = require('../../../app/(auth)/verify-email').default;
    renderWithTheme(<VerifyEmailRoute />);
    expect(VerifyEmailScreen).toHaveBeenCalled();
  });

  it('renders verify phone route', () => {
    const VerifyPhoneRoute = require('../../../app/(auth)/verify-phone').default;
    renderWithTheme(<VerifyPhoneRoute />);
    expect(VerifyPhoneScreen).toHaveBeenCalled();
  });
});

