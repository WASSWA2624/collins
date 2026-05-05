import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';

const { prisma } = await import('../src/config/prisma.js');

test('initializes the generated Prisma client without placeholder startup errors', async () => {
  assert.equal(typeof prisma.$connect, 'function');
  assert.equal(typeof prisma.$disconnect, 'function');

  await prisma.$disconnect();
});
