# Phase 1: Foundation Layer

## Purpose
Build the foundation layer: configuration, utilities, logging, and error handling. Follows rules in `.cursor/rules/`.

## Prerequisites
- Phase 0 completed
- All folders created
- Dependencies installed

## Steps

### Step 1.1: Create Environment Configuration
**Goal**: Create environment variable access module

**Actions**:
1. Create `src/config/env.js`:
   ```javascript
   /**
    * Environment Configuration
    * Centralized environment variable access
    */
   
   const getEnvVar = (key, defaultValue = null) => {
     const value = process.env[key];
     if (value === undefined) {
       if (defaultValue === null) {
         throw new Error(`Missing required environment variable: ${key}`);
       }
       return defaultValue;
     }
     return value;
   };
   
   export const NODE_ENV = getEnvVar('NODE_ENV', 'development');
   export const API_BASE_URL = getEnvVar('EXPO_PUBLIC_API_BASE_URL', 'http://localhost:3000');
   export const API_VERSION = getEnvVar('EXPO_PUBLIC_API_VERSION', 'v1');
   ```

**Notes (Security/Config)**:
- Treat all client-side environment values as **public**. Use env vars for **non-sensitive configuration only** (e.g. base URLs).
- **Never ship secrets** via env vars or build-time config (see `.cursor/rules/security.mdc` and `.cursor/rules/bootstrap-config.mdc`).

**Tests**: Create `src/__tests__/config/env.test.js`
- Test env variable access with defaults
- Test missing required env variable throws error
- Test env variable retrieval

**Rule Reference**: `.cursor/rules/project-structure.mdc`, `.cursor/rules/bootstrap-config.mdc`, `.cursor/rules/security.mdc`, `.cursor/rules/coding-conventions.mdc`

---

### Step 1.2: Create Application Constants
**Goal**: Create application constants module

**Actions**:
1. Create `src/config/constants.js`:
   ```javascript
   /**
    * Application Constants
    */
   
   export const PAGINATION = {
     DEFAULT_PAGE: 1,
     DEFAULT_LIMIT: 20,
     MAX_LIMIT: 100,
   };
   
   export const TIMEOUTS = {
     API_REQUEST: 30000,
     NETWORK_CHECK: 5000,
   };
   ```

**Tests**: Create `src/__tests__/config/constants.test.js`
- Test constants are exported correctly
- Test constant values are correct

**Rule Reference**: `.cursor/rules/project-structure.mdc`, `.cursor/rules/coding-conventions.mdc`

---

### Step 1.3: Create API Endpoints Registry
**Goal**: Create API endpoints configuration module

**Actions**:
1. Create `src/config/endpoints.js`:
   ```javascript
   /**
    * API Endpoints Registry
    */
   import { API_BASE_URL, API_VERSION } from '@config/env';
   
   const normalizeBaseUrl = (value) => String(value || '').replace(/\/+$/, '');
   const baseUrl = `${normalizeBaseUrl(API_BASE_URL)}/api/${API_VERSION}`;
   
   export const endpoints = {
     // Endpoint groups will be added when implementing app-specific features
    // Example structure (to be implemented in Phase 10+):
     // AUTH: {
     //   LOGIN: `${baseUrl}/auth/login`,
     //   REGISTER: `${baseUrl}/auth/register`,
     // },
   };
   ```

**Tests**: Create `src/__tests__/config/endpoints.test.js`
- Test endpoints construction
- Test base URL normalization
- Test endpoint paths are correct

**Rule Reference**: `.cursor/rules/project-structure.mdc`, `.cursor/rules/coding-conventions.mdc`

---

### Step 1.4: Create Feature Flags
**Goal**: Create feature flags configuration module

**Actions**:
1. Create `src/config/feature.flags.js`:
   ```javascript
   /**
    * Feature Flags
    */
   
   export const OFFLINE_MODE = true;
   export const ANALYTICS_ENABLED = false;
   ```

**Tests**: Create `src/__tests__/config/feature.flags.test.js`
- Test feature flags are exported correctly
- Test feature flag values

**Rule Reference**: `.cursor/rules/project-structure.mdc`, `.cursor/rules/coding-conventions.mdc`

---

### Step 1.5: Create Config Barrel Export
**Goal**: Create barrel export for config module

**Actions**:
1. Create `src/config/index.js` (barrel):
   ```javascript
   /**
    * Config Barrel Export
    */
   export * from './env';
   export * from './constants';
   export { endpoints } from './endpoints';
   export * as featureFlags from './feature.flags';
   ```

**Tests**: Create `src/__tests__/config/index.test.js`
- Test all config exports are available
- Test barrel export structure

