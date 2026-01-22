/**
 * useVerifyPhoneScreen Hook Tests
 * File: useVerifyPhoneScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { useAuth, useI18n, useNetwork } = require('@hooks');
const { useRouter } = require('expo-router');

const useVerifyPhoneScreen = require('@platform/screens/auth/VerifyPhoneScreen/useVerifyPhoneScreen').default;

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

describe('useVerifyPhoneScreen Hook', () => {
  const verifyPhone = jest.fn(() => Promise.resolve({}));
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
      verifyPhone,
      clearError,
      isLoading: false,
      errorCode: null,
    });
    useI18n.mockReturnValue({ t });
    useNetwork.mockReturnValue({ isOffline: false });
    useRouter.mockReturnValue({ push });
  });

  it('submits verify phone payload', async () => {
    const { result } = renderHook(() => useVerifyPhoneScreen());
    act(() => {
      result.current.handleChangeToken('token');
      result.current.handleChangePhone('+256 701 234 567');
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(clearError).toHaveBeenCalled();
    expect(verifyPhone).toHaveBeenCalledWith({
      token: 'token',
      phone: '256701234567',
    });
  });

  it('maps error codes to i18n messages', () => {
    useAuth.mockReturnValue({
      verifyPhone,
      clearError,
      isLoading: false,
      errorCode: 'UNAUTHORIZED',
    });
    const { result } = renderHook(() => useVerifyPhoneScreen());
    expect(result.current.errorMessage).toBe('Unauthorized');
  });

  it('handles navigation actions', () => {
    const { result } = renderHook(() => useVerifyPhoneScreen());
    act(() => {
      result.current.handleGoToLogin();
    });
    expect(push).toHaveBeenCalledWith('/login');
  });
});

