const React = require('react');
const { fireEvent, render, waitFor } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');

const translations = require('@i18n/locales/en.json');

const mockPush = jest.fn();
let mockAuthState;

const getTranslation = (key) =>
  key.split('.').reduce((current, segment) => (
    current && Object.prototype.hasOwnProperty.call(current, segment)
      ? current[segment]
      : undefined
  ), translations);

const mockT = jest.fn((key, params = {}) => {
  const template = getTranslation(key);
  const value = typeof template === 'string' ? template : key;

  return Object.entries(params).reduce(
    (text, [paramKey, paramValue]) => text.replace(`{{${paramKey}}}`, String(paramValue)),
    value
  );
});

jest.mock('expo-router', () => ({
  Redirect: jest.fn(() => null),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({ t: mockT }),
  useAuth: () => mockAuthState,
}));

jest.mock('@platform/components', () => {
  const React = require('react');
  const { Text: NativeText, TextInput, TouchableOpacity, View } = require('react-native');

  const Text = ({ children, testID, ...props }) =>
    React.createElement(NativeText, { testID, ...props }, children);

  const Stack = ({ children, testID, ...props }) =>
    React.createElement(View, { testID, ...props }, children);

  const Button = ({
    accessibilityHint,
    accessibilityLabel,
    children,
    disabled,
    onClick,
    onPress,
    testID,
    text,
  }) =>
    React.createElement(
      TouchableOpacity,
      {
        accessibilityHint,
        accessibilityLabel,
        accessibilityRole: 'button',
        accessibilityState: { disabled: !!disabled },
        disabled,
        onPress: onPress || onClick,
        testID,
      },
      React.createElement(NativeText, {}, text || children)
    );

  const AuthFormLayout = ({
    accessibilityLabel,
    actions,
    children,
    description,
    footer,
    status,
    testID,
    title,
  }) =>
    React.createElement(
      View,
      { accessibilityLabel, testID },
      title ? React.createElement(NativeText, {}, title) : null,
      description ? React.createElement(NativeText, {}, description) : null,
      status,
      children,
      actions,
      footer
    );

  const AuthBrand = ({ layout, name, subtitle, testID }) =>
    React.createElement(
      View,
      { layout, testID },
      React.createElement(View, { testID: `${testID}-logo` }),
      React.createElement(NativeText, { testID: `${testID}-name` }, name),
      subtitle ? React.createElement(NativeText, { testID: `${testID}-subtitle` }, subtitle) : null
    );

  const TextField = ({
    accessibilityLabel,
    errorMessage,
    helperText,
    label,
    onChangeText,
    placeholder,
    testID,
    value,
  }) =>
    React.createElement(
      View,
      {},
      label ? React.createElement(NativeText, {}, label) : null,
      React.createElement(TextInput, {
        accessibilityLabel: accessibilityLabel || label,
        onChangeText,
        placeholder,
        testID,
        value,
      }),
      errorMessage || helperText
        ? React.createElement(NativeText, {}, errorMessage || helperText)
        : null
    );

  const PasswordField = TextField;

  const Select = ({
    disabled,
    helperText,
    label,
    onValueChange,
    options = [],
    placeholder,
    testID,
    value,
  }) =>
    React.createElement(
      View,
      { testID, options, value },
      label ? React.createElement(NativeText, {}, label) : null,
      React.createElement(NativeText, {}, value || placeholder),
      options.map((option, index) =>
        React.createElement(
          TouchableOpacity,
          {
            disabled: disabled || option.disabled,
            key: option.value,
            onPress: () => onValueChange(option.value),
            testID: `${testID}-option-${index}`,
          },
          React.createElement(NativeText, {}, option.label)
        )
      ),
      helperText ? React.createElement(NativeText, {}, helperText) : null
    );

  const SystemBanner = ({ actionLabel, message, onAction, testID, title, variant }) =>
    React.createElement(
      View,
      { testID, variant },
      title ? React.createElement(NativeText, {}, title) : null,
      message ? React.createElement(NativeText, {}, message) : null,
      actionLabel
        ? React.createElement(Button, { onPress: onAction, text: actionLabel, testID: `${testID}-action` })
        : null
    );

  return {
    __esModule: true,
    AuthBrand,
    AuthFormLayout,
    Button,
    PasswordField,
    Select,
    Stack,
    SystemBanner,
    Text,
    TextField,
  };
});

