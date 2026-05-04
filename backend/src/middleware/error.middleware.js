import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/apiResponse.js';
import { isProduction } from '../config/env.js';

const normalizeZodErrors = (error) => error.issues.map((issue) => ({
  path: issue.path.join('.'),
  message: issue.message,
}));

export const errorMiddleware = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return errorResponse(res, {
      status: 400,
      message: 'Validation failed',
      errors: normalizeZodErrors(error),
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
