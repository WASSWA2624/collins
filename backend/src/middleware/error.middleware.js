import { Prisma } from '../config/prismaClient.js';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/apiResponse.js';
import { isProduction } from '../config/env.js';

const DATABASE_UNAVAILABLE_CODES = new Set([
  'P1000',
  'P1001',
  'P1002',
  'P1008',
  'P1017',
  'ER_ACCESS_DENIED_ERROR',
  'ER_BAD_DB_ERROR',
  'ECONNREFUSED',
  'ENOTFOUND',
  'ETIMEDOUT',
]);

const DATABASE_UNAVAILABLE_PATTERNS = [
  'access denied for user',
  'connect econnrefused',
  'connect etimedout',
  'database server',
  'failed to retrieve a connection from pool',
  'getaddrinfo enotfound',
  'pool timeout',
  'unknown database',
];

const normalizeZodErrors = (error) => error.issues.map((issue) => ({
  path: issue.path.join('.'),
  message: issue.message,
}));

const isDatabaseUnavailableError = (error) => {
  const code = String(error?.code || '').trim();
  if (DATABASE_UNAVAILABLE_CODES.has(code)) return true;

  const name = String(error?.name || '').toLowerCase();
  if (name.includes('prismaclientinitializationerror')) return true;

  const message = String(error?.message || '').toLowerCase();
  return DATABASE_UNAVAILABLE_PATTERNS.some((pattern) => message.includes(pattern));
};

const getDatabaseErrorMeta = (error) => ({
  code: error?.code,
  name: error?.name,
  meta: error?.meta,
});

export const errorMiddleware = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return errorResponse(res, {
      status: 400,
      message: 'Validation failed',
      errors: normalizeZodErrors(error),
    });
  }

  if (isDatabaseUnavailableError(error)) {
    console.error('Database request failed', getDatabaseErrorMeta(error));
    return errorResponse(res, {
      status: 503,
      message: 'Database connection is unavailable',
      errors: [{ code: error?.code || 'DATABASE_UNAVAILABLE' }],
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return errorResponse(res, {
        status: 409,
        message: 'A record with the same unique value already exists',
        errors: [{ code: error.code, meta: error.meta }],
      });
    }

    if (error.code === 'P2025') {
      return errorResponse(res, {
        status: 404,
        message: 'Requested record was not found',
        errors: [{ code: error.code, meta: error.meta }],
      });
    }

    return errorResponse(res, {
      status: 400,
      message: 'Database request failed',
      errors: [{ code: error.code, meta: error.meta }],
    });
  }

  const status = Number.isInteger(error.status) ? error.status : 500;
  const errors = Array.isArray(error.errors) ? error.errors : [];

  if (!isProduction && status >= 500) {
    console.error(error);
  }

  return errorResponse(res, {
    status,
    message: error.message || 'Internal server error',
    errors,
    meta: error.meta,
  });
};
