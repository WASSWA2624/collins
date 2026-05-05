import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';

const { createEnv, EnvValidationError, DEVELOPMENT_JWT_SECRET } = await import('../src/config/env.js');

test('loads safe development defaults while requiring only backend configuration', () => {
  const config = createEnv({
    DATABASE_URL: 'mysql://root:password@localhost:3306/collins',
  });

  assert.equal(config.nodeEnv, 'development');
  assert.equal(config.port, 3000);
  assert.equal(config.apiVersion, 'v1');
  assert.equal(config.jwtSecret, DEVELOPMENT_JWT_SECRET);
  assert.equal(config.requestLogging, true);
  assert.deepEqual(config.corsOrigins, [
    'http://localhost:8081',
    'http://localhost:19006',
    'http://localhost:3000',
  ]);
});

test('fails fast when required backend environment is missing', () => {
  assert.throws(
    () => createEnv({}),
    (error) => error instanceof EnvValidationError
      && error.errors.some((message) => message.startsWith('DATABASE_URL is required')),
  );
});

test('requires an explicit JWT secret in production', () => {
  assert.throws(
    () => createEnv({
      NODE_ENV: 'production',
      DATABASE_URL: 'mysql://root:password@localhost:3306/collins',
    }),
    (error) => error instanceof EnvValidationError
      && error.errors.includes('JWT_SECRET is required in production.'),
  );
});

test('validates startup scalar settings', () => {
  assert.throws(
    () => createEnv({
      DATABASE_URL: 'mysql://root:password@localhost:3306/collins',
      PORT: 'not-a-port',
      BCRYPT_SALT_ROUNDS: '2',
      REQUEST_LOGGING: 'sometimes',
    }),
    (error) => error instanceof EnvValidationError
      && error.errors.includes('PORT must be an integer between 1 and 65535.')
      && error.errors.includes('BCRYPT_SALT_ROUNDS must be an integer between 4 and 31.')
      && error.errors.includes('REQUEST_LOGGING must be true or false.'),
  );
});
