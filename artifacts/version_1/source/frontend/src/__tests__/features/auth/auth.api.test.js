/**
 * Auth API Tests
 * File: auth.api.test.js
 */
import { apiClient } from '@services/api';
import { endpoints } from '@config/endpoints';
import {
  loginApi,
  logoutApi,
  refreshApi,
  registerApi,
  verifyEmailApi,
  verifyPhoneApi,
  resendVerificationApi,
  forgotPasswordApi,
  resetPasswordApi,
  changePasswordApi,
  getCurrentUserApi,
} from '@features/auth';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
}));

describe('auth.api', () => {
  beforeEach(() => {
    apiClient.mockClear();
  });

  it('calls auth endpoints', async () => {
    await loginApi({ email: 'user', password: 'pass' });
    await logoutApi();
    await refreshApi({ refreshToken: 'token' });
    await registerApi({ email: 'user' });
    await verifyEmailApi({ token: 't' });
    await verifyPhoneApi({ token: 't' });
    await resendVerificationApi({ email: 'user' });
    await forgotPasswordApi({ email: 'user' });
    await resetPasswordApi({ token: 't' });
    await changePasswordApi({ currentPassword: 'old', newPassword: 'new' });
    await getCurrentUserApi();

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.AUTH.LOGIN,
      method: 'POST',
      body: { email: 'user', password: 'pass' },
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.AUTH.LOGOUT,
      method: 'POST',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.AUTH.REFRESH,
      method: 'POST',
      body: { refreshToken: 'token' },
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.AUTH.ME,
      method: 'GET',
    });
  });
});
