import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';

const { createEnv, EnvValidationError, DEVELOPMENT_JWT_SECRET } = await import('../src/config/env.js');
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
const nodemonConfig = JSON.parse(readFileSync(path.join(projectRoot, 'nodemon.json'), 'utf8'));

test('loads safe development defaults while requiring only backend configuration', () => {
  const config = createEnv({
    DATABASE_URL: 'mysql://root:password@localhost:3306/collins',
  });

  assert.equal(config.nodeEnv, 'development');
  assert.equal(config.host, '0.0.0.0');
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

test('allows overriding the backend bind host', () => {
  const config = createEnv({
    DATABASE_URL: 'mysql://root:password@localhost:3306/collins',
    HOST: '127.0.0.1',
  });

  assert.equal(config.host, '127.0.0.1');
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

test('pins supported Node runtime for backend startup', () => {
  assert.equal(packageJson.engines.node, '>=20.0.0');
});

test('runs Prisma generation before backend startup and tests', () => {
  assert.equal(packageJson.scripts.predev, 'node scripts/prisma-generate-if-needed.mjs');
  assert.equal(packageJson.scripts.prestart, 'node scripts/prisma-generate-if-needed.mjs');
  assert.equal(packageJson.scripts.pretest, 'node scripts/prisma-generate-if-needed.mjs');
  assert.equal(packageJson.scripts['prisma:generate'], 'node scripts/prisma-generate-if-needed.mjs');
  assert.equal(packageJson.scripts.dev, 'nodemon --config nodemon.json');
  assert.equal(packageJson.scripts.start, 'node src/server.js');
  assert.equal(existsSync(path.join(projectRoot, 'scripts', 'prisma-generate-if-needed.mjs')), true);
  assert.equal(existsSync(path.join(projectRoot, 'prisma', 'schema.prisma')), true);
});

test('dev watcher is scoped to backend source and config files', () => {
  assert.deepEqual(nodemonConfig.watch, ['src', 'prisma/schema.prisma', '.env']);
  assert.ok(nodemonConfig.ignore.includes('node_modules/**'));
  assert.ok(nodemonConfig.ignore.includes('prisma/migrations/**'));
  assert.ok(nodemonConfig.ignore.includes('tests/**'));
  assert.equal(nodemonConfig.exec, 'node src/server.js');
});
