import { existsSync } from 'node:fs';
import { URL } from 'node:url';
import * as mariadb from 'mariadb';

const SUPPORTED_DATABASE_PROTOCOLS = new Set(['mysql:', 'mariadb:']);
const LOCAL_DATABASE_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
const LOCAL_SOCKET_PATHS = [
  '/var/lib/mysql/mysql.sock',
  '/var/run/mysqld/mysqld.sock',
  '/var/run/mysql/mysql.sock',
  '/run/mysqld/mysqld.sock',
  '/usr/local/mysql/mysql.sock',
  '/usr/local/mysql/tmp/mysql.sock',
  '/tmp/mysql.sock',
];

const getUrlSocketPath = (url) => (
  url.searchParams.get('socketPath')
  || url.searchParams.get('socket')
  || undefined
);

const findLocalSocketPath = (hostname) => {
  if (!LOCAL_DATABASE_HOSTS.has(hostname)) return undefined;
  return LOCAL_SOCKET_PATHS.find((socketPath) => existsSync(socketPath));
};

const unique = (items) => [...new Set(items.filter(Boolean))];

const getLocalHostCandidates = (hostname) => {
  if (!LOCAL_DATABASE_HOSTS.has(hostname)) return [hostname];

  return unique([
    '127.0.0.1',
    hostname,
    'localhost',
  ]);
};

const getValidatedDatabaseUrl = (databaseUrl) => {
  const url = new URL(databaseUrl);

  if (!SUPPORTED_DATABASE_PROTOCOLS.has(url.protocol)) {
    throw new Error('DATABASE_URL must use a mysql:// or mariadb:// connection string.');
  }

  return url;
};

const getValidatedPort = (url, options = {}) => {
  const port = Number(options.port ?? (url.port || 3306));

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Database port must be an integer between 1 and 65535.');
  }

  return port;
};

const getDatabaseName = (url) => {
  const database = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
  if (!database) {
    throw new Error('DATABASE_URL must include a database name.');
  }

  return database;
};

const getBaseConnectionConfig = (url, options = {}) => ({
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: getDatabaseName(url),
  connectionLimit: options.connectionLimit ?? 5,
  connectTimeout: options.connectTimeoutMs ?? 10000,
  acquireTimeout: options.acquireTimeoutMs ?? options.connectTimeoutMs ?? 10000,
});

export const createMariaDbConnectionConfigs = (databaseUrl, options = {}) => {
  const url = getValidatedDatabaseUrl(databaseUrl);
  const port = getValidatedPort(url, options);
  const baseConfig = getBaseConnectionConfig(url, options);
  const configs = [];
  const explicitSocketPath = options.socketPath || getUrlSocketPath(url);
  const socketPath = explicitSocketPath || (options.host ? undefined : findLocalSocketPath(url.hostname));

  if (socketPath) {
    configs.push({ ...baseConfig, socketPath });
  }

  const hostCandidates = options.host
    ? [options.host]
    : getLocalHostCandidates(url.hostname);

  hostCandidates.forEach((host) => {
    configs.push({ ...baseConfig, host, port });
  });

  return configs;
};

export const createMariaDbAdapterConfig = (databaseUrl, options = {}) => (
  createMariaDbConnectionConfigs(databaseUrl, options)[0]
);

export const sanitizeMariaDbConnectionConfig = (config) => {
  const safeConfig = { ...config };
  delete safeConfig.password;
  return safeConfig;
};

export const summarizeDatabaseUrl = (databaseUrl) => {
  const url = getValidatedDatabaseUrl(databaseUrl);

  return {
    protocol: url.protocol.replace(/:$/, ''),
    user: decodeURIComponent(url.username),
    host: url.hostname,
    port: getValidatedPort(url),
    database: getDatabaseName(url),
    hasPassword: Boolean(url.password),
    queryKeys: [...url.searchParams.keys()],
  };
};

export const sanitizeDatabaseError = (error) => ({
  name: error?.name,
  code: error?.code,
  errno: error?.errno,
  sqlState: error?.sqlState,
  fatal: error?.fatal,
  message: error?.message,
});

export const sanitizeDatabaseAttempt = ({ config, error, elapsedMs }) => ({
  config: sanitizeMariaDbConnectionConfig(config),
  error: sanitizeDatabaseError(error),
  elapsedMs,
});

export const testMariaDbConnection = async (config) => {
  const connection = await mariadb.createConnection({
    ...config,
    connectionLimit: 1,
  });

  try {
    await connection.query('SELECT 1');
  } finally {
    await connection.end();
  }
};

export const checkMariaDbConnection = async (databaseUrl, options = {}) => {
  const configs = createMariaDbConnectionConfigs(databaseUrl, {
    ...options,
    connectionLimit: 1,
  });
  const errors = [];

  for (const config of configs) {
    const startedAt = Date.now();
    try {
      await testMariaDbConnection(config);
      return {
        status: 'connected',
        config,
        elapsedMs: Date.now() - startedAt,
        attemptedConfigs: configs,
        attempts: [{
          config,
          elapsedMs: Date.now() - startedAt,
        }],
      };
    } catch (error) {
      errors.push({
        config,
        error,
        elapsedMs: Date.now() - startedAt,
      });
    }
  }

  return {
    status: 'unavailable',
    error: errors.at(-1)?.error,
    errors,
    attempts: errors,
    attemptedConfigs: configs,
  };
};
