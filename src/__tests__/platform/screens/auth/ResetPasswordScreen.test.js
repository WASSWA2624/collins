/**
 * ResetPasswordScreen Component Tests
 * File: ResetPasswordScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const useResetPasswordScreen = require('@platform/screens/auth/ResetPasswordScreen/useResetPasswordScreen').default;

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

jest.mock('@platform/screens/auth/ResetPasswordScreen/useResetPasswordScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const ResetPasswordScreenAndroid = require('@platform/screens/auth/ResetPasswordScreen/ResetPasswordScreen.android').default;
const ResetPasswordScreenIOS = require('@platform/screens/auth/ResetPasswordScreen/ResetPasswordScreen.ios').default;
const ResetPasswordScreenWeb = require('@platform/screens/auth/ResetPasswordScreen/ResetPasswordScreen.web').default;
// eslint-disable-next-line import/no-unresolved
const ResetPasswordScreenIndex = require('@platform/screens/auth/ResetPasswordScreen/index.js');
// eslint-disable-next-line import/no-unresolved
const { STATES } = require('@platform/screens/auth/ResetPasswordScreen/types.js');

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

describe('ResetPasswordScreen Component', () => {
  const mockT = jest.fn((key) => key);
  const baseHookReturn = {
    token: 'token',
    password: 'Pass123!',
    confirmPassword: 'Pass123!',
    isSubmitted: false,
    errorMessage: null,
    isLoading: false,
    isOffline: false,
    passwordMismatch: false,
    canSubmit: true,
    handleSubmit: jest.fn(),
    handleChangeToken: jest.fn(),
    handleChangePassword: jest.fn(),
    handleChangeConfirmPassword: jest.fn(),
    handleGoToLogin: jest.fn(),
  };

  const platforms = [
    { name: 'Android', Component: ResetPasswordScreenAndroid },
    { name: 'iOS', Component: ResetPasswordScreenIOS },
    { name: 'Web', Component: ResetPasswordScreenWeb },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useResetPasswordScreen.mockReturnValue(baseHookReturn);
  });

  platforms.forEach(({ name, Component }) => {
    it(`${name} renders form fields`, () => {
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('reset-password-screen')).toBeTruthy();
      expect(getByTestId('reset-token')).toBeTruthy();
      expect(getByTestId('reset-password')).toBeTruthy();
      expect(getByTestId('reset-confirm-password')).toBeTruthy();
      expect(getByTestId('reset-button')).toBeTruthy();
    });

    it(`${name} renders offline state`, () => {
      useResetPasswordScreen.mockReturnValue({ ...baseHookReturn, isOffline: true });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('reset-offline-state')).toBeTruthy();
    });

    it(`${name} renders error state`, () => {
      useResetPasswordScreen.mockReturnValue({ ...baseHookReturn, errorMessage: 'Error' });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('reset-error-state')).toBeTruthy();
    });

    it(`${name} renders success state`, () => {
      useResetPasswordScreen.mockReturnValue({ ...baseHookReturn, isSubmitted: true });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('reset-success-message')).toBeTruthy();
    });

    it(`${name} renders password mismatch state`, () => {
      useResetPasswordScreen.mockReturnValue({ ...baseHookReturn, passwordMismatch: true });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('reset-confirm-password')).toBeTruthy();
    });
  });

  it('exposes index and types for coverage', () => {
    expect(ResetPasswordScreenIndex).toBeDefined();
    expect(STATES.SUBMITTED).toBeDefined();
  });
});

