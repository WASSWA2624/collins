/**
 * useRegisterScreen Hook Tests
 * File: useRegisterScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { useAuth, useI18n, useNetwork } = require('@hooks');
const { useRouter } = require('expo-router');

const useRegisterScreen = require('@platform/screens/auth/RegisterScreen/useRegisterScreen').default;
// eslint-disable-next-line import/no-unresolved
const { STEPS } = require('@platform/screens/auth/RegisterScreen/types.js');

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

describe('useRegisterScreen Hook', () => {
  const register = jest.fn(() => Promise.resolve({}));
  const clearError = jest.fn();
  const push = jest.fn();
  const t = jest.fn((key) => {
    if (key === 'errors.codes.UNKNOWN_ERROR') return 'Unknown error';
    if (key === 'errors.codes.CONFLICT') return 'Conflict';
    return key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      register,
      clearError,
      isLoading: false,
      errorCode: null,
      isAuthenticated: true,
      roles: ['admin'],
    });
    useI18n.mockReturnValue({ t });
    useNetwork.mockReturnValue({ isOffline: false });
    useRouter.mockReturnValue({ push });
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useRegisterScreen());
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.tenantId).toBe('');
    expect(result.current.canSubmit).toBe(false);
    expect(result.current.canProceed).toBe(false);
  });

  it('enables continue when tenant is valid', () => {
    const { result } = renderHook(() => useRegisterScreen());
    act(() => {
      result.current.handleChangeTenantId('550e8400-e29b-41d4-a716-446655440000');
    });
    expect(result.current.canProceed).toBe(true);
  });

  it('advances to details step and submits register payload', async () => {
    const { result } = renderHook(() => useRegisterScreen());
    act(() => {
      result.current.handleChangeTenantId('550e8400-e29b-41d4-a716-446655440000');
      result.current.handleChangeFacilityId('550e8400-e29b-41d4-a716-446655440001');
    });
    act(() => {
      result.current.handleContinue();
    });
    act(() => {
      result.current.handleChangeEmail('user@example.com');
      result.current.handleChangePassword('Pass123!');
      result.current.handleChangePhone('+256 701 234 567');
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(clearError).toHaveBeenCalled();
    expect(register).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Pass123!',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      facility_id: '550e8400-e29b-41d4-a716-446655440001',
      phone: '256701234567',
    });
  });

  it('maps error codes to i18n messages', () => {
    useAuth.mockReturnValue({
      register,
      clearError,
      isLoading: false,
      errorCode: 'CONFLICT',
    });
    const { result } = renderHook(() => useRegisterScreen());
    expect(result.current.errorMessage).toBe('Conflict');
  });

  it('blocks access when user lacks role', () => {
    useAuth.mockReturnValue({
      register,
      clearError,
      isLoading: false,
      errorCode: null,
      isAuthenticated: false,
      roles: [],
    });
    const { result } = renderHook(() => useRegisterScreen());
    expect(result.current.accessErrorMessage).toBe('errors.codes.FORBIDDEN');
  });

  it('blocks continue when tenant is invalid', () => {
    const { result } = renderHook(() => useRegisterScreen());
    act(() => {
      result.current.handleChangeTenantId('invalid');
    });
    act(() => {
      result.current.handleContinue();
    });
    expect(result.current.tenantIdError).toBe('forms.validation.invalidUuid');
    expect(result.current.step).toBe(STEPS.ORGANIZATION);
  });

  it('handles navigation actions', () => {
    const { result } = renderHook(() => useRegisterScreen());
    act(() => {
      result.current.handleGoToLogin();
    });
    expect(push).toHaveBeenCalledWith('/login');
  });

  it('supports going back to organization step', () => {
    const { result } = renderHook(() => useRegisterScreen());
    act(() => {
      result.current.handleChangeTenantId('550e8400-e29b-41d4-a716-446655440000');
      result.current.handleContinue();
      result.current.handleBack();
    });
    expect(result.current.step).toBe(STEPS.ORGANIZATION);
  });
});

