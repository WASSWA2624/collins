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

test('settings routes are registered and require authentication', async () => {
  const userSettings = await getJson('/api/v1/settings/me');
  assert.equal(userSettings.status, 401);
  assert.equal(userSettings.body.success, false);
  assert.equal(userSettings.body.message, 'Authentication required');

  const facilitySettings = await getJson('/api/v1/settings/facilities/facility-1');
  assert.equal(facilitySettings.status, 401);
  assert.equal(facilitySettings.body.success, false);
  assert.equal(facilitySettings.body.message, 'Authentication required');
});
