/**
 * ForgotPasswordScreen Component Tests
 * File: ForgotPasswordScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const useForgotPasswordScreen = require('@platform/screens/auth/ForgotPasswordScreen/useForgotPasswordScreen').default;

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

jest.mock('@platform/screens/auth/ForgotPasswordScreen/useForgotPasswordScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const ForgotPasswordScreenAndroid = require('@platform/screens/auth/ForgotPasswordScreen/ForgotPasswordScreen.android').default;
const ForgotPasswordScreenIOS = require('@platform/screens/auth/ForgotPasswordScreen/ForgotPasswordScreen.ios').default;
const ForgotPasswordScreenWeb = require('@platform/screens/auth/ForgotPasswordScreen/ForgotPasswordScreen.web').default;
// eslint-disable-next-line import/no-unresolved
const ForgotPasswordScreenIndex = require('@platform/screens/auth/ForgotPasswordScreen/index.js');
// eslint-disable-next-line import/no-unresolved
const { STATES } = require('@platform/screens/auth/ForgotPasswordScreen/types.js');

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

describe('ForgotPasswordScreen Component', () => {
  const mockT = jest.fn((key) => key);
  const baseHookReturn = {
    email: 'user@example.com',
    tenantId: 'tenant',
    isSubmitted: false,
    errorMessage: null,
    isLoading: false,
    isOffline: false,
    canSubmit: true,
    handleSubmit: jest.fn(),
    handleChangeEmail: jest.fn(),
    handleChangeTenantId: jest.fn(),
    handleGoToLogin: jest.fn(),
  };

  const platforms = [
    { name: 'Android', Component: ForgotPasswordScreenAndroid },
    { name: 'iOS', Component: ForgotPasswordScreenIOS },
    { name: 'Web', Component: ForgotPasswordScreenWeb },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useForgotPasswordScreen.mockReturnValue(baseHookReturn);
  });

  platforms.forEach(({ name, Component }) => {
    it(`${name} renders form fields`, () => {
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('forgot-password-screen')).toBeTruthy();
      expect(getByTestId('forgot-email')).toBeTruthy();
      expect(getByTestId('forgot-tenant-id')).toBeTruthy();
      expect(getByTestId('forgot-button')).toBeTruthy();
    });

    it(`${name} renders offline state`, () => {
      useForgotPasswordScreen.mockReturnValue({ ...baseHookReturn, isOffline: true });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('forgot-offline-state')).toBeTruthy();
    });

    it(`${name} renders error state`, () => {
      useForgotPasswordScreen.mockReturnValue({ ...baseHookReturn, errorMessage: 'Error' });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('forgot-error-state')).toBeTruthy();
    });

    it(`${name} renders success state`, () => {
      useForgotPasswordScreen.mockReturnValue({ ...baseHookReturn, isSubmitted: true });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('forgot-success-message')).toBeTruthy();
    });
  });

  it('exposes index and types for coverage', () => {
    expect(ForgotPasswordScreenIndex).toBeDefined();
    expect(STATES.SUBMITTED).toBeDefined();
  });
});

