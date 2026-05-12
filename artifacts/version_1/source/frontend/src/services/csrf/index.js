/**
 * CSRF Token Service
 * Manages CSRF token fetching and caching
 * File: index.js
 */
import { endpoints } from '@config/endpoints';

let cachedToken = null;
let tokenFetchPromise = null;

const CSRF_HEADER = 'x-csrf-token';

/**
 * Fetch CSRF token from server
 * @returns {Promise<string>} CSRF token
 */
const fetchCsrfToken = async () => {
  try {
    const url = endpoints.AUTH.CSRF_TOKEN;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // Include cookies for session
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const token = result?.data?.csrfToken || result?.data?.token;

    if (!token) {
      throw new Error('CSRF token missing from response');
    }

    cachedToken = token;
    return token;
  } catch (error) {
    throw error;
  }
};

/**
 * Get CSRF token, fetching if necessary
 * Uses caching and deduplication to avoid multiple requests
 * @returns {Promise<string>} CSRF token
 */
const getCsrfToken = async () => {
  // Return cached token if available
  if (cachedToken) {
    return cachedToken;
  }

  // Return existing fetch promise to deduplicate requests
  if (tokenFetchPromise) {
    return tokenFetchPromise;
  }

  // Start new fetch and cache the promise
  tokenFetchPromise = fetchCsrfToken()
    .finally(() => {
      tokenFetchPromise = null; // Clear promise after resolution
    });

  return tokenFetchPromise;
};

/**
 * Clear cached CSRF token
 * Call this after logout or session expiry
 */
const clearCsrfToken = () => {
  cachedToken = null;
  tokenFetchPromise = null;
};

/**
 * Get CSRF headers for API requests
 * @returns {Promise<Object>} Headers object with CSRF token
 */
const getCsrfHeaders = async () => {
  try {
    const token = await getCsrfToken();
    return {
      [CSRF_HEADER]: token,
    };
  } catch (error) {
    // Don't silently fail - let the caller know
    throw error;
  }
};

export {
  getCsrfToken,
  getCsrfHeaders,
  clearCsrfToken,
  CSRF_HEADER,
};
