import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { env } from './env.js';
import { createMariaDbAdapterConfig } from './database.js';
import { PrismaClient } from './prismaClient.js';

export { createMariaDbAdapterConfig };

const log = env.nodeEnv === 'test' ? [] : (env.nodeEnv === 'development' ? ['warn', 'error'] : ['error']);
const adapterConfig = createMariaDbAdapterConfig(env.databaseUrl, {
  socketPath: env.databaseSocketPath,
  connectionLimit: env.databaseConnectionLimit,
  connectTimeoutMs: env.databaseConnectTimeoutMs,
});
const adapter = new PrismaMariaDb(adapterConfig, {
  database: adapterConfig.database,
  useTextProtocol: env.databaseUseTextProtocol,
});

export const prisma = new PrismaClient({ adapter, log });
