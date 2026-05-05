/**
 * API Client
 * Centralized fetch wrapper with auth refresh and session expiry handling.
 * File: client.js
 */
import { TIMEOUTS } from '@config';
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { getDeviceLocale, LOCALE_STORAGE_KEY } from '@i18n';
import { tokenManager } from '@security';
import { getCsrfHeaders, clearCsrfToken } from '@services/csrf';
import { async as asyncStorage } from '@services/storage';
import { attachAuthHeader, handleAuthError } from './interceptors';
import { emitAuthSessionExpired } from '@features/auth/session.events';

const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'DELETE', 'PATCH']);
const AUTH_CREDENTIAL_ENDPOINTS = new Set([
  endpoints.AUTH.LOGIN,
  endpoints.AUTH.REGISTER,
  endpoints.AUTH.FORGOT_PASSWORD,
  endpoints.AUTH.RESET_PASSWORD,
  endpoints.AUTH.VERIFY_EMAIL,
  endpoints.AUTH.VERIFY_PHONE,
  endpoints.AUTH.RESEND_VERIFICATION,
  endpoints.AUTH.CSRF_TOKEN,
]);

const normalizeTokenResponse = (value) => {
  const data = value?.data ?? value;
  const tokens = data?.tokens || data || {};
  const accessToken = tokens.accessToken || tokens.access_token || data?.accessToken || data?.access_token || null;
  const refreshToken = tokens.refreshToken || tokens.refresh_token || data?.refreshToken || data?.refresh_token || null;
  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
};

const resolveRequestLocale = async () => {
  try {
    const storedLocale = await asyncStorage.getItem(LOCALE_STORAGE_KEY);
    if (typeof storedLocale === 'string') {
      const value = storedLocale.trim();
      if (value) return value;
    }
    return getDeviceLocale();
  } catch {
    return getDeviceLocale();
  }
};

const hasJsonContent = (response) => {
  const contentType = response.headers?.get?.('content-type') || '';
  return contentType.includes('application/json');
};

const readJsonBody = async (response) => {
  if (!hasJsonContent(response)) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const buildRequestOptions = async ({ url, method, body, headers, signal, locale }) => {
  const authConfig = await attachAuthHeader({ url, method, body, headers: { ...headers } });
  let csrfHeaders = {};

  if (STATE_CHANGING_METHODS.has(method)) {
    try {
      csrfHeaders = await getCsrfHeaders();
    } catch {
      csrfHeaders = {};
    }
  }

  return {
    requestUrl: authConfig.url,
    options: {
      method: authConfig.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(locale ? { 'Accept-Language': locale } : {}),
        ...authConfig.headers,
        ...csrfHeaders,
      },
      body: authConfig.body ? JSON.stringify(authConfig.body) : undefined,
      signal,
    },
  };
};

const shouldAttemptRefresh = (url) => !AUTH_CREDENTIAL_ENDPOINTS.has(url) && url !== endpoints.AUTH.REFRESH;

const shouldExpireSessionForError = (url) => !AUTH_CREDENTIAL_ENDPOINTS.has(url);

const expireStoredSession = async (code = 'SESSION_EXPIRED') => {
  await tokenManager.clearTokens();
  clearCsrfToken();
  emitAuthSessionExpired({ code });
};

const attemptSessionRefresh = async (locale) => {
  const refreshToken = await tokenManager.getRefreshToken?.();
  if (!refreshToken) return { refreshed: false, error: null };

  try {
    const response = await fetch(endpoints.AUTH.REFRESH, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(locale ? { 'Accept-Language': locale } : {}),
      },
      body: JSON.stringify({ refreshToken }),
    });

    const body = await readJsonBody(response);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        await expireStoredSession('SESSION_EXPIRED');
      }
      return { refreshed: false, error: null };
    }

    const tokens = normalizeTokenResponse(body);
    if (!tokens) return { refreshed: false, error: null };

    await tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
    return { refreshed: true, error: null };
  } catch (error) {
    return { refreshed: false, error: handleError(error) };
  }
};

const createHttpError = async (response) => {
  const errorData = await readJsonBody(response);
  return {
    status: response.status,
    statusText: response.statusText,
    message: errorData?.message || `API request failed: ${response.statusText}`,
    errors: errorData?.errors || [],
    meta: errorData?.meta,
  };
};

const apiClient = async (config) => {
  const {
    url,
    method = 'GET',
    body,
    headers = {},
    timeout = TIMEOUTS.API_REQUEST,
  } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const locale = await resolveRequestLocale();

    const performFetch = async () => {
      const { requestUrl, options } = await buildRequestOptions({
        url,
        method,
        body,
        headers,
        signal: controller.signal,
        locale,
      });
      return fetch(requestUrl, options);
    };

    let response = await performFetch();

    if (response.status === 401 && shouldAttemptRefresh(url)) {
      const refreshResult = await attemptSessionRefresh(locale);
      if (refreshResult.error) throw refreshResult.error;
      if (refreshResult.refreshed) {
        response = await performFetch();
      }
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await createHttpError(response);
      throw await handleAuthError(error, {
        expireSession: shouldExpireSessionForError(url),
      });
    }

    const data = await readJsonBody(response);
    return { data, status: response.status };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw handleError(new Error('Request timeout'), { url });
    }
    if (error?.code || error?.safeMessage) {
      throw error;
    }
    throw await handleAuthError(error, {
      expireSession: shouldExpireSessionForError(url),
    });
  }
};

export { apiClient };