**Rule Reference**: `.cursor/rules/project-structure.mdc`, `.cursor/rules/coding-conventions.mdc`

---

### Step 1.6: Create Formatting Utilities
**Goal**: Create pure formatting utility functions

**Actions**:
1. Create `src/utils/formatter.js`:
   ```javascript
   /**
    * Formatting Utilities
    * Pure functions for data formatting
    */
   
   const formatDate = (date, locale = 'en-US', options = {}) => {
     if (!date) return '';
     const timeZone = options.timeZone || 'UTC';
     const parsed = new Date(date);
     if (Number.isNaN(parsed.getTime())) return '';
     return new Intl.DateTimeFormat(locale, { timeZone }).format(parsed);
   };
   
   const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
     if (typeof amount !== 'number') return '';
     return new Intl.NumberFormat(locale, {
       style: 'currency',
       currency,
     }).format(amount);
   };
   
   const formatNumber = (number, locale = 'en-US') => {
     if (typeof number !== 'number') return '';
     return new Intl.NumberFormat(locale).format(number);
   };
   
   export { formatDate, formatCurrency, formatNumber };
   ```

**Tests**: Create `src/__tests__/utils/formatter.test.js`
- Test all formatting functions
- Test edge cases (null, undefined, invalid inputs)
- Ensure pure functions (no side effects)

**Rule Reference**: `.cursor/rules/hooks-utils.mdc`, `.cursor/rules/core-principles.mdc`

---

### Step 1.7: Create Validation Utilities
**Goal**: Create pure validation utility functions

**Actions**:
1. Create `src/utils/validator.js`:
   ```javascript
   /**
    * Validation Utilities
    * Pure validation functions
    */
   
   const isValidEmail = (email) => {
     if (!email || typeof email !== 'string') return false;
     const value = email.trim();
     if (!value) return false;
     if (value.includes('..')) return false;
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(value);
   };
   
   const isValidUrl = (url) => {
     if (!url || typeof url !== 'string') return false;
     try {
       const parsed = new URL(url);
       return parsed.protocol === 'http:' || parsed.protocol === 'https:';
     } catch {
       return false;
     }
   };
   
   export { isValidEmail, isValidUrl };
   ```

**Tests**: Create `src/__tests__/utils/validator.test.js`
- Test all validation functions
- Test edge cases (null, undefined, invalid inputs)
- Ensure pure functions (no side effects)

**Rule Reference**: `.cursor/rules/hooks-utils.mdc`, `.cursor/rules/core-principles.mdc`

---

### Step 1.8: Create Helper Utilities
**Goal**: Create generic helper utility functions

**Actions**:
1. Create `src/utils/helpers.js`:
   ```javascript
   /**
    * Helper Utilities
    * Generic helper functions (pure, stateless, deterministic)
    */
   
   const clamp = (value, min, max) => {
     if (typeof value !== 'number') return min;
     if (typeof min !== 'number') return value;
     if (typeof max !== 'number') return value;
     return Math.min(Math.max(value, min), max);
   };
   
   const normalizeWhitespace = (value) => {
     if (typeof value !== 'string') return '';
     return value.trim().replace(/\s+/g, ' ');
   };
   
   const safeJsonParse = (value, fallback = null) => {
     if (typeof value !== 'string') return fallback;
     try {
       return JSON.parse(value);
     } catch {
       return fallback;
     }
   };
   
   export { clamp, normalizeWhitespace, safeJsonParse };
   ```

**Tests**: Create `src/__tests__/utils/helpers.test.js`
- Test all helper functions
- Test edge cases (null, undefined, invalid inputs)
- Ensure pure functions (no side effects)

**Rule Reference**: `.cursor/rules/hooks-utils.mdc`, `.cursor/rules/core-principles.mdc`

---

### Step 1.9: Create Utils Barrel Export
**Goal**: Create barrel export for utils module

**Actions**:
1. Create `src/utils/index.js` (barrel):
   ```javascript
   /**
    * Utils Barrel Export
    */
   export * from './formatter';
   export * from './validator';
   export * from './helpers';
   ```

**Tests**: Create `src/__tests__/utils/index.test.js`
- Test all utils exports are available
- Test barrel export structure

**Rule Reference**: `.cursor/rules/hooks-utils.mdc`, `.cursor/rules/core-principles.mdc`

---

### Step 1.10: Create Log Levels
**Goal**: Define log level constants

**Actions**:
1. Create `src/logging/levels.js`:
   ```javascript
   /**
    * Log Levels
    */
   
   export const DEBUG = 'debug';
   export const INFO = 'info';
   export const WARN = 'warn';
   export const ERROR = 'error';
   export const FATAL = 'fatal';
   ```

