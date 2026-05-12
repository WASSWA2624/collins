import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvironmentFile } from './envFile.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const loadedEnvironmentFile = loadEnvironmentFile({ projectRoot });

export const DEFAULT_CORS_ORIGINS = [
  'http://localhost:8081',
  'http://localhost:19006',
  'http://localhost:3000',
];
export const DEFAULT_HOST = '0.0.0.0';

export const DEVELOPMENT_JWT_SECRET = 'development-only-change-me';

const VALID_NODE_ENVS = new Set(['development', 'test', 'production']);

export class EnvValidationError extends Error {
  constructor(errors) {
    super(`Invalid backend environment:\n- ${errors.join('\n- ')}`);
    this.name = 'EnvValidationError';
    this.errors = errors;
  }
}

const getEnv = (source, key, fallback = undefined) => {
  const value = source[key];
  if (value === undefined || value === '') return fallback;
  const normalized = String(value).trim();
  return normalized === '' ? fallback : normalized;
};

const getIntegerEnv = (source, key, fallback, { min, max }, errors) => {
  const value = getEnv(source, key);
  if (value === undefined) return fallback;
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    errors.push(`${key} must be an integer between ${min} and ${max}.`);
    return fallback;
  }

  return parsed;
};

const getBooleanEnv = (source, key, fallback, errors) => {
  const value = getEnv(source, key);
  if (value === undefined) return fallback;

  if (['true', '1'].includes(value.toLowerCase())) return true;
  if (['false', '0'].includes(value.toLowerCase())) return false;

  errors.push(`${key} must be true or false.`);
  return fallback;
};

const getTrustProxyEnv = (source, nodeEnv, errors) => {
  const value = getEnv(source, 'TRUST_PROXY');
  if (value === undefined) return nodeEnv === 'production' ? 1 : false;

  const normalized = value.toLowerCase();
  if (['true', '1'].includes(normalized)) return 1;
  if (['false', '0'].includes(normalized)) return false;

  const numericValue = Number(value);
  if (Number.isInteger(numericValue) && numericValue >= 0 && numericValue <= 5) {
    return numericValue === 0 ? false : numericValue;
  }

  errors.push('TRUST_PROXY must be false, true, or an integer between 0 and 5.');
  return nodeEnv === 'production' ? 1 : false;
};

const parseCorsOrigins = (value) => String(value || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

export const createEnv = (source = process.env) => {
  const errors = [];
  const nodeEnv = getEnv(source, 'NODE_ENV', 'development').toLowerCase();
  const apiVersion = getEnv(source, 'API_VERSION', 'v1');
  const databaseUrl = getEnv(source, 'DATABASE_URL');
  const jwtSecret = getEnv(
    source,
    'JWT_SECRET',
    nodeEnv === 'production' ? undefined : DEVELOPMENT_JWT_SECRET,
  );
  const corsOrigins = parseCorsOrigins(getEnv(source, 'CORS_ORIGIN', DEFAULT_CORS_ORIGINS.join(',')));

  if (!VALID_NODE_ENVS.has(nodeEnv)) {
    errors.push('NODE_ENV must be development, test, or production.');
  }

  if (!/^[a-z][a-z0-9_-]*$/i.test(apiVersion)) {
    errors.push('API_VERSION must be a simple path segment such as v1.');
  }

  if (!databaseUrl) {
    errors.push('DATABASE_URL is required for Prisma. Set DATABASE_URL in the selected .env.development or .env.production file.');
  }

  if (nodeEnv === 'production' && !jwtSecret) {
    errors.push('JWT_SECRET is required in production.');
  }

  if (nodeEnv === 'production' && jwtSecret === DEVELOPMENT_JWT_SECRET) {
    errors.push('JWT_SECRET must not use the development fallback in production.');
  }

  if (corsOrigins.length === 0) {
    errors.push('CORS_ORIGIN must contain at least one allowed origin.');
  }

  const port = getIntegerEnv(source, 'PORT', 3000, { min: 1, max: 65535 }, errors);
  const bcryptSaltRounds = getIntegerEnv(source, 'BCRYPT_SALT_ROUNDS', 12, { min: 4, max: 31 }, errors);
  const requestLogging = getBooleanEnv(source, 'REQUEST_LOGGING', true, errors);
  const trustProxy = getTrustProxyEnv(source, nodeEnv, errors);
  const databaseUseTextProtocol = getBooleanEnv(source, 'DATABASE_USE_TEXT_PROTOCOL', true, errors);
  const databaseDiagnosticsEnabled = getBooleanEnv(source, 'DATABASE_DIAGNOSTICS_ENABLED', false, errors);
  const defaultDatabaseConnectionLimit = nodeEnv === 'production' ? 1 : 5;
  const databaseConnectionLimit = getIntegerEnv(
    source,
    'DATABASE_CONNECTION_LIMIT',
    defaultDatabaseConnectionLimit,
    { min: 1, max: 50 },
    errors,
  );
  const databaseConnectTimeoutMs = getIntegerEnv(
    source,
    'DATABASE_CONNECT_TIMEOUT_MS',
    10000,
    { min: 1000, max: 60000 },
    errors,
  );
  const databaseAcquireTimeoutMs = getIntegerEnv(
    source,
    'DATABASE_ACQUIRE_TIMEOUT_MS',
    databaseConnectTimeoutMs,
    { min: 1000, max: 60000 },
    errors,
  );
  const databasePort = getIntegerEnv(source, 'DATABASE_PORT', undefined, { min: 1, max: 65535 }, errors);
  const host = getEnv(source, 'HOST', DEFAULT_HOST);

  if (errors.length > 0) {
    throw new EnvValidationError(errors);
  }

  return Object.freeze({
    nodeEnv,
    host,
    port,
    apiVersion,
    databaseUrl,
    databaseHost: getEnv(source, 'DATABASE_HOST'),
    databasePort,
    databaseSocketPath: getEnv(source, 'DATABASE_SOCKET_PATH', getEnv(source, 'DATABASE_SOCKET')),
    databaseUseTextProtocol,
    databaseDiagnosticsEnabled,
    databaseConnectionLimit,
    databaseConnectTimeoutMs,
    databaseAcquireTimeoutMs,
    jwtSecret,
    jwtExpiresIn: getEnv(source, 'JWT_EXPIRES_IN', '1d'),
    bcryptSaltRounds,
    corsOrigins,
    requestLogging,
    trustProxy,
  });
};

export const env = createEnv();
export const isProduction = env.nodeEnv === 'production';
