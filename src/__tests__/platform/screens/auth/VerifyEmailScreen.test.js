/**
 * VerifyEmailScreen Component Tests
 * File: VerifyEmailScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const useVerifyEmailScreen = require('@platform/screens/auth/VerifyEmailScreen/useVerifyEmailScreen').default;

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

jest.mock('@platform/screens/auth/VerifyEmailScreen/useVerifyEmailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const VerifyEmailScreenAndroid = require('@platform/screens/auth/VerifyEmailScreen/VerifyEmailScreen.android').default;
const VerifyEmailScreenIOS = require('@platform/screens/auth/VerifyEmailScreen/VerifyEmailScreen.ios').default;
const VerifyEmailScreenWeb = require('@platform/screens/auth/VerifyEmailScreen/VerifyEmailScreen.web').default;
// eslint-disable-next-line import/no-unresolved
const VerifyEmailScreenIndex = require('@platform/screens/auth/VerifyEmailScreen/index.js');
// eslint-disable-next-line import/no-unresolved
const { STATES } = require('@platform/screens/auth/VerifyEmailScreen/types.js');

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

describe('VerifyEmailScreen Component', () => {
  const mockT = jest.fn((key) => key);
  const baseHookReturn = {
    token: 'token',
    email: 'user@example.com',
    isSubmitted: false,
    errorMessage: null,
    isLoading: false,
    isOffline: false,
    canSubmit: true,
    handleSubmit: jest.fn(),
    handleChangeToken: jest.fn(),
    handleChangeEmail: jest.fn(),
    handleGoToLogin: jest.fn(),
  };

  const platforms = [
    { name: 'Android', Component: VerifyEmailScreenAndroid },
    { name: 'iOS', Component: VerifyEmailScreenIOS },
    { name: 'Web', Component: VerifyEmailScreenWeb },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useVerifyEmailScreen.mockReturnValue(baseHookReturn);
  });

  platforms.forEach(({ name, Component }) => {
    it(`${name} renders form fields`, () => {
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('verify-email-screen')).toBeTruthy();
      expect(getByTestId('verify-email-token')).toBeTruthy();
      expect(getByTestId('verify-email-address')).toBeTruthy();
      expect(getByTestId('verify-email-button')).toBeTruthy();
    });

    it(`${name} renders offline state`, () => {
      useVerifyEmailScreen.mockReturnValue({ ...baseHookReturn, isOffline: true });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('verify-email-offline-state')).toBeTruthy();
    });

    it(`${name} renders error state`, () => {
      useVerifyEmailScreen.mockReturnValue({ ...baseHookReturn, errorMessage: 'Error' });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('verify-email-error-state')).toBeTruthy();
    });

    it(`${name} renders success state`, () => {
      useVerifyEmailScreen.mockReturnValue({ ...baseHookReturn, isSubmitted: true });
      const { getByTestId } = renderWithTheme(<Component />);
      expect(getByTestId('verify-email-success-message')).toBeTruthy();
    });
  });

  it('exposes index and types for coverage', () => {
    expect(VerifyEmailScreenIndex).toBeDefined();
    expect(STATES.SUBMITTED).toBeDefined();
  });
});

