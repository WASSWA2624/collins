/**
 * Environment Configuration
 * Centralized environment variable access
 */

import Constants from 'expo-constants';

const DEFAULT_API_PROTOCOL = 'http';
const DEFAULT_API_PORT = '3000';
const DEFAULT_API_BASE_URL = `${DEFAULT_API_PROTOCOL}://localhost:${DEFAULT_API_PORT}`;
const UNROUTABLE_HOSTS = new Set(['', '0.0.0.0', '::', '[::]']);

const rawRuntimeEnv = typeof process === 'undefined' ? {} : process.env || {};

const stripUndefinedValues = (values) => Object.fromEntries(
  Object.entries(values).filter(([, value]) => value !== undefined),
);

const getExpoPublicEnv = () => {
  if (typeof process === 'undefined') return {};

  return stripUndefinedValues({
    EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    EXPO_PUBLIC_API_PORT: process.env.EXPO_PUBLIC_API_PORT,
    EXPO_PUBLIC_API_VERSION: process.env.EXPO_PUBLIC_API_VERSION,
    EXPO_PUBLIC_APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION,
    EXPO_PUBLIC_BUILD_NUMBER: process.env.EXPO_PUBLIC_BUILD_NUMBER,
    EXPO_PUBLIC_APP_ENVIRONMENT: process.env.EXPO_PUBLIC_APP_ENVIRONMENT,
    EXPO_PUBLIC_SUPPORT_EMAIL: process.env.EXPO_PUBLIC_SUPPORT_EMAIL,
    EXPO_PUBLIC_SUPPORT_PHONE: process.env.EXPO_PUBLIC_SUPPORT_PHONE,
  });
};

const runtimeEnv = {
  ...rawRuntimeEnv,
  ...getExpoPublicEnv(),
};

const getEnvVar = (key, defaultValue = null, source = runtimeEnv) => {
  const value = source?.[key];
  if (value === undefined) {
    if (defaultValue === null) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return defaultValue;
  }
  return value;
};

const getOptionalEnvVar = (source, key) => {
  const value = source?.[key];
  if (value === undefined || value === null) return null;

  const normalized = String(value).trim();
  return normalized || null;
};

const withoutProtocol = (value) => String(value).replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');

export const resolveHostFromUrl = (value) => {
  if (!value) return null;

  const hostWithPort = withoutProtocol(value).split('/')[0].split('?')[0];
  const host = hostWithPort.startsWith('[')
    ? hostWithPort.slice(1, hostWithPort.indexOf(']'))
    : hostWithPort.split(':')[0];
  const normalizedHost = String(host || '').trim();

  return UNROUTABLE_HOSTS.has(normalizedHost) ? null : normalizedHost;
};

const formatHostForUrl = (host) => (host.includes(':') && !host.startsWith('[') ? `[${host}]` : host);

const getRuntimeLocationHost = (runtime) => {
  const location = runtime?.location;
  return location?.host || location?.hostname || null;
};

export const resolveDevelopmentHost = (constants = Constants, runtime = globalThis) => {
  const candidates = [
    getRuntimeLocationHost(runtime),
    constants?.expoConfig?.hostUri,
    constants?.expoGoConfig?.debuggerHost,
    constants?.expoGoConfig?.hostUri,
    constants?.manifest?.debuggerHost,
    constants?.manifest?.hostUri,
    constants?.manifest?.packagerOpts?.hostUri,
    constants?.manifest?.packagerOpts?.devServerHost,
    constants?.manifest?.extra?.expoGo?.debuggerHost,
    constants?.manifest2?.extra?.expoGo?.debuggerHost,
    constants?.platform?.hostUri,
    constants?.experienceUrl,
    constants?.linkingUri,
  ];

  for (const candidate of candidates) {
    const host = resolveHostFromUrl(candidate);
    if (host) return host;
  }

  return null;
};

export const resolveApiBaseUrl = (
  source = runtimeEnv,
  constants = Constants,
  runtime = globalThis,
) => {
  const configuredUrl = getOptionalEnvVar(source, 'EXPO_PUBLIC_API_BASE_URL');
  if (configuredUrl) return configuredUrl;

  const apiPort = getOptionalEnvVar(source, 'EXPO_PUBLIC_API_PORT') || DEFAULT_API_PORT;
  const devHost = resolveDevelopmentHost(constants, runtime);

  return devHost
    ? `${DEFAULT_API_PROTOCOL}://${formatHostForUrl(devHost)}:${apiPort}`
    : DEFAULT_API_BASE_URL;
};

export const NODE_ENV = getEnvVar('NODE_ENV', 'development');
export const API_BASE_URL = resolveApiBaseUrl();
export const API_VERSION = getEnvVar('EXPO_PUBLIC_API_VERSION', 'v1');
export const APP_VERSION = getEnvVar('EXPO_PUBLIC_APP_VERSION', '1.0.0');
export const BUILD_NUMBER = getEnvVar('EXPO_PUBLIC_BUILD_NUMBER', '1');
export const APP_ENVIRONMENT = getEnvVar('EXPO_PUBLIC_APP_ENVIRONMENT', NODE_ENV);
export const SUPPORT_EMAIL = getEnvVar('EXPO_PUBLIC_SUPPORT_EMAIL', '');
export const SUPPORT_PHONE = getEnvVar('EXPO_PUBLIC_SUPPORT_PHONE', '');