const LoginScreen = require('@platform/screens/auth/LoginScreen').default;
const RegisterScreen = require('@platform/screens/auth/RegisterScreen').default;
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const createAuthState = (overrides = {}) => ({
  clearError: jest.fn(),
  errorCode: null,
  hasRestoredSession: true,
  isAuthenticated: false,
  isLoading: false,
  login: jest.fn().mockResolvedValue({}),
  register: jest.fn().mockResolvedValue({}),
  requiresActiveFacility: false,
  restoreSession: jest.fn().mockResolvedValue({}),
  sessionErrorCode: null,
  ...overrides,
});

const renderWithTheme = (node) => render(<ThemeProvider theme={lightTheme}>{node}</ThemeProvider>);

describe('auth entry screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthState = createAuthState();
  });

  it('renders a branded sign-in entry with account creation navigation', () => {
    const { getByPlaceholderText, getByTestId, queryByText } = renderWithTheme(<LoginScreen />);

    expect(getByTestId('login-brand-logo')).toBeTruthy();
    expect(getByTestId('login-brand').props.layout).toBe('horizontal');
    expect(getByTestId('login-brand-name').props.children).toBe('AI Vent');
    expect(getByTestId('login-title').props.children).toBe('Sign in');
    expect(getByTestId('login-email')).toBeTruthy();
    expect(getByPlaceholderText('Enter password')).toBeTruthy();
    expect(getByTestId('login-submit')).toBeTruthy();
    expect(queryByText('Use your AI Vent account to continue.')).toBeNull();
    expect(queryByText(/Clinical data stays hidden/i)).toBeNull();

    fireEvent.press(getByTestId('login-create-account'));

    expect(mockPush).toHaveBeenCalledWith('/register');
  });

  it('submits trimmed sign-in credentials through the auth hook', async () => {
    const { getByPlaceholderText, getByTestId } = renderWithTheme(<LoginScreen />);

    fireEvent.changeText(getByTestId('login-email'), ' clinician@example.com ');
    fireEvent.changeText(getByPlaceholderText('Enter password'), 'secure-pass');
    fireEvent.press(getByTestId('login-submit'));

    await waitFor(() => {
      expect(mockAuthState.login).toHaveBeenCalledWith({
        email: 'clinician@example.com',
        password: 'secure-pass',
      });
    });
  });

  it('shows a disabled sign-in loading state', () => {
    mockAuthState = createAuthState({ isLoading: true });
    const { getByTestId, getByText } = renderWithTheme(<LoginScreen />);

    expect(getByText('Signing in...')).toBeTruthy();
    expect(getByTestId('login-submit').props.accessibilityState.disabled).toBe(true);
  });

  it('shows backend route failures as red sign-in errors', () => {
    mockAuthState = createAuthState({ errorCode: 'BACKEND_ENDPOINT_NOT_FOUND' });
    const { getByTestId, getByText } = renderWithTheme(<LoginScreen />);

    expect(getByText('Backend API endpoint was not found. The domain is reachable, but the API route is not deployed.')).toBeTruthy();
    expect(getByTestId('login-error-banner').props.variant).toBe('error');
  });

  it('shows network sign-in failures as red connection errors', () => {
    mockAuthState = createAuthState({ errorCode: 'NETWORK_ERROR' });
    const { getByTestId, getByText } = renderWithTheme(<LoginScreen />);

    expect(getByText('We could not connect to the server. Please check your internet connection and try again.')).toBeTruthy();
    expect(getByTestId('login-error-banner').props.variant).toBe('error');
  });

  it('renders a branded registration entry with sign-in navigation', () => {
    const { getByPlaceholderText, getByTestId, queryByTestId, queryByText } = renderWithTheme(<RegisterScreen />);

    expect(getByTestId('register-brand-logo')).toBeTruthy();
    expect(getByTestId('register-brand').props.layout).toBe('horizontal');
    expect(getByTestId('register-brand-name').props.children).toBe('AI Vent');
    expect(getByTestId('register-title').props.children).toBe('Create account');
    expect(getByTestId('register-name')).toBeTruthy();
    expect(getByTestId('register-email')).toBeTruthy();
    expect(getByPlaceholderText('Create password')).toBeTruthy();
    expect(getByTestId('register-facility-combobox')).toBeTruthy();
    expect(getByTestId('register-facility-combobox-input')).toBeTruthy();
    expect(queryByTestId('register-facility-select')).toBeNull();
    expect(getByTestId('register-submit')).toBeTruthy();
    expect(queryByText(/Clinical data stays hidden/i)).toBeNull();

    fireEvent(getByTestId('register-facility-combobox-input'), 'focus');

    expect(getByTestId('register-facility-combobox-options')).toBeTruthy();

    fireEvent.press(getByTestId('register-sign-in'));

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('submits validated registration details through the auth hook', async () => {
    const { getByPlaceholderText, getByTestId } = renderWithTheme(<RegisterScreen />);

    fireEvent.changeText(getByTestId('register-name'), ' Nurse User ');
    fireEvent.changeText(getByTestId('register-email'), ' nurse@example.com ');
    fireEvent.changeText(getByPlaceholderText('Create password'), 'long-pass');
    fireEvent.press(getByTestId('register-submit'));

    await waitFor(() => {
      expect(mockAuthState.register).toHaveBeenCalledWith({
        name: 'Nurse User',
        email: 'nurse@example.com',
        password: 'long-pass',
      });
    });
  });

  it('shows a disabled registration loading state', () => {
    mockAuthState = createAuthState({ isLoading: true });
    const { getByTestId, getByText } = renderWithTheme(<RegisterScreen />);

    expect(getByText('Creating account...')).toBeTruthy();
    expect(getByTestId('register-submit').props.accessibilityState.disabled).toBe(true);
  });

  it('submits an optional facility affiliation as a pending clinician request', async () => {
    const { getByPlaceholderText, getByTestId } = renderWithTheme(<RegisterScreen />);

    fireEvent.changeText(getByTestId('register-name'), 'Nurse User');
    fireEvent.changeText(getByTestId('register-email'), 'nurse@example.com');
    fireEvent.changeText(getByPlaceholderText('Create password'), 'long-pass');
    fireEvent.changeText(getByTestId('register-facility-combobox-input'), 'Mulago');
    fireEvent.press(getByTestId('register-facility-combobox-option-0'));
    fireEvent.press(getByTestId('register-submit'));

    await waitFor(() => {
      expect(mockAuthState.register).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Nurse User',
        email: 'nurse@example.com',
        password: 'long-pass',
        facilityName: 'Mulago National Referral Hospital',
        facilityDistrict: 'Kampala',
        facilityRegion: 'Central',
        facilityType: 'National referral hospital',
        facilityOwnership: 'Government',
        requestedRole: 'CLINICIAN',
      }));
    });
  });

  it('keeps short registration passwords local and accessible as field help', () => {
    const { getByPlaceholderText, getByTestId, getByText } = renderWithTheme(<RegisterScreen />);

    fireEvent.changeText(getByTestId('register-name'), 'Nurse User');
    fireEvent.changeText(getByTestId('register-email'), 'nurse@example.com');
    fireEvent.changeText(getByPlaceholderText('Create password'), 'short');
    fireEvent.press(getByTestId('register-submit'));

    expect(mockAuthState.register).not.toHaveBeenCalled();
    expect(getByText('Minimum length is 8 characters')).toBeTruthy();
  });
});
