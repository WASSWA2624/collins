import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';
process.env.REQUEST_LOGGING = 'false';

await import('./helpers/prisma.js');
const { createApp } = await import('../src/app.js');

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

test('tracking list route is registered and requires authentication', async () => {
  const { status, body } = await getJson('/api/v1/tracking');

  assert.equal(status, 401);
  assert.equal(body.success, false);
  assert.equal(body.message, 'Authentication required');
});

test('tracking timeline route is registered and requires authentication', async () => {
  const { status, body } = await getJson('/api/v1/tracking/admission-1/timeline');

  assert.equal(status, 401);
  assert.equal(body.success, false);
  assert.equal(body.message, 'Authentication required');
});
