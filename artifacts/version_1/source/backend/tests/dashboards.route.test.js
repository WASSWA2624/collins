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

const requestJson = async (path, init = {}) => {
  const server = await startServer(createApp());

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}${path}`, init);
    return {
      status: response.status,
      body: await response.json(),
    };
  } finally {
    await closeServer(server);
  }
};

const getJson = (path) => requestJson(path);

test('clinical dashboard route is registered and requires authentication', async () => {
  const { status, body } = await getJson('/api/v1/dashboards/clinical');

  assert.equal(status, 401);
  assert.equal(body.success, false);
  assert.equal(body.message, 'Authentication required');
});

test('governance dashboard route is registered and requires authentication', async () => {
  const { status, body } = await getJson('/api/v1/dashboards/governance');

  assert.equal(status, 401);
  assert.equal(body.success, false);
  assert.equal(body.message, 'Authentication required');
});

test('phase 16 governance monitoring routes are registered and require authentication', async () => {
  const paths = [
    '/api/v1/admin/model-monitoring/drift',
    '/api/v1/admin/override-monitoring',
    '/api/v1/admin/models/cards',
    '/api/v1/admin/users',
    '/api/v1/datasets/dataset-1/card',
  ];

  for (const path of paths) {
    const { status, body } = await getJson(path);

    assert.equal(status, 401);
    assert.equal(body.success, false);
    assert.equal(body.message, 'Authentication required');
  }
});

test('admin facility mutation routes are registered and require authentication', async () => {
  const requests = [
    ['POST', '/api/v1/admin/facilities'],
    ['PATCH', '/api/v1/admin/facilities/facility-1'],
    ['DELETE', '/api/v1/admin/facilities/facility-1'],
  ];

  for (const [method, path] of requests) {
    const { status, body } = await requestJson(path, {
      method,
      headers: { 'content-type': 'application/json' },
      body: method === 'DELETE' ? undefined : JSON.stringify({ name: 'Mulago National Referral Hospital' }),
    });

    assert.equal(status, 401);
    assert.equal(body.success, false);
    assert.equal(body.message, 'Authentication required');
  }
});

test('operational dashboard route is registered and requires authentication', async () => {
  const { status, body } = await getJson('/api/v1/dashboards/operational');

  assert.equal(status, 401);
  assert.equal(body.success, false);
  assert.equal(body.message, 'Authentication required');
});
