import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { errorResponse, successResponse } from '../../utils/apiResponse.js';

const buildHealthData = (database) => ({
  service: 'collins-backend',
  apiVersion: env.apiVersion,
  environment: env.nodeEnv,
  database,
  timestamp: new Date().toISOString(),
});

const getDatabaseErrorSummary = (error) => ({
  name: error?.name,
  code: error?.code,
  errno: error?.errno,
  sqlState: error?.sqlState,
  fatal: error?.fatal,
  message: error?.message,
});

const checkDatabase = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'connected';
  } catch (error) {
    console.error('Database readiness check failed', getDatabaseErrorSummary(error));
    return 'unavailable';
  }
};

export const getHealth = asyncHandler(async (req, res) => {
  const database = req.query.includeDb === 'true' ? await checkDatabase() : 'not_checked';

  return successResponse(res, {
    message: 'AI Vent backend health check passed',
    data: buildHealthData(database),
  });
});

export const getLive = asyncHandler(async (_req, res) => successResponse(res, {
  message: 'AI Vent backend liveness check passed',
  data: buildHealthData('not_checked'),
}));

export const getReady = asyncHandler(async (_req, res) => {
  const database = await checkDatabase();

  if (database !== 'connected') {
    return errorResponse(res, {
      status: 503,
      message: 'AI Vent backend readiness check failed',
      errors: [
        {
          path: ['database'],
          message: 'Database connection is unavailable',
        },
      ],
      meta: { database },
    });
  }

  return successResponse(res, {
    message: 'AI Vent backend readiness check passed',
    data: buildHealthData(database),
  });
});

export const getFavicon = (_req, res) => res.status(204).end();
