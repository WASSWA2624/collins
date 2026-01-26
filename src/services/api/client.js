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
  // #region agent log
  fetch('http://127.0.0.1:7251/ingest/1d28b85e-4e80-4cd6-84bc-0a14f3ba6cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'client.js:33',message:'api_client_enter',data:{url,method,hasBody:Boolean(body),timeout},timestamp:Date.now(),sessionId:'debug-session',runId:'login-redirect',hypothesisId:'H6'})}).catch(()=>{});
  // #endregion agent log

  // Attach auth header
  const authConfig = await attachAuthHeader({ url, method, body, headers });
  // #region agent log
  fetch('http://127.0.0.1:7251/ingest/1d28b85e-4e80-4cd6-84bc-0a14f3ba6cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'client.js:37',message:'api_client_auth_config',data:{url:authConfig?.url,method:authConfig?.method,hasHeaders:Boolean(authConfig?.headers)},timestamp:Date.now(),sessionId:'debug-session',runId:'login-redirect',hypothesisId:'H7'})}).catch(()=>{});
  // #endregion agent log

  // Get CSRF headers for state-changing requests
  let csrfHeaders = {};
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    try {
      csrfHeaders = await getCsrfHeaders();
    } catch (csrfError) {
      console.error('[API] Failed to get CSRF token, continuing without it:', csrfError);
      // For now, continue without CSRF token to allow development
      // In production, you may want to throw here
    }
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const locale = await resolveRequestLocale();
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/1d28b85e-4e80-4cd6-84bc-0a14f3ba6cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'client.js:45',message:'api_client_before_fetch',data:{url:authConfig?.url,locale},timestamp:Date.now(),sessionId:'debug-session',runId:'login-redirect',hypothesisId:'H8'})}).catch(()=>{});
    // #endregion agent log
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
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/1d28b85e-4e80-4cd6-84bc-0a14f3ba6cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'client.js:58',message:'api_client_response',data:{status:response?.status,ok:response?.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'login-redirect',hypothesisId:'H9'})}).catch(()=>{});
    // #endregion agent log

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
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/1d28b85e-4e80-4cd6-84bc-0a14f3ba6cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'client.js:86',message:'api_client_error',data:{name:error?.name || null,message:typeof error?.message === 'string' ? error.message.slice(0,120) : null},timestamp:Date.now(),sessionId:'debug-session',runId:'login-redirect',hypothesisId:'H8'})}).catch(()=>{});
    // #endregion agent log
    if (error.name === 'AbortError') {
      throw handleError(new Error('Request timeout'), { url });
    }
    throw await handleAuthError(error);
  }
};

export { apiClient };