**Tests**: Create `src/__tests__/logging/levels.test.js`
- Test all log levels are exported
- Test log level values

**Rule Reference**: `.cursor/rules/errors-logging.mdc`

---

### Step 1.11: Create Logger Implementation
**Goal**: Create centralized logger with levels

**Actions**:
1. Create `src/logging/logger.js`:
   ```javascript
   /**
    * Logger Implementation
    * Centralized logging with levels
    */
   import { NODE_ENV } from '@config';
   import { DEBUG, INFO, WARN, ERROR, FATAL } from './levels';
   
   const log = (level, message, data = {}) => {
     if (NODE_ENV === 'production' && level === DEBUG) {
       return;
     }
   
     const timestamp = new Date().toISOString();
     const logEntry = {
       timestamp,
       level,
       message,
       ...data,
     };
   
     // In production, send to monitoring service
     // For now, console logging
     console[level === FATAL ? 'error' : level](JSON.stringify(logEntry));
   };
   
   const logger = {
     debug: (message, data) => log(DEBUG, message, data),
     info: (message, data) => log(INFO, message, data),
     warn: (message, data) => log(WARN, message, data),
     error: (message, data) => log(ERROR, message, data),
     fatal: (message, data) => log(FATAL, message, data),
   };
   
   export { logger };
   ```

**Tests**: Create `src/__tests__/logging/logger.test.js`
- Test all logger methods
- Test production filtering (DEBUG filtered in production)
- Test log structure
- Test log timestamp

**Rule Reference**: `.cursor/rules/errors-logging.mdc`

---

### Step 1.12: Create Logging Barrel Export
**Goal**: Create barrel export for logging module

**Actions**:
1. Create `src/logging/index.js` (barrel):
   ```javascript
   /**
    * Logging Barrel Export
    */
   export { logger } from './logger';
   export * from './levels';
   ```

**Tests**: Create `src/__tests__/logging/index.test.js`
- Test all logging exports are available
- Test barrel export structure

**Rule Reference**: `.cursor/rules/errors-logging.mdc`

---

### Step 1.13: Create Error Handler
**Goal**: Create error normalization and handling logic

**Actions**:
1. Create `src/errors/error.handler.js`:
   ```javascript
   /**
    * Error Handler
    * Normalizes errors to domain-safe objects
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
   
     // Network errors
     if (error.name === 'NetworkError' || error.message?.includes('network')) {
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
       if (status === 401) {
         const safeMessage = getSafeMessageForCode('UNAUTHORIZED');
         return {
           code: 'UNAUTHORIZED',
           message: safeMessage,
           safeMessage,
           severity: 'error',
         };
       }
       if (status === 403) {
         const safeMessage = getSafeMessageForCode('FORBIDDEN');
         return {
           code: 'FORBIDDEN',
           message: safeMessage,
           safeMessage,
           severity: 'error',
         };
       }
       if (status >= 500) {
         const safeMessage = getSafeMessageForCode('SERVER_ERROR');
         return {
           code: 'SERVER_ERROR',
           message: safeMessage,
           safeMessage,
           severity: 'error',
         };
       }
     }
   
     // Default
     const code = error.code || 'UNKNOWN_ERROR';
     const safeMessage = getSafeMessageForCode(code);
     return {
       code,
       message:
         typeof error.message === 'string' && error.message.trim()
           ? error.message.trim()
           : safeMessage,
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
   ```

**Tests**: Create `src/__tests__/errors/error.handler.test.js`
- Test error normalization
- Test error handler
- Test all error types (network, API, unknown)
- Test error code mapping

**Rule Reference**: `.cursor/rules/errors-logging.mdc`

---

### Step 1.14: Create Fallback UI Component
**Goal**: Create generic error fallback UI component

