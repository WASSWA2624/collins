import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';
process.env.REQUEST_LOGGING = 'false';

const { default: jwt } = await import('jsonwebtoken');
const { createApp } = await import('../src/app.js');
const { env } = await import('../src/config/env.js');

const startServer = (app) => new Promise((resolve) => {
  const server = app.listen(0, () => resolve(server));
});

const closeServer = (server) => new Promise((resolve, reject) => {
  server.close((error) => (error ? reject(error) : resolve()));
});

const tokenForRoles = (roles) => jwt.sign({
  sub: 'training-help-test-user',
  email: 'training-help@example.com',
  roles,
  facilities: [],
}, env.jwtSecret);

const getJson = async (path, token) => {
  const server = await startServer(createApp());

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      headers: token ? { authorization: `Bearer ${token}` } : {},
    });
    return {
      status: response.status,
      body: await response.json(),
    };
  } finally {
    await closeServer(server);
  }
};

test('training help endpoint requires authentication', async () => {
  const { status, body } = await getJson('/api/v1/training-help');

  assert.equal(status, 401);
  assert.equal(body.success, false);
});

test('training help endpoint returns advisory versioned content for clinical users', async () => {
  const { status, body } = await getJson(
    '/api/v1/training-help?workflow=admit',
    tokenForRoles(['CLINICIAN']),
  );

  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.message, 'Training and help content loaded');
  assert.equal(body.data.contentVersion, '2026.05.phase14');
  assert.equal(body.data.referencePolicy.verifiedOnly, true);
  assert.match(body.data.safetyStatement, /advisory/i);
  assert.deepEqual(body.data.availableWorkflows, ['admit']);
  assert.equal(body.data.topics.every((topic) => topic.workflow === 'admit'), true);
  assert.equal(body.data.topics.some((topic) => topic.id === 'governance.model-readiness'), false);
});

test('training help endpoint exposes model-governance help only to governance roles', async () => {
  const { status, body } = await getJson(
    '/api/v1/training-help?workflow=dashboard',
    tokenForRoles(['PLATFORM_ADMIN']),
  );

  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.topics.some((topic) => topic.id === 'governance.model-readiness'), true);
});
