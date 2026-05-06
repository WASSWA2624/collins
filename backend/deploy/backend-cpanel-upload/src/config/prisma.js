import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const log = env.nodeEnv === 'test' ? [] : (env.nodeEnv === 'development' ? ['warn', 'error'] : ['error']);

export const prisma = new PrismaClient({ log });
