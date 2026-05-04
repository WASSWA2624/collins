import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const log = env.nodeEnv === 'development' ? ['warn', 'error'] : ['error'];

export const prisma = new PrismaClient({ log });
