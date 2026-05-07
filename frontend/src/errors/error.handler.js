/**
 * Error Handler
 * Normalizes errors to domain-safe objects
 * File: error.handler.js
 */
import en from '@i18n/locales/en.json';
import { logger } from '@logging';

const getNestedValue = (obj, path) => {
  return String(path)
    .split('.')
    .reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), obj);
};

const getSafeMessageForCode = (code) => {
  return (
    getNestedValue(en, `errors.codes.${code}`) ||
    getNestedValue(en, 'errors.codes.UNKNOWN_ERROR') ||
    'UNKNOWN_ERROR'
  );
};

const TRANSPORT_ERROR_CODES = new Set([
  'ECONNABORTED',
  'ECONNREFUSED',
  'ECONNRESET',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'ENOTFOUND',
  'ETIMEDOUT',
]);

const STATUS_ERROR_CODES = {
  400: 'VALIDATION_ERROR',
  404: 'BACKEND_ENDPOINT_NOT_FOUND',
  405: 'BACKEND_METHOD_NOT_ALLOWED',
  408: 'REQUEST_TIMEOUT',
  413: 'PAYLOAD_TOO_LARGE',
  415: 'UNSUPPORTED_MEDIA_TYPE',
  422: 'VALIDATION_ERROR',
  429: 'RATE_LIMITED',
};

/**
 * Extract error code from backend message
 * Backend may send translation keys like "errors.auth.invalid_credentials"
 * or already translated messages like "Invalid credentials"
 */
const extractErrorCode = (message) => {
  if (!message || typeof message !== 'string') {
    return 'UNKNOWN_ERROR';
  }

  // If message is a translation key (starts with "errors.")
  if (message.startsWith('errors.')) {
    // Extract the last part as code
    // "errors.auth.invalid_credentials" -> "INVALID_CREDENTIALS"
    // "errors.auth.multiple_tenants" -> "MULTIPLE_TENANTS"
    const parts = message.split('.');
    const lastPart = parts[parts.length - 1];
    // Convert snake_case to UPPER_SNAKE_CASE
    return lastPart.toUpperCase().replace(/-/g, '_');
  }

  // Map common translated messages to codes
  const messageLower = message.toLowerCase();
  if (messageLower.includes('invalid credential') || messageLower.includes('invalid email or password')) {
    return 'INVALID_CREDENTIALS';
  }
  if (
    messageLower.includes('user with this email already exists') ||
    messageLower.includes('email already exists') ||
    messageLower.includes('email is already registered') ||
    messageLower.includes('same unique value')
  ) {
    return 'USER_EXISTS';
  }
  if (messageLower.includes('validation failed')) {
    return 'VALIDATION_ERROR';
  }
  if (messageLower.includes('authentication required') || messageLower.includes('unauthorized')) {
    return 'UNAUTHORIZED';
  }
  if (messageLower.includes('access denied') || messageLower.includes('forbidden') || messageLower.includes('insufficient permission')) {
    return 'FORBIDDEN';
  }
  if (messageLower.includes('user account is not active') || messageLower.includes('account is not active')) {
    return 'ACCOUNT_INACTIVE';
  }
  if (messageLower.includes('account has been suspended') || messageLower.includes('account suspended')) {
    return 'ACCOUNT_SUSPENDED';
  }
  if (messageLower.includes('account is pending') || messageLower.includes('pending verification')) {
    return 'ACCOUNT_PENDING';
  }
  if (messageLower.includes('multiple tenant') || messageLower.includes('tenant selection')) {
    return 'MULTIPLE_TENANTS';
  }
  if (messageLower.includes('database request failed')) {
    return 'DATABASE_ERROR';
  }
  if (messageLower.includes('cannot post') || messageLower.includes('cannot get')) {
    return 'BACKEND_ENDPOINT_NOT_FOUND';
  }
  if (messageLower.includes('too many requests') || messageLower.includes('rate limit')) {
    return 'RATE_LIMITED';
  }

  return 'UNKNOWN_ERROR';
};

const SECURE_CONNECTION_PATTERNS = [
  'certificate',
  'certpathvalidator',
  'sslhandshakeexception',
  'sslpeerunverifiedexception',
  'trust anchor',
  'tls',
];

const HOST_UNREACHABLE_PATTERNS = [
  'unable to resolve host',
  'dns',
  'enotfound',
  'ehostunreach',
  'enetunreach',
  'host unreachable',
  'no address associated with hostname',
];

const NETWORK_ERROR_PATTERNS = [
  'failed to fetch',
  'network request failed',
  'network request timed out',
  'load failed',
  'unable to resolve host',
  'connection refused',
  'connection reset',
  'connection timed out',
  'request timeout',
  'request timed out',
  'sslhandshakeexception',
  'certificate',
  'enotfound',
  'econnrefused',
  'econnreset',
  'etimedout',
  'ehostunreach',
];

const isTimeoutError = (error) => (
  error?.name === 'AbortError' ||
  error?.code === 'ECONNABORTED' ||
  error?.code === 'ETIMEDOUT' ||
  String(error?.message || '').toLowerCase().includes('timeout') ||
  String(error?.message || '').toLowerCase().includes('timed out')
);

const getErrorSearchValue = (error) => {
  const name = String(error?.name || '').toLowerCase();
  const code = String(error?.code || '').toLowerCase();
  const message = String(error?.message || '').toLowerCase();
  return `${name} ${code} ${message}`;
};

const isSecureConnectionError = (error) => {
  const value = getErrorSearchValue(error);
  return SECURE_CONNECTION_PATTERNS.some((pattern) => value.includes(pattern));
};

const isHostUnreachableError = (error) => {
  const value = getErrorSearchValue(error);
  return HOST_UNREACHABLE_PATTERNS.some((pattern) => value.includes(pattern));
};

