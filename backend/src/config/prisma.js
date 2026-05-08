import { URL } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { env } from './env.js';

const SUPPORTED_DATABASE_PROTOCOLS = new Set(['mysql:', 'mariadb:']);

export const createMariaDbAdapterConfig = (databaseUrl) => {
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

  return {
    host: url.hostname,
    port,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    connectionLimit: 5,
  };
};

const log = env.nodeEnv === 'test' ? [] : (env.nodeEnv === 'development' ? ['warn', 'error'] : ['error']);
const adapter = new PrismaMariaDb(createMariaDbAdapterConfig(env.databaseUrl));

export const prisma = new PrismaClient({ adapter, log });
