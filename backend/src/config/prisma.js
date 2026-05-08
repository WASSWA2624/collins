import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { env } from './env.js';
import {
  createMariaDbAdapterConfig,
  createMariaDbConnectionConfigs,
} from './database.js';
import { PrismaClient } from './prismaClient.js';

export { createMariaDbAdapterConfig, createMariaDbConnectionConfigs };

const log = env.nodeEnv === 'test' ? [] : (env.nodeEnv === 'development' ? ['warn', 'error'] : ['error']);
const adapterConfig = createMariaDbAdapterConfig(env.databaseUrl, {
  host: env.databaseHost,
  port: env.databasePort,
  socketPath: env.databaseSocketPath,
  connectionLimit: env.databaseConnectionLimit,
  connectTimeoutMs: env.databaseConnectTimeoutMs,
  acquireTimeoutMs: env.databaseAcquireTimeoutMs,
});
const adapter = new PrismaMariaDb(adapterConfig, {
  database: adapterConfig.database,
  useTextProtocol: env.databaseUseTextProtocol,
});

export const prisma = new PrismaClient({ adapter, log });
