/**
 * useForgotPasswordScreen Hook Tests
 * File: useForgotPasswordScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { useAuth, useI18n, useNetwork } = require('@hooks');
const { useRouter } = require('expo-router');

const useForgotPasswordScreen = require('@platform/screens/auth/ForgotPasswordScreen/useForgotPasswordScreen').default;

jest.mock('@hooks', () => ({
  useAuth: jest.fn(),
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

describe('useForgotPasswordScreen Hook', () => {
  const forgotPassword = jest.fn(() => Promise.resolve({}));
  const clearError = jest.fn();
  const push = jest.fn();
  const t = jest.fn((key) => {
    if (key === 'errors.codes.UNKNOWN_ERROR') return 'Unknown error';
    if (key === 'errors.codes.NOT_FOUND') return 'Not found';
    return key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      forgotPassword,
      clearError,
      isLoading: false,
      errorCode: null,
    });
    useI18n.mockReturnValue({ t });
    useNetwork.mockReturnValue({ isOffline: false });
    useRouter.mockReturnValue({ push });
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useForgotPasswordScreen());
    expect(result.current.email).toBe('');
    expect(result.current.tenantId).toBe('');
    expect(result.current.isSubmitted).toBe(false);
  });

  it('submits forgot password payload', async () => {
    const { result } = renderHook(() => useForgotPasswordScreen());
    act(() => {
      result.current.handleChangeEmail('user@example.com');
      result.current.handleChangeTenantId('tenant');
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(clearError).toHaveBeenCalled();
    expect(forgotPassword).toHaveBeenCalledWith({
      email: 'user@example.com',
      tenant_id: 'tenant',
    });
  });

  it('maps error codes to i18n messages', () => {
    useAuth.mockReturnValue({
      forgotPassword,
      clearError,
      isLoading: false,
      errorCode: 'NOT_FOUND',
    });
    const { result } = renderHook(() => useForgotPasswordScreen());
    expect(result.current.errorMessage).toBe('Not found');
  });

  it('handles navigation actions', () => {
    const { result } = renderHook(() => useForgotPasswordScreen());
    act(() => {
      result.current.handleGoToLogin();
    });
    expect(push).toHaveBeenCalledWith('/login');
  });
});

