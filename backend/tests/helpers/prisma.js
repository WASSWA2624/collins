import test from 'node:test';
import { prisma } from '../../src/config/prisma.js';

test.after(async () => {
  await prisma.$disconnect();
});

export { prisma };
