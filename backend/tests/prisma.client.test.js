import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';

const { createMariaDbAdapterConfig, prisma } = await import('../src/config/prisma.js');

test('normalizes Prisma mysql URLs for the MariaDB runtime adapter', () => {
  assert.deepEqual(
    createMariaDbAdapterConfig('mysql://db_user:p%40ssword@localhost:3307/collins_test'),
    {
      user: 'db_user',
      password: 'p@ssword',
      database: 'collins_test',
      connectionLimit: 5,
      connectTimeout: 10000,
      host: 'localhost',
      port: 3307,
    },
  );
});

test('supports explicit MySQL socket paths for shared hosting', () => {
  assert.deepEqual(
    createMariaDbAdapterConfig('mysql://db_user:p%40ssword@localhost:3306/collins_test', {
      socketPath: '/var/lib/mysql/mysql.sock',
      connectionLimit: 3,
      connectTimeoutMs: 15000,
    }),
    {
      user: 'db_user',
      password: 'p@ssword',
      database: 'collins_test',
      connectionLimit: 3,
      connectTimeout: 15000,
      socketPath: '/var/lib/mysql/mysql.sock',
    },
  );
});

test('initializes the generated Prisma client without placeholder startup errors', async () => {
  assert.equal(typeof prisma.$connect, 'function');
  assert.equal(typeof prisma.$disconnect, 'function');

  await prisma.$disconnect();
});