const isNetworkConnectionError = (error) => {
  const name = String(error?.name || '').toLowerCase();
  const value = getErrorSearchValue(error);

  return name === 'networkerror' || NETWORK_ERROR_PATTERNS.some((pattern) => value.includes(pattern));
};

const getExplicitErrorCode = (error) => {
  const code = typeof error?.code === 'string' ? error.code.trim() : '';
  if (!code || code === 'UNKNOWN_ERROR' || TRANSPORT_ERROR_CODES.has(code.toUpperCase())) {
    return null;
  }
  return code;
};

const normalizeError = (error) => {
  if (!error) {
    const safeMessage = getSafeMessageForCode('UNKNOWN_ERROR');
    return {
      code: 'UNKNOWN_ERROR',
      message: safeMessage,
      safeMessage,
      severity: 'error',
    };
  }

  if (isTimeoutError(error)) {
    const safeMessage = getSafeMessageForCode('REQUEST_TIMEOUT');
    return {
      code: 'REQUEST_TIMEOUT',
      message: safeMessage,
      safeMessage,
      severity: 'warning',
    };
  }

  if (isSecureConnectionError(error)) {
    const safeMessage = getSafeMessageForCode('SECURE_CONNECTION_FAILED');
    return {
      code: 'SECURE_CONNECTION_FAILED',
      message: safeMessage,
      safeMessage,
      severity: 'error',
    };
  }

  if (isHostUnreachableError(error)) {
    const safeMessage = getSafeMessageForCode('BACKEND_HOST_UNREACHABLE');
    return {
      code: 'BACKEND_HOST_UNREACHABLE',
      message: safeMessage,
      safeMessage,
      severity: 'warning',
    };
  }

  if (isNetworkConnectionError(error)) {
    const safeMessage = getSafeMessageForCode('NETWORK_ERROR');
    return {
      code: 'NETWORK_ERROR',
      message: safeMessage,
      safeMessage,
      severity: 'warning',
    };
  }

  // If error is already normalized (has a domain code), return as-is.
  const explicitCode = getExplicitErrorCode(error);
  if (explicitCode && !error.status && !error.statusCode) {
    const safeMessage =
      typeof error.safeMessage === 'string' && error.safeMessage.trim()
        ? error.safeMessage.trim()
        : getSafeMessageForCode(explicitCode);

    const message =
      typeof error.message === 'string' && error.message.trim()
        ? error.message.trim()
        : safeMessage;

    return {
      ...error,
      code: explicitCode,
      message,
      safeMessage,
      severity: error.severity || 'error',
    };
  }

  // API errors
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;
    const apiContext = {
      status,
      statusText: error.statusText,
      errors: Array.isArray(error.errors) ? error.errors : [],
      meta: error.meta,
    };
    
    // Extract error code from backend message if available
    const extractedRaw = explicitCode || (error.message ? extractErrorCode(error.message) : null);
    const extractedCode = extractedRaw && extractedRaw !== 'UNKNOWN_ERROR' ? extractedRaw : null;
    
    if (status === 401) {
      // Prefer INVALID_CREDENTIALS for login errors, UNAUTHORIZED for general auth errors
      const code = extractedCode || 'UNAUTHORIZED';
      const safeMessage = getSafeMessageForCode(code);
      return {
        ...apiContext,
        code,
        message: safeMessage,
        safeMessage,
        severity: 'error',
      };
    }
    if (status === 403) {
      const code = extractedCode || 'FORBIDDEN';
      const safeMessage = getSafeMessageForCode(code);
      return {
        ...apiContext,
        code,
        message: safeMessage,
        safeMessage,
        severity: 'error',
      };
    }
    if (status === 409) {
      const code = extractedCode || 'CONFLICT';
      const safeMessage = getSafeMessageForCode(code);
      return {
        ...apiContext,
        code,
        message: safeMessage,
        safeMessage,
        severity: 'warning',
      };
    }
    if (status >= 500) {
      const code = extractedCode || ([502, 503, 504].includes(status) ? 'BACKEND_UNAVAILABLE' : 'SERVER_ERROR');
      const safeMessage = getSafeMessageForCode(code);
      return {
        ...apiContext,
        code,
        message: safeMessage,
        safeMessage,
        severity: 'error',
      };
    }

    const statusCode = STATUS_ERROR_CODES[status];
    if (statusCode) {
      const code = extractedCode || statusCode;
      const safeMessage = getSafeMessageForCode(code);
      return {
        ...apiContext,
        code,
        message: safeMessage,
        safeMessage,
        severity: status === 408 || status === 429 ? 'warning' : 'error',
      };
    }
    
    // For other status codes, use extracted code or default
    if (extractedCode && extractedCode !== 'UNKNOWN_ERROR') {
      const safeMessage = getSafeMessageForCode(extractedCode);
      return {
        ...apiContext,
        code: extractedCode,
        message: safeMessage,
        safeMessage,
        severity: 'error',
      };
    }
  }

  // Extract code from message if no explicit code provided
  const code = error.code || (error.message ? extractErrorCode(error.message) : 'UNKNOWN_ERROR');
  const safeMessage = getSafeMessageForCode(code);
  const rawMessage =
    typeof error.message === 'string' && error.message.trim()
      ? error.message.trim()
      : safeMessage;

  // Default
  return {
    code,
    message: rawMessage,
    safeMessage,
    severity: error.severity || 'error',
  };
};

const handleError = (error, context = {}) => {
  const normalized = normalizeError(error);
  logger.error('Handled error', {
    code: normalized.code,
    severity: normalized.severity,
    context: context && typeof context === 'object' ? context : {},
  });
  return normalized;
};

export { normalizeError, handleError };

