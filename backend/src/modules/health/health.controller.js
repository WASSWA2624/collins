import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';

export const getHealth = asyncHandler(async (req, res) => {
  let database = 'not_checked';

  if (req.query.includeDb === 'true') {
    try {
      await prisma.$queryRaw`SELECT 1`;
      database = 'connected';
    } catch (_error) {
      database = 'unavailable';
    }
  }

  return successResponse(res, {
    message: 'Collins backend health check passed',
    data: {
      service: 'collins-backend',
      apiVersion: env.apiVersion,
      environment: env.nodeEnv,
      database,
      timestamp: new Date().toISOString(),
    },
  });
});
