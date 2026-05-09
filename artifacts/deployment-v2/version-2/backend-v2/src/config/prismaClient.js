import { createRequire } from 'node:module';

const requireGeneratedPrisma = createRequire(import.meta.url);
const generatedPrisma = requireGeneratedPrisma('../generated/prisma/index.js');

export const { Prisma, PrismaClient } = generatedPrisma;