**Actions**:
1. Create `src/errors/fallback.ui.jsx`:
   **Note**: Uses `.jsx` extension because it's a React component that returns JSX
   ```javascript
   /**
    * Fallback UI Component
    * Generic error fallback (minimal, theme-driven; strings sourced from i18n)
    */
   import React from 'react';
   import styled from 'styled-components/native';
   import en from '@i18n/locales/en.json';
   
   const getNestedValue = (obj, path) => {
     return String(path)
       .split('.')
       .reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), obj);
   };
   
   const getText = (key, fallback) => getNestedValue(en, key) || fallback;
   
   const Container = styled.View`
     flex: 1;
     align-items: center;
     justify-content: center;
     padding: ${({ theme }) => theme.spacing.lg}px;
     background-color: ${({ theme }) => theme.colors.background.primary};
   `;
   
   const Title = styled.Text`
     font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
     color: ${({ theme }) => theme.colors.textPrimary ?? theme.colors.text?.primary ?? theme.colors.textPrimary};
     margin-bottom: ${({ theme }) => theme.spacing.sm}px;
     text-align: center;
   `;
   
   const Message = styled.Text`
     font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
     color: ${({ theme }) => theme.colors.textSecondary ?? theme.colors.text?.secondary ?? theme.colors.textSecondary};
     margin-bottom: ${({ theme }) => theme.spacing.md}px;
     text-align: center;
   `;
   
   const RetryButton = styled.Pressable`
     background-color: ${({ theme }) => theme.colors.primary};
     padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
     border-radius: ${({ theme }) => theme.radius.md}px;
   `;
   
   const RetryText = styled.Text`
     color: ${({ theme }) => theme.colors.onPrimary};
   `;
   
   const FallbackUI = ({ error, onRetry }) => {
     const title = getText('errors.fallback.title', 'Something went wrong');
     const message = error?.safeMessage || getText('errors.fallback.message', 'An unexpected error occurred');
     const retry = getText('errors.fallback.retry', 'Retry');
     const retryHint = getText('errors.fallback.retryHint', 'Try again');
     return (
       <Container>
         <Title accessibilityRole="header">{title}</Title>
         <Message>{message}</Message>
         {onRetry && (
           <RetryButton
             onPress={onRetry}
             accessibilityRole="button"
             accessibilityLabel={retry}
             accessibilityHint={retryHint}
           >
             <RetryText>{retry}</RetryText>
           </RetryButton>
         )}
       </Container>
     );
   };
   
   export default FallbackUI;
   ```

**Tests**: Create `src/__tests__/errors/fallback.ui.test.js`
- Test component renders
- Test error message display
- Test retry button functionality
- Test i18n text usage

**Rule Reference**: `.cursor/rules/errors-logging.mdc`, `.cursor/rules/i18n.mdc`

---

### Step 1.15: Create Error Boundary Component
**Goal**: Create React ErrorBoundary component

**Actions**:
1. Create `src/errors/ErrorBoundary.jsx`:
   **Note**: Uses `.jsx` extension because it's a React component that returns JSX
   ```javascript
   /**
    * Error Boundary Component
    * Catches React rendering errors
    */
   import React from 'react';
   import { logger } from '@logging';
   import { handleError } from './error.handler';
   import FallbackUI from './fallback.ui';
   
   class ErrorBoundary extends React.Component {
     constructor(props) {
       super(props);
       this.state = { hasError: false, error: null };
     }
   
     static getDerivedStateFromError(error) {
       return { hasError: true, error };
     }
   
     componentDidCatch(error, errorInfo) {
       const normalized = handleError(error, { errorInfo });
       logger.error('ErrorBoundary caught error', {
         error: normalized,
         errorInfo,
       });
     }
   
     render() {
       if (this.state.hasError) {
         return (
           <FallbackUI
             error={this.state.error}
             onRetry={() => this.setState({ hasError: false, error: null })}
           />
         );
       }
   
       return this.props.children;
     }
   }
   
   export default ErrorBoundary;
   ```

**Tests**: Create `src/__tests__/errors/ErrorBoundary.test.js`
- Test ErrorBoundary catches errors
- Test fallback UI displays on error
- Test error logging
- Test retry functionality

**Rule Reference**: `.cursor/rules/errors-logging.mdc`

---

### Step 1.16: Create Errors Barrel Export
**Goal**: Create barrel export for errors module

**Actions**:
1. Create `src/errors/index.js` (barrel):
   ```javascript
   /**
    * Errors Barrel Export
    */
   export { default as ErrorBoundary } from './ErrorBoundary';
   export { handleError, normalizeError } from './error.handler';
   export { default as FallbackUI } from './fallback.ui';
   ```

**Tests**: Create `src/__tests__/errors/index.test.js`
- Test all errors exports are available
- Test barrel export structure

**Rule Reference**: `.cursor/rules/errors-logging.mdc`

---

### Step 1.17: Create i18n System
**Goal**: Internationalization and localization setup with **100% coverage enforcement**

