/**
 * Auth Use Case Tests
 * File: auth.usecase.test.js
 */
import {
  loginUseCase,
  logoutUseCase,
  refreshSessionUseCase,
  registerUseCase,
  loadCurrentUserUseCase,
  restoreSessionUseCase,
  selectActiveFacilityUseCase,
} from '@features/auth';
import { tokenManager } from '@security';
import {
  loginApi,
  logoutApi,
  refreshApi,
  registerApi,
  getCurrentUserApi,
} from '@features/auth/auth.api';

jest.mock('@features/auth/auth.api', () => ({
  loginApi: jest.fn(),
  logoutApi: jest.fn(),
  refreshApi: jest.fn(),
  registerApi: jest.fn(),
  getCurrentUserApi: jest.fn(),
  verifyEmailApi: jest.fn(),
  verifyPhoneApi: jest.fn(),
  resendVerificationApi: jest.fn(),
  forgotPasswordApi: jest.fn(),
  resetPasswordApi: jest.fn(),
  changePasswordApi: jest.fn(),
}));

jest.mock('@security', () => ({
  tokenManager: {
    setTokens: jest.fn(),
    clearTokens: jest.fn(),
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    isTokenExpired: jest.fn(),
  },
}));

describe('auth.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    loginApi.mockResolvedValue({ data: { user: { id: '1' }, tokens: { accessToken: 'a', refreshToken: 'b' } } });
    registerApi.mockResolvedValue({ data: { user: { id: '2' } } });
    logoutApi.mockResolvedValue({ data: {} });
    refreshApi.mockResolvedValue({ data: { tokens: { accessToken: 'a', refreshToken: 'b' } } });
    getCurrentUserApi.mockResolvedValue({ data: { user: { id: '3' } } });
    tokenManager.setTokens.mockResolvedValue(true);
    tokenManager.clearTokens.mockResolvedValue(true);
    tokenManager.getAccessToken.mockResolvedValue('access');
    tokenManager.getRefreshToken.mockResolvedValue('refresh');
    tokenManager.isTokenExpired.mockReturnValue(false);
  });

  it('logs in and stores tokens', async () => {
    const user = await loginUseCase({
      email: 'user@example.com',
      password: 'pass',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000'
    });
    expect(user).toEqual({ id: '1' });
    expect(tokenManager.setTokens).toHaveBeenCalledWith('a', 'b');
  });

  it('registers and loads current user', async () => {
    const user = await registerUseCase({ email: 'user' });
    expect(user).toEqual({ id: '2' });
    const current = await loadCurrentUserUseCase();
    expect(current).toEqual({ id: '3' });
  });

  it('refreshes session and logs out', async () => {
    const tokens = await refreshSessionUseCase();
    expect(tokens).toEqual({ accessToken: 'a', refreshToken: 'b' });
    await logoutUseCase();
    expect(tokenManager.clearTokens).toHaveBeenCalled();
  });

  it('restores current user with a valid access token', async () => {
    const user = await restoreSessionUseCase();
    expect(user).toEqual({ id: '3' });
    expect(getCurrentUserApi).toHaveBeenCalled();
    expect(refreshApi).not.toHaveBeenCalled();
  });

  it('refreshes expired access token during restore', async () => {
    tokenManager.isTokenExpired.mockReturnValueOnce(true);
    const user = await restoreSessionUseCase();
    expect(refreshApi).toHaveBeenCalledWith({ refreshToken: 'refresh' });
    expect(user).toEqual({ id: '3' });
  });

  it('selects active facility through refresh rotation', async () => {
    const user = await selectActiveFacilityUseCase({ activeFacilityId: 'facility-1' });
    expect(refreshApi).toHaveBeenCalledWith({
      refreshToken: 'refresh',
      activeFacilityId: 'facility-1',
    });
    expect(user).toEqual({ id: '3' });
  });

  it('clears stored session when restore cannot refresh', async () => {
    tokenManager.isTokenExpired.mockReturnValueOnce(true);
    refreshApi.mockRejectedValueOnce({ status: 401, message: 'Authentication required' });
    await expect(restoreSessionUseCase()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    expect(tokenManager.clearTokens).toHaveBeenCalled();
  });

  it('throws normalized errors', async () => {
    loginApi.mockRejectedValueOnce({ code: 'UNAUTHORIZED' });
    await expect(loginUseCase({
      email: 'user@example.com',
      password: 'pass',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000'
    })).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
  });
});
