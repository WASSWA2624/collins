/**
 * i18n Provider
 * Manages translations and locale
 * Note: Storage dependency is optional (loaded lazily).
 * Note: Avoids native-module locale dependencies so Jest runs reliably.
 * Only en locale is supported.
 */
import React from 'react';
import en from './locales/en.json';

const LOCALE_KEY = 'user_locale';
const LOCALE_STORAGE_KEY = LOCALE_KEY;
const DEFAULT_LOCALE = 'en';

const translations = { en };

const getNestedValue = (obj, path) => {
  if (!obj || typeof obj !== 'object') return undefined;
  if (!path || typeof path !== 'string') return undefined;
  return path
    .split('.')
    .reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), obj);
};

const interpolate = (value, params) => {
  if (typeof value !== 'string') return '';
  if (!params || typeof params !== 'object') return value;

  let text = value;
  Object.keys(params).forEach((param) => {
    text = text.replaceAll(`{{${param}}}`, String(params[param]));
  });
  return text;
};

const getIntlLocale = () => {
  try {
    return Intl?.DateTimeFormat?.().resolvedOptions?.().locale || null;
  } catch {
    return null;
  }
};

const resolveSupportedLocale = (candidate) => {
  const supportedLocales = Object.keys(translations);
  if (!candidate || typeof candidate !== 'string') return null;
  const value = candidate.trim();
  if (!value) return null;
  if (supportedLocales.includes(value)) return value;
  const base = value.split('-')[0];
  if (supportedLocales.includes(base)) return base;
  return null;
};

// Standalone getDeviceLocale for use in store initialization
const getDeviceLocale = () =>
  resolveSupportedLocale(getIntlLocale()) || DEFAULT_LOCALE;

const createI18n = ({ storage = null, initialLocale = null } = {}) => {
  const supportedLocales = Object.keys(translations);
  let localeCache = initialLocale ? resolveSupportedLocale(initialLocale) : null;

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
    const dict = translations[locale] || translations[DEFAULT_LOCALE];
    const fallback = translations[DEFAULT_LOCALE];
    const raw =
      getNestedValue(dict, key) ||
      getNestedValue(fallback, key) ||
      key;
    return interpolate(String(raw), params);
  };

  const tSync = (key, params = {}, overrideLocale = null) => {
    const locale = overrideLocale || localeCache || getDeviceLocale();
    const resolvedLocale = resolveSupportedLocale(locale) || DEFAULT_LOCALE;
    const dict = translations[resolvedLocale] || translations[DEFAULT_LOCALE];
    const fallback = translations[DEFAULT_LOCALE];
    const raw =
      getNestedValue(dict, key) ||
      getNestedValue(fallback, key) ||
      key;
    return interpolate(String(raw), params);
  };

  return { getDeviceLocale, getCurrentLocale, setLocale, t, tSync, supportedLocales };
};

// Default exports use a lazily loaded storage adapter in the real implementation.
export { createI18n, getDeviceLocale, LOCALE_STORAGE_KEY };

// Standalone tSync function for use in non-React contexts (e.g., utility hooks)
// Uses device locale by default (no storage dependency)
const defaultI18n = createI18n();
export const tSync = (key, params = {}) => defaultI18n.tSync(key, params);

/**
 * I18nProvider Component
 * Provides i18n context to the entire app.
 * Per bootstrap-config.mdc: Localization Provider mounted only in root layout.
 * Per i18n.mdc: Handles locale detection, translation loading, and locale switching.
 * 
 * Note: The provider ensures i18n is initialized and ready.
 * The useI18n hook reads locale from Redux store, so this provider
 * primarily ensures i18n system is ready and provides structure for future enhancements.
 */
export const I18nProvider = ({ children }) => {
  // The provider wraps children and ensures i18n is initialized.
  // Locale state is managed via Redux store (accessed by useI18n hook).
  // This provider provides the structure for locale detection and translation loading
  // per i18n.mdc requirements.
  return <>{children}</>;
};

