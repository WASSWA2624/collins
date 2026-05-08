import { existsSync } from 'node:fs';
import { URL } from 'node:url';

const SUPPORTED_DATABASE_PROTOCOLS = new Set(['mysql:', 'mariadb:']);
const LOCAL_DATABASE_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
const LOCAL_SOCKET_PATHS = [
  '/var/lib/mysql/mysql.sock',
  '/var/run/mysqld/mysqld.sock',
  '/run/mysqld/mysqld.sock',
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

export const createMariaDbAdapterConfig = (databaseUrl, options = {}) => {
  const url = new URL(databaseUrl);

  if (!SUPPORTED_DATABASE_PROTOCOLS.has(url.protocol)) {
    throw new Error('DATABASE_URL must use a mysql:// or mariadb:// connection string.');
  }

  const port = url.port ? Number(url.port) : 3306;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DATABASE_URL port must be an integer between 1 and 65535.');
  }

  const database = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
  if (!database) {
    throw new Error('DATABASE_URL must include a database name.');
  }

  const socketPath = options.socketPath || getUrlSocketPath(url) || findLocalSocketPath(url.hostname);
  const config = {
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    connectionLimit: options.connectionLimit ?? 5,
    connectTimeout: options.connectTimeoutMs ?? 10000,
  };

  if (socketPath) {
    return {
      ...config,
      socketPath,
    };
  }

  return {
    ...config,
    host: url.hostname,
    port,
  };
};
