/**
 * useResetPasswordScreen Hook Tests
 * File: useResetPasswordScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { useAuth, useI18n, useNetwork } = require('@hooks');
const { useRouter } = require('expo-router');

const useResetPasswordScreen = require('@platform/screens/auth/ResetPasswordScreen/useResetPasswordScreen').default;

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

describe('useResetPasswordScreen Hook', () => {
  const resetPassword = jest.fn(() => Promise.resolve({}));
  const clearError = jest.fn();
  const push = jest.fn();
  const t = jest.fn((key) => {
    if (key === 'errors.codes.UNKNOWN_ERROR') return 'Unknown error';
    if (key === 'errors.codes.BAD_REQUEST') return 'Bad request';
    return key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      resetPassword,
      clearError,
      isLoading: false,
      errorCode: null,
    });
    useI18n.mockReturnValue({ t });
    useNetwork.mockReturnValue({ isOffline: false });
    useRouter.mockReturnValue({ push });
  });

  it('flags password mismatch', () => {
    const { result } = renderHook(() => useResetPasswordScreen());
    act(() => {
      result.current.handleChangePassword('Pass123!');
      result.current.handleChangeConfirmPassword('Mismatch');
    });
    expect(result.current.passwordMismatch).toBe(true);
  });

  it('submits reset password payload', async () => {
    const { result } = renderHook(() => useResetPasswordScreen());
    act(() => {
      result.current.handleChangeToken('token');
      result.current.handleChangePassword('Pass123!');
      result.current.handleChangeConfirmPassword('Pass123!');
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(clearError).toHaveBeenCalled();
    expect(resetPassword).toHaveBeenCalledWith({
      token: 'token',
      new_password: 'Pass123!',
      confirm_password: 'Pass123!',
    });
  });

  it('maps error codes to i18n messages', () => {
    useAuth.mockReturnValue({
      resetPassword,
      clearError,
      isLoading: false,
      errorCode: 'BAD_REQUEST',
    });
    const { result } = renderHook(() => useResetPasswordScreen());
    expect(result.current.errorMessage).toBe('Bad request');
  });

  it('handles navigation actions', () => {
    const { result } = renderHook(() => useResetPasswordScreen());
    act(() => {
      result.current.handleGoToLogin();
    });
    expect(push).toHaveBeenCalledWith('/login');
  });
});

