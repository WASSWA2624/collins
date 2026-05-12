/**
 * useBiometricAuth Hook Tests
 * File: useBiometricAuth.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');

jest.mock('@hooks/useI18n', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@security', () => ({
  authenticateBiometric: jest.fn(),
  isBiometricEnrolled: jest.fn(),
  isBiometricSupported: jest.fn(),
}));

const useI18n = require('@hooks/useI18n').default;
const {
  authenticateBiometric,
  isBiometricEnrolled,
  isBiometricSupported,
} = require('@security');

const useBiometricAuth = require('@hooks/useBiometricAuth').default;

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

describe('useBiometricAuth Hook', () => {
  const t = jest.fn((key) => key);

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t });
  });

  it('exposes availability after checks', async () => {
    isBiometricSupported.mockResolvedValue(true);
    isBiometricEnrolled.mockResolvedValue(true);

    const { result } = renderHook(() => useBiometricAuth());
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isAvailable).toBe(true);
    expect(result.current.isChecking).toBe(false);
  });

  it('returns error message on failed authentication', async () => {
    isBiometricSupported.mockResolvedValue(true);
    isBiometricEnrolled.mockResolvedValue(true);
    authenticateBiometric.mockResolvedValue({ success: false });

    const { result } = renderHook(() => useBiometricAuth());
    await act(async () => {
      await Promise.resolve();
    });

    let authResult;
    await act(async () => {
      authResult = await result.current.authenticate();
    });

    expect(authResult).toBe(false);
    expect(result.current.errorMessage).toBe('auth.login.biometric.error');
  });
});
