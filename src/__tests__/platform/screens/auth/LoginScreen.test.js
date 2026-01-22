/**
 * LoginScreen Component Tests
 * File: LoginScreen.test.js
 *
 * Tests all three platform implementations (Android, iOS, Web)
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const useLoginScreen = require('@platform/screens/auth/LoginScreen/useLoginScreen').default;

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/components', () => {
  const React = require('react');
  const { Pressable, Text, View } = require('react-native');
  const MockStack = ({ children }) => <View>{children}</View>;
  const MockText = ({ testID, children }) => <Text testID={testID}>{children}</Text>;
  const MockTextField = ({ testID, label, value }) => (
    <View testID={testID}>
      <Text>{label}</Text>
      {value !== undefined ? <Text>{value}</Text> : null}
    </View>
  );
  const MockPasswordField = ({ testID, label, value }) => (
    <View testID={testID}>
      <Text>{label}</Text>
      {value !== undefined ? <Text>{value}</Text> : null}
    </View>
  );
  const MockButton = ({ testID, onPress, children }) => (
    <Pressable testID={testID} onPress={onPress}>
      <Text>{children}</Text>
    </Pressable>
  );
  const MockState = ({ testID, children }) => (
    <View testID={testID}>
      {children || null}
    </View>
  );
  const MockAuthFormLayout = ({
    title,
    description,
    status,
    actions,
    footer,
    children,
    testID,
    titleTestID,
    descriptionTestID,
  }) => (
    <View testID={testID} accessibilityLabel={title}>
      {title ? <Text testID={titleTestID}>{title}</Text> : null}
      {description ? <Text testID={descriptionTestID}>{description}</Text> : null}
      {status || null}
      {children}
      {actions || null}
      {footer || null}
    </View>
  );
  return {
    AuthFormLayout: MockAuthFormLayout,
    Button: MockButton,
    ErrorState: MockState,
    OfflineState: MockState,
    Stack: MockStack,
    Text: MockText,
    TextField: MockTextField,
    PasswordField: MockPasswordField,
  };
});

jest.mock('@platform/screens/auth/LoginScreen/useLoginScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const LoginScreenAndroid = require('@platform/screens/auth/LoginScreen/LoginScreen.android').default;
const LoginScreenIOS = require('@platform/screens/auth/LoginScreen/LoginScreen.ios').default;
const LoginScreenWeb = require('@platform/screens/auth/LoginScreen/LoginScreen.web').default;
// eslint-disable-next-line import/no-unresolved
const LoginScreenIndex = require('@platform/screens/auth/LoginScreen/index.js');
// eslint-disable-next-line import/no-unresolved
const { STATES } = require('@platform/screens/auth/LoginScreen/types.js');

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

describe('LoginScreen Component', () => {
  const mockT = jest.fn((key) => key);
  const baseHookReturn = {
    identifier: 'user@example.com',
    password: 'password',
    tenantId: 'tenant',
    facilityId: 'facility',
    errorMessage: null,
    isLoading: false,
    isOffline: false,
    canSubmit: true,
    canAccessRegister: false,
    isBiometricAvailable: false,
    isBiometricChecking: false,
    handleSubmit: jest.fn(),
    handleChangeIdentifier: jest.fn(),
    handleChangePassword: jest.fn(),
    handleChangeTenantId: jest.fn(),
    handleChangeFacilityId: jest.fn(),
    handleGoToRegister: jest.fn(),
    handleGoToForgotPassword: jest.fn(),
    handleBiometricLogin: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useLoginScreen.mockReturnValue(baseHookReturn);
  });

  describe('Android Implementation', () => {
    it('renders screen and form elements', () => {
      const { getByTestId } = renderWithTheme(<LoginScreenAndroid />);
      expect(getByTestId('login-screen')).toBeTruthy();
      expect(getByTestId('login-identifier')).toBeTruthy();
      expect(getByTestId('login-password')).toBeTruthy();
      expect(getByTestId('login-tenant-id')).toBeTruthy();
      expect(getByTestId('login-facility-id')).toBeTruthy();
      expect(getByTestId('login-button')).toBeTruthy();
    });

    it('renders offline state when offline', () => {
      useLoginScreen.mockReturnValue({ ...baseHookReturn, isOffline: true });
      const { getByTestId } = renderWithTheme(<LoginScreenAndroid />);
      expect(getByTestId('login-offline-state')).toBeTruthy();
    });
  });

  describe('iOS Implementation', () => {
    it('renders screen and form elements', () => {
      const { getByTestId } = renderWithTheme(<LoginScreenIOS />);
      expect(getByTestId('login-screen')).toBeTruthy();
      expect(getByTestId('login-identifier')).toBeTruthy();
      expect(getByTestId('login-password')).toBeTruthy();
      expect(getByTestId('login-tenant-id')).toBeTruthy();
      expect(getByTestId('login-facility-id')).toBeTruthy();
      expect(getByTestId('login-button')).toBeTruthy();
    });

    it('renders error state when error is present', () => {
      useLoginScreen.mockReturnValue({ ...baseHookReturn, errorMessage: 'Error' });
      const { getByTestId } = renderWithTheme(<LoginScreenIOS />);
      expect(getByTestId('login-error-state')).toBeTruthy();
    });
  });

  describe('Web Implementation', () => {
    it('renders screen and form elements', () => {
      const { getByTestId } = renderWithTheme(<LoginScreenWeb />);
      expect(getByTestId('login-screen')).toBeTruthy();
      expect(getByTestId('login-identifier')).toBeTruthy();
      expect(getByTestId('login-password')).toBeTruthy();
      expect(getByTestId('login-tenant-id')).toBeTruthy();
      expect(getByTestId('login-facility-id')).toBeTruthy();
      expect(getByTestId('login-button')).toBeTruthy();
    });

    it('renders error state when error is present', () => {
      useLoginScreen.mockReturnValue({ ...baseHookReturn, errorMessage: 'Error' });
      const { getByTestId } = renderWithTheme(<LoginScreenWeb />);
      expect(getByTestId('login-error-state')).toBeTruthy();
    });

    it('invokes submit handler', () => {
      const { getByTestId } = renderWithTheme(<LoginScreenWeb />);
      fireEvent.press(getByTestId('login-button'));
      expect(baseHookReturn.handleSubmit).toHaveBeenCalled();
    });

    it('renders biometric button when available', () => {
      useLoginScreen.mockReturnValue({ ...baseHookReturn, isBiometricAvailable: true });
      const { getByTestId } = renderWithTheme(<LoginScreenWeb />);
      expect(getByTestId('login-biometric')).toBeTruthy();
    });

    it('renders register link when access is allowed', () => {
      useLoginScreen.mockReturnValue({ ...baseHookReturn, canAccessRegister: true });
      const { getByTestId } = renderWithTheme(<LoginScreenWeb />);
      expect(getByTestId('login-register')).toBeTruthy();
    });
  });

  it('exposes index and types for coverage', () => {
    expect(LoginScreenIndex).toBeDefined();
    expect(STATES.DEFAULT).toBeDefined();
  });
});

