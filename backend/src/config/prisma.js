import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { env } from './env.js';

const log = env.nodeEnv === 'test' ? [] : (env.nodeEnv === 'development' ? ['warn', 'error'] : ['error']);
const adapter = new PrismaMariaDb(env.databaseUrl);

export const prisma = new PrismaClient({ adapter, log });
