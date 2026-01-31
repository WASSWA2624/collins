/**
 * API Client
 * Centralized fetch wrapper
 * File: client.js
 */
import { TIMEOUTS } from '@config';
import { handleError } from '@errors';
import { getDeviceLocale, LOCALE_STORAGE_KEY } from '@i18n';
import { async as asyncStorage } from '@services/storage';
import { getCsrfHeaders, clearCsrfToken } from '@services/csrf';
import { attachAuthHeader, handleAuthError } from './interceptors';

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

const apiClient = async (config) => {
  const {
    url,
    method = 'GET',
    body,
    headers = {},
    timeout = TIMEOUTS.API_REQUEST,
  } = config;

  // Attach auth header
  const authConfig = await attachAuthHeader({ url, method, body, headers });

  // Get CSRF headers for state-changing requests
  let csrfHeaders = {};
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    try {
      csrfHeaders = await getCsrfHeaders();
    } catch (csrfError) {
      // CSRF failures should not crash the client; continue without CSRF header.
      // Logging is intentionally omitted in services (see errors-logging.mdc).
    }
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const locale = await resolveRequestLocale();
    const response = await fetch(authConfig.url, {
      method: authConfig.method,
      credentials: 'include', // Include cookies for session
      headers: {
        'Content-Type': 'application/json',
        ...(locale ? { 'Accept-Language': locale } : {}),
        ...authConfig.headers,
        ...csrfHeaders,
      },
      body: authConfig.body ? JSON.stringify(authConfig.body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers?.get?.('content-type') || '';
    const hasJson = contentType.includes('application/json');
    
    if (!response.ok) {
      // Parse error response body
      let errorData = null;
      if (hasJson) {
        try {
          errorData = await response.json();
        } catch (e) {
          // If JSON parsing fails, continue with null
        }
      }
      
      const error = {
        status: response.status,
        statusText: response.statusText,
        message: errorData?.message || `API request failed: ${response.statusText}`,
        errors: errorData?.errors || [],
      };
      throw await handleAuthError(error);
    }

    const data = hasJson ? await response.json() : null;
    return { data, status: response.status };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw handleError(new Error('Request timeout'), { url });
    }
    throw await handleAuthError(error);
  }
};

export { apiClient };

