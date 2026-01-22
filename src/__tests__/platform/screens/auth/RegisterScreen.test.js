/**
 * RegisterScreen Component Tests
 * File: RegisterScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const useRegisterScreen = require('@platform/screens/auth/RegisterScreen/useRegisterScreen').default;

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

jest.mock('@platform/screens/auth/RegisterScreen/useRegisterScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const RegisterScreenAndroid = require('@platform/screens/auth/RegisterScreen/RegisterScreen.android').default;
const RegisterScreenIOS = require('@platform/screens/auth/RegisterScreen/RegisterScreen.ios').default;
const RegisterScreenWeb = require('@platform/screens/auth/RegisterScreen/RegisterScreen.web').default;
// eslint-disable-next-line import/no-unresolved
const RegisterScreenIndex = require('@platform/screens/auth/RegisterScreen/index.js');
// eslint-disable-next-line import/no-unresolved
const { STATES, STEPS } = require('@platform/screens/auth/RegisterScreen/types.js');

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

describe('RegisterScreen Component', () => {
  const mockT = jest.fn((key) => key);
  const baseHookReturn = {
    step: STEPS.ORGANIZATION,
    email: 'user@example.com',
    password: 'password',
    tenantId: 'tenant',
    facilityId: '',
    phone: '',
    tenantIdError: null,
    facilityIdError: null,
    accessErrorMessage: null,
    errorMessage: null,
    isLoading: false,
    isOffline: false,
    canProceed: true,
    canSubmit: true,
    handleContinue: jest.fn(),
    handleSubmit: jest.fn(),
    handleChangeEmail: jest.fn(),
    handleChangePassword: jest.fn(),
    handleChangeTenantId: jest.fn(),
    handleChangeFacilityId: jest.fn(),
    handleChangePhone: jest.fn(),
    handleGoToLogin: jest.fn(),
    handleBack: jest.fn(),
  };

  const platforms = [
    { name: 'Android', Component: RegisterScreenAndroid, offlineTestId: 'register-offline-state', errorTestId: 'register-error-state' },
    { name: 'iOS', Component: RegisterScreenIOS, offlineTestId: 'register-offline-state', errorTestId: 'register-error-state' },
    { name: 'Web', Component: RegisterScreenWeb, offlineTestId: 'register-offline-state', errorTestId: 'register-error-state' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useRegisterScreen.mockReturnValue(baseHookReturn);
  });

  platforms.forEach(({ name, Component, offlineTestId, errorTestId }) => {
    it(`${name} renders organization step fields`, () => {
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('register-screen')).toBeTruthy();
      expect(getByTestId('register-tenant-id')).toBeTruthy();
      expect(getByTestId('register-facility-id')).toBeTruthy();
      expect(getByTestId('register-next')).toBeTruthy();
    });

    it(`${name} renders details step fields`, () => {
      useRegisterScreen.mockReturnValue({ ...baseHookReturn, step: STEPS.DETAILS });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('register-email')).toBeTruthy();
      expect(getByTestId('register-password')).toBeTruthy();
      expect(getByTestId('register-phone')).toBeTruthy();
      expect(getByTestId('register-button')).toBeTruthy();
      expect(getByTestId('register-back')).toBeTruthy();
    });

    it(`${name} renders offline state`, () => {
      useRegisterScreen.mockReturnValue({ ...baseHookReturn, isOffline: true });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId(offlineTestId)).toBeTruthy();
    });

    it(`${name} renders error state`, () => {
      useRegisterScreen.mockReturnValue({ ...baseHookReturn, errorMessage: 'Error' });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId(errorTestId)).toBeTruthy();
    });

    it(`${name} renders access denied state`, () => {
      useRegisterScreen.mockReturnValue({ ...baseHookReturn, accessErrorMessage: 'Access denied' });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('register-access-denied')).toBeTruthy();
    });
  });

  it('exposes index and types for coverage', () => {
    expect(RegisterScreenIndex).toBeDefined();
    expect(STATES.DEFAULT).toBeDefined();
  });
});