**Actions**:
1. Create `src/i18n/index.js`:
   ```javascript
   /**
    * i18n Provider
    * Manages translations and locale
    * Note: Storage dependency is optional (loaded lazily).
    * Note: Avoids native-module locale dependencies so Jest runs reliably.
    */
   import en from './locales/en.json';
   
   // NOTE: During development, only 'en' locale is created.
   // All other locales (zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, pcm, mr, te, tr, ta, yue, vi, sw, lg)
  // will be created in Phase 13 (Finalization) after the English locale is complete.
   // This ensures 'en' is the first and complete locale that all other locales build upon.
   
   const LOCALE_KEY = 'user_locale';
   const DEFAULT_LOCALE = 'en';
   
  const translations = { en };
  const supportedLocales = Object.keys(translations);
  
  const getIntlLocale = () => {
    try {
      return Intl?.DateTimeFormat?.().resolvedOptions?.().locale || null;
    } catch {
      return null;
    }
  };
  
  const resolveSupportedLocale = (candidate) => {
    if (!candidate || typeof candidate !== 'string') return null;
    const value = candidate.trim();
    if (!value) return null;
    if (supportedLocales.includes(value)) return value;
    const base = value.split('-')[0];
    if (supportedLocales.includes(base)) return base;
    return null;
  };
  
  // Export standalone getDeviceLocale for synchronous use (e.g., store initialization)
  const getDeviceLocale = () =>
    resolveSupportedLocale(getIntlLocale()) || DEFAULT_LOCALE;
  
  const createI18n = ({ storage = null } = {}) => {
    let localeCache = null;
   
     const getCurrentLocale = async () => {
       if (localeCache) return localeCache;
       const saved = storage ? await storage.getItem(LOCALE_KEY) : null;
       localeCache = resolveSupportedLocale(saved) || getDeviceLocale();
       return localeCache;
     };
   
     const setLocale = async (locale) => {
       const resolved = resolveSupportedLocale(locale);
       if (!resolved) throw new Error(`Unsupported locale: ${locale}`);
       localeCache = resolved;
       if (storage) await storage.setItem(LOCALE_KEY, resolved);
     };
   
     const t = async (key, params = {}) => {
       const locale = await getCurrentLocale();
       // ... lookup nested keys and interpolate params ...
       return key;
     };
   
     return { getDeviceLocale, getCurrentLocale, setLocale, t, supportedLocales };
   };
   
  // Default exports use a lazily loaded storage adapter in the real implementation.
  export { createI18n, getDeviceLocale };
   ```

2. Create `src/i18n/locales/en.json`:
   ```json
   {
     "common": {
       "save": "Save",
       "cancel": "Cancel",
       "delete": "Delete",
       "edit": "Edit",
       "search": "Search",
       "loading": "Loading...",
       "error": "Error",
       "retry": "Retry"
     },
     "errors": {
       "fallback": {
         "title": "Something went wrong",
         "message": "An unexpected error occurred",
         "retry": "Retry",
         "retryHint": "Try again"
       },
       "codes": {
         "UNKNOWN_ERROR": "An unexpected error occurred",
         "NETWORK_ERROR": "Network connection error",
         "UNAUTHORIZED": "Unauthorized",
         "FORBIDDEN": "Access denied",
         "SERVER_ERROR": "Server error"
       }
     }
   }
   ```
   **CRITICAL**: During development, **only the English (`en.json`) locale file is created**. This ensures that:
   - The English locale is the first and complete locale
   - All translation keys are established in English first
  - All other locales will be created in Phase 13 (Finalization) and will build upon the complete English locale
   
  **Note**: The app will eventually support 22 languages per `.cursor/rules/i18n.mdc`, but during development phases (1-12), only `en.json` is maintained. All other locale files will be created in Phase 13.

**Tests**: Create `src/__tests__/i18n/index.test.js`

**Rule Reference**: `.cursor/rules/i18n.mdc`

**Note**: Full i18n hook will be created in Phase 5 (Reusable Hooks layer)

**100% Internationalization Enforcement**:
- From this point forward, ALL UI components MUST use i18n for all user-facing text
- NO hardcoded strings are allowed in UI code
- All new features must include translations in the `en.json` locale file
- Code reviews must verify i18n compliance (all strings use i18n, no hardcoded text)
- **During development (Phases 1-12)**: Only `en.json` is maintained. All other locales will be created in Phase 13.
- See `.cursor/rules/i18n.mdc` for complete requirements

---

## Completion Criteria
- ✅ Config layer complete with env, constants, endpoints, feature flags
- ✅ Utils layer complete with formatter, validator, helpers
- ✅ Logging layer complete with levels and logger
- ✅ Error handling layer complete with handler, boundary, fallback UI
- ✅ i18n system complete with locale detection and translation support
- ✅ All tests written and passing
- ✅ All barrel exports created
- ✅ No dependencies on other layers (foundation is independent)

**Next Phase**: `P002_infrastructure.md`
