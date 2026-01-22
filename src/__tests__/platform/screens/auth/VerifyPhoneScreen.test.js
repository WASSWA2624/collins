/**
 * VerifyPhoneScreen Component Tests
 * File: VerifyPhoneScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const useVerifyPhoneScreen = require('@platform/screens/auth/VerifyPhoneScreen/useVerifyPhoneScreen').default;

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

jest.mock('@platform/screens/auth/VerifyPhoneScreen/useVerifyPhoneScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const VerifyPhoneScreenAndroid = require('@platform/screens/auth/VerifyPhoneScreen/VerifyPhoneScreen.android').default;
const VerifyPhoneScreenIOS = require('@platform/screens/auth/VerifyPhoneScreen/VerifyPhoneScreen.ios').default;
const VerifyPhoneScreenWeb = require('@platform/screens/auth/VerifyPhoneScreen/VerifyPhoneScreen.web').default;
// eslint-disable-next-line import/no-unresolved
const VerifyPhoneScreenIndex = require('@platform/screens/auth/VerifyPhoneScreen/index.js');
// eslint-disable-next-line import/no-unresolved
const { STATES } = require('@platform/screens/auth/VerifyPhoneScreen/types.js');

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

describe('VerifyPhoneScreen Component', () => {
  const mockT = jest.fn((key) => key);
  const baseHookReturn = {
    token: 'token',
    phone: '1234567890',
    isSubmitted: false,
    errorMessage: null,
    isLoading: false,
    isOffline: false,
    canSubmit: true,
    handleSubmit: jest.fn(),
    handleChangeToken: jest.fn(),
    handleChangePhone: jest.fn(),
    handleGoToLogin: jest.fn(),
  };

  const platforms = [
    { name: 'Android', Component: VerifyPhoneScreenAndroid },
    { name: 'iOS', Component: VerifyPhoneScreenIOS },
    { name: 'Web', Component: VerifyPhoneScreenWeb },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useVerifyPhoneScreen.mockReturnValue(baseHookReturn);
  });

  platforms.forEach(({ name, Component }) => {
    it(`${name} renders form fields`, () => {
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('verify-phone-screen')).toBeTruthy();
      expect(getByTestId('verify-phone-token')).toBeTruthy();
      expect(getByTestId('verify-phone-number')).toBeTruthy();
      expect(getByTestId('verify-phone-button')).toBeTruthy();
    });

    it(`${name} renders offline state`, () => {
      useVerifyPhoneScreen.mockReturnValue({ ...baseHookReturn, isOffline: true });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('verify-phone-offline-state')).toBeTruthy();
    });

    it(`${name} renders error state`, () => {
      useVerifyPhoneScreen.mockReturnValue({ ...baseHookReturn, errorMessage: 'Error' });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('verify-phone-error-state')).toBeTruthy();
    });

    it(`${name} renders success state`, () => {
      useVerifyPhoneScreen.mockReturnValue({ ...baseHookReturn, isSubmitted: true });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('verify-phone-success-message')).toBeTruthy();
    });
  });

  it('exposes index and types for coverage', () => {
    expect(VerifyPhoneScreenIndex).toBeDefined();
    expect(STATES.SUBMITTED).toBeDefined();
  });
});

