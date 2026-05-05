import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';
process.env.REQUEST_LOGGING = 'false';

const { createApp } = await import('../src/app.js');

const startServer = (app) => new Promise((resolve) => {
  const server = app.listen(0, () => resolve(server));
});

const closeServer = (server) => new Promise((resolve, reject) => {
  server.close((error) => (error ? reject(error) : resolve()));
});

const getJson = async (path, requestId) => {
  const server = await startServer(createApp());

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      headers: { 'x-request-id': requestId },
    });
    return {
      status: response.status,
      body: await response.json(),
    };
  } finally {
    await closeServer(server);
  }
};

test('root endpoint uses the standard success response shape', async () => {
  const { status, body } = await getJson('/', 'root-contract-test');

  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.message, 'Collins backend is running');
  assert.deepEqual(body.data, { apiBasePath: '/api/v1' });
  assert.equal(body.meta.requestId, 'root-contract-test');
});

test('health endpoint reports startup state without checking the database by default', async () => {
  const { status, body } = await getJson('/api/v1/health', 'health-contract-test');

  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.message, 'Collins backend health check passed');
  assert.equal(body.data.service, 'collins-backend');
  assert.equal(body.data.apiVersion, 'v1');
  assert.equal(body.data.database, 'not_checked');
  assert.equal(Number.isNaN(Date.parse(body.data.timestamp)), false);
  assert.equal(body.meta.requestId, 'health-contract-test');
});
