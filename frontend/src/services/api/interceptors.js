/**
 * API Interceptors
 * Handles auth headers and token refresh
 * File: interceptors.js
 */
import { tokenManager } from '@security';
import { handleError } from '@errors';

const attachAuthHeader = async (config) => {
  const token = await tokenManager.getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleAuthError = async (error) => {
  if (error?.status === 401) {
    // Token refresh logic here
    await tokenManager.clearTokens();
    throw handleError(error);
  }
  throw handleError(error);
};

export { attachAuthHeader, handleAuthError };

