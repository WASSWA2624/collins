import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';
process.env.REQUEST_LOGGING = 'false';

const { prisma } = await import('./helpers/prisma.js');
const { createApp } = await import('../src/app.js');

const originalReferenceRule = prisma.referenceRule;

test.afterEach(() => {
  prisma.referenceRule = originalReferenceRule;
});

const startServer = (app) => new Promise((resolve) => {
  const server = app.listen(0, () => resolve(server));
});

const closeServer = (server) => new Promise((resolve, reject) => {
  server.close((error) => (error ? reject(error) : resolve()));
});

const getJson = async (path) => {
  const server = await startServer(createApp());

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}${path}`);
    return {
      status: response.status,
      body: await response.json(),
    };
  } finally {
    await closeServer(server);
  }
};

test('active references route remains publicly reachable before authenticated catch-all routers', async () => {
  prisma.referenceRule = {
    findMany: async () => [],
  };

  const { status, body } = await getJson('/api/v1/references/active');

  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.message, 'Active reference rules loaded');
  assert.equal(body.data.referencePolicy.verifiedOnly, true);
});
