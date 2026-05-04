import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key, fallback = undefined) => {
  const value = process.env[key];
  if (value === undefined || value === '') return fallback;
  return value;
};

const getNumberEnv = (key, fallback) => {
  const value = getEnv(key);
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseCorsOrigins = (value) => String(value || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: getEnv('NODE_ENV', 'development'),
  port: getNumberEnv('PORT', 3000),
  apiVersion: getEnv('API_VERSION', 'v1'),
  databaseUrl: getEnv('DATABASE_URL'),
  jwtSecret: getEnv('JWT_SECRET', 'development-only-change-me'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '1d'),
  bcryptSaltRounds: getNumberEnv('BCRYPT_SALT_ROUNDS', 12),
  corsOrigins: parseCorsOrigins(getEnv('CORS_ORIGIN', 'http://localhost:8081,http://localhost:19006,http://localhost:3000')),
  requestLogging: getEnv('REQUEST_LOGGING', 'true') === 'true',
};

export const isProduction = env.nodeEnv === 'production';
