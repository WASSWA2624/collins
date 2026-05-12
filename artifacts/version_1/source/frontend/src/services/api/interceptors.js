/**
 * API Interceptors
 * Handles auth headers and token refresh
 * File: interceptors.js
 */
import { tokenManager } from '@security';
import { handleError } from '@errors';
import { clearCsrfToken } from '@services/csrf';
import { emitAuthSessionExpired } from '@features/auth/session.events';

const attachAuthHeader = async (config) => {
  const token = await tokenManager.getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleAuthError = async (error, options = {}) => {
  const { expireSession = true } = options;
  if (error?.status === 401) {
    await tokenManager.clearTokens();
    clearCsrfToken();
    if (expireSession) {
      emitAuthSessionExpired({ code: error?.code || 'SESSION_EXPIRED' });
    }
    throw handleError(error);
  }
  throw handleError(error);
};

export { attachAuthHeader, handleAuthError };
