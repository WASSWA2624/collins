/**
 * useLoginScreen Hook Tests
 * File: useLoginScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { useAuth, useBiometricAuth, useI18n, useNetwork } = require('@hooks');
const { useRouter } = require('expo-router');

const useLoginScreen = require('@platform/screens/auth/LoginScreen/useLoginScreen').default;

jest.mock('@hooks', () => ({
  useAuth: jest.fn(),
  useBiometricAuth: jest.fn(),
  useI18n: jest.fn(),
  useNetwork: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const act = TestRenderer.act;
const renderHook = (hook) => {
  const result = {};
  let renderer;

  const HookHarness = () => {
    const hookResult = hook();
    Object.assign(result, hookResult);
    return null;
  };

  act(() => {
    renderer = TestRenderer.create(React.createElement(HookHarness));
  });

  return {
    result: { current: result },
    unmount: () => {
      act(() => {
        renderer.unmount();
      });
    },
  };
};

describe('useLoginScreen Hook', () => {
  const login = jest.fn(() => Promise.resolve({}));
  const clearError = jest.fn();
  const push = jest.fn();
  const t = jest.fn((key) => {
    if (key === 'errors.codes.UNKNOWN_ERROR') return 'Unknown error';
    if (key === 'errors.codes.UNAUTHORIZED') return 'Unauthorized';
    return key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      login,
      clearError,
      refreshSession: jest.fn(() => Promise.resolve({})),
      loadCurrentUser: jest.fn(() => Promise.resolve({})),
      isLoading: false,
      errorCode: null,
      isAuthenticated: false,
      roles: [],
    });
    useBiometricAuth.mockReturnValue({
      isAvailable: false,
      isChecking: false,
      errorMessage: null,
      authenticate: jest.fn(() => Promise.resolve(false)),
    });
    useI18n.mockReturnValue({ t });
    useNetwork.mockReturnValue({ isOffline: false });
    useRouter.mockReturnValue({ push });
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useLoginScreen());
    expect(result.current.identifier).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.tenantId).toBe('');
    expect(result.current.facilityId).toBe('');
    expect(result.current.canSubmit).toBe(false);
  });

  it('enables submit when required fields are set', () => {
    const { result } = renderHook(() => useLoginScreen());
    act(() => {
      result.current.handleChangeIdentifier('user@example.com');
      result.current.handleChangePassword('Pass123!');
      result.current.handleChangeTenantId('tenant');
      result.current.handleChangeFacilityId('facility');
    });
    expect(result.current.canSubmit).toBe(true);
  });

  it('submits login payload', async () => {
    const { result } = renderHook(() => useLoginScreen());
    act(() => {
      result.current.handleChangeIdentifier('user@example.com');
      result.current.handleChangePassword('Pass123!');
      result.current.handleChangeTenantId('tenant');
      result.current.handleChangeFacilityId('facility');
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(clearError).toHaveBeenCalled();
    expect(login).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Pass123!',
      tenant_id: 'tenant',
      facility_id: 'facility',
    });
  });

  it('submits phone login payload without plus sign', async () => {
    const { result } = renderHook(() => useLoginScreen());
    act(() => {
      result.current.handleChangeIdentifier('+256 701 234 567');
      result.current.handleChangePassword('Pass123!');
      result.current.handleChangeTenantId('tenant');
      result.current.handleChangeFacilityId('facility');
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(login).toHaveBeenCalledWith({
      phone: '256701234567',
      password: 'Pass123!',
      tenant_id: 'tenant',
      facility_id: 'facility',
    });
  });

  it('maps error codes to i18n messages', () => {
    useAuth.mockReturnValue({
      login,
      clearError,
      isLoading: false,
      errorCode: 'UNAUTHORIZED',
    });
    const { result } = renderHook(() => useLoginScreen());
    expect(result.current.errorMessage).toBe('Unauthorized');
  });

  it('disallows register access when unauthenticated', () => {
    const { result } = renderHook(() => useLoginScreen());
    expect(result.current.canAccessRegister).toBe(false);
  });

  it('uses biometric error when present', () => {
    useBiometricAuth.mockReturnValue({
      isAvailable: true,
      isChecking: false,
      errorMessage: 'Biometric failed',
      authenticate: jest.fn(() => Promise.resolve(false)),
    });
    const { result } = renderHook(() => useLoginScreen());
    expect(result.current.errorMessage).toBe('Biometric failed');
  });

  it('handles navigation actions', () => {
    const { result } = renderHook(() => useLoginScreen());
    act(() => {
      result.current.handleGoToRegister();
      result.current.handleGoToForgotPassword();
    });
    expect(push).toHaveBeenCalledWith('/register');
    expect(push).toHaveBeenCalledWith('/forgot-password');
  });

  it('triggers biometric login flow when available', async () => {
    const refreshSession = jest.fn(() => Promise.resolve({}));
    const loadCurrentUser = jest.fn(() => Promise.resolve({}));
    const authenticate = jest.fn(() => Promise.resolve(true));

    useAuth.mockReturnValue({
      login,
      clearError,
      refreshSession,
      loadCurrentUser,
      isLoading: false,
      errorCode: null,
      isAuthenticated: true,
      roles: ['admin'],
    });
    useBiometricAuth.mockReturnValue({
      isAvailable: true,
      isChecking: false,
      errorMessage: null,
      authenticate,
    });

    const { result } = renderHook(() => useLoginScreen());
    await act(async () => {
      await result.current.handleBiometricLogin();
    });

    expect(authenticate).toHaveBeenCalled();
    expect(refreshSession).toHaveBeenCalled();
    expect(loadCurrentUser).toHaveBeenCalled();
  });
});

