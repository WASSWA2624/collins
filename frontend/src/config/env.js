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
export const APP_VERSION = getEnvVar('EXPO_PUBLIC_APP_VERSION', '0.1.0');
export const BUILD_NUMBER = getEnvVar('EXPO_PUBLIC_BUILD_NUMBER', '0');
export const APP_ENVIRONMENT = getEnvVar('EXPO_PUBLIC_APP_ENVIRONMENT', NODE_ENV);
export const SUPPORT_EMAIL = getEnvVar('EXPO_PUBLIC_SUPPORT_EMAIL', '');
export const SUPPORT_PHONE = getEnvVar('EXPO_PUBLIC_SUPPORT_PHONE', '');

