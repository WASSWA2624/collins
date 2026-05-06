import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';
process.env.NODE_ENV ||= 'test';
process.env.REQUEST_LOGGING = 'false';

const { createApp } = await import('../src/app.js');

const startServer = (app) => new Promise((resolve) => {
  const server = app.listen(0, () => resolve(server));
});

const closeServer = (server) => new Promise((resolve, reject) => {
  server.close((error) => (error ? reject(error) : resolve()));
});

const requestPath = async (path, requestId) => {
  const server = await startServer(createApp());

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      headers: { 'x-request-id': requestId },
    });
    return {
      status: response.status,
      text: await response.text(),
    };
  } finally {
    await closeServer(server);
  }
};

const getJson = async (path, requestId) => {
  const response = await requestPath(path, requestId);
  return {
    status: response.status,
    body: JSON.parse(response.text),
  };
};

test('root endpoint uses the standard success response shape', async () => {
  const { status, body } = await getJson('/', 'root-contract-test');

  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.message, 'AI Vent backend is running');
  assert.deepEqual(body.data, { apiBasePath: '/api/v1' });
  assert.equal(body.meta.requestId, 'root-contract-test');
});

test('health endpoint reports startup state without checking the database by default', async () => {
  const { status, body } = await getJson('/api/v1/health', 'health-contract-test');

  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.message, 'AI Vent backend health check passed');
  assert.equal(body.data.service, 'collins-backend');
  assert.equal(body.data.apiVersion, 'v1');
  assert.equal(body.data.database, 'not_checked');
  assert.equal(Number.isNaN(Date.parse(body.data.timestamp)), false);
  assert.equal(body.meta.requestId, 'health-contract-test');
});

test('root health endpoint aliases the versioned health contract for local probes', async () => {
  const { status, body } = await getJson('/health', 'root-health-test');

  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.message, 'AI Vent backend health check passed');
  assert.equal(body.data.service, 'collins-backend');
  assert.equal(body.data.apiVersion, 'v1');
  assert.equal(body.data.database, 'not_checked');
  assert.equal(body.meta.requestId, 'root-health-test');
});

test('liveness endpoint reports process availability without checking the database', async () => {
  const { status, body } = await getJson('/live', 'live-contract-test');

  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.message, 'AI Vent backend liveness check passed');
  assert.equal(body.data.service, 'collins-backend');
  assert.equal(body.data.database, 'not_checked');
  assert.equal(body.meta.requestId, 'live-contract-test');
});

test('development CORS allows Expo clients from private LAN origins', async () => {
  const server = await startServer(createApp());

  try {
    const { port } = server.address();
    const origin = 'http://192.168.1.25:8081';
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/health`, {
      headers: { origin },
    });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('access-control-allow-origin'), origin);
  } finally {
    await closeServer(server);
  }
});

test('readiness endpoint reports database readiness using the standard response shape', async () => {
  const { status, body } = await getJson('/ready', 'ready-contract-test');

  assert.ok([200, 503].includes(status));
  assert.equal(body.success, status === 200);
  assert.ok([
    'AI Vent backend readiness check passed',
    'AI Vent backend readiness check failed',
  ].includes(body.message));
  assert.equal(body.meta.requestId, 'ready-contract-test');

  if (status === 200) {
    assert.equal(body.data.database, 'connected');
  } else {
    assert.equal(body.meta.database, 'unavailable');
  }
});

test('favicon probe is handled before the API not-found middleware', async () => {
  const { status, text } = await requestPath('/favicon.ico', 'favicon-contract-test');

  assert.equal(status, 204);
  assert.equal(text, '');
});
