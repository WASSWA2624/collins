/**
 * API Client
 * Centralized fetch wrapper
 * File: client.js
 */
import { TIMEOUTS } from '@config';
import { handleError } from '@errors';
import { getDeviceLocale, LOCALE_STORAGE_KEY } from '@i18n';
import { async as asyncStorage } from '@services/storage';
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

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const locale = await resolveRequestLocale();
    const response = await fetch(authConfig.url, {
      method: authConfig.method,
      headers: {
        'Content-Type': 'application/json',
        ...(locale ? { 'Accept-Language': locale } : {}),
        ...authConfig.headers,
      },
      body: authConfig.body ? JSON.stringify(authConfig.body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = {
        status: response.status,
        statusText: response.statusText,
        message: `API request failed: ${response.statusText}`,
      };
      throw await handleAuthError(error);
    }

    const contentType = response.headers?.get?.('content-type') || '';
    const hasJson = contentType.includes('application/json');
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

