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
  if (messageLower.includes('invalid credential')) {
    return 'INVALID_CREDENTIALS';
  }
  if (messageLower.includes('authentication required') || messageLower.includes('unauthorized')) {
    return 'UNAUTHORIZED';
  }
  if (messageLower.includes('access denied') || messageLower.includes('forbidden') || messageLower.includes('insufficient permission')) {
    return 'FORBIDDEN';
  }
  if (messageLower.includes('multiple tenant') || messageLower.includes('tenant selection')) {
    return 'MULTIPLE_TENANTS';
  }

  return 'UNKNOWN_ERROR';
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

  // If error is already normalized (has code property), return as-is
  if (error.code && typeof error.code === 'string' && error.code !== 'UNKNOWN_ERROR') {
    return error;
  }

  // Network errors (browser often throws TypeError with "Failed to fetch")
  if (
    error.name === 'NetworkError' ||
    error.message?.includes('network') ||
    (typeof error.message === 'string' && error.message.toLowerCase().includes('failed to fetch'))
  ) {
    const safeMessage = getSafeMessageForCode('NETWORK_ERROR');
    return {
      code: 'NETWORK_ERROR',
      message: safeMessage,
      safeMessage,
      severity: 'warning',
    };
  }

  // API errors
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;
    
    // Extract error code from backend message if available
    const extractedCode = error.message ? extractErrorCode(error.message) : null;
    
    if (status === 401) {
      // Prefer INVALID_CREDENTIALS for login errors, UNAUTHORIZED for general auth errors
      const code = extractedCode || 'UNAUTHORIZED';
      const safeMessage = getSafeMessageForCode(code);
      const rawMessage = error.message || safeMessage;
      return {
        code,
        message: rawMessage,
        safeMessage,
        severity: 'error',
      };
    }
    if (status === 403) {
      const code = extractedCode || 'FORBIDDEN';
      const safeMessage = getSafeMessageForCode(code);
      const rawMessage = error.message || safeMessage;
      return {
        code,
        message: rawMessage,
        safeMessage,
        severity: 'error',
      };
    }
    if (status >= 500) {
      const code = extractedCode || 'SERVER_ERROR';
      const safeMessage = getSafeMessageForCode(code);
      const rawMessage = error.message || safeMessage;
      return {
        code,
        message: rawMessage,
        safeMessage,
        severity: 'error',
      };
    }
    
    // For other status codes, use extracted code or default
    if (extractedCode && extractedCode !== 'UNKNOWN_ERROR') {
      const safeMessage = getSafeMessageForCode(extractedCode);
      const rawMessage = error.message || safeMessage;
      return {
        code: extractedCode,
        message: rawMessage,
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

