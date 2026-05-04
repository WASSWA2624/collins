import { Router } from 'express';
import { successResponse, plannedResponse } from '../../utils/apiResponse.js';
import { prisma } from '../../config/prisma.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const referencesRouter = Router();

referencesRouter.get('/references/active', asyncHandler(async (_req, res) => {
  const now = new Date();
  const rules = await prisma.referenceRule.findMany({
    where: {
      OR: [
        { activeTo: null },
        { activeTo: { gte: now } },
      ],
    },
    orderBy: [{ name: 'asc' }, { version: 'desc' }],
  });

  return successResponse(res, {
    message: 'Active reference rules loaded',
    data: { rules },
  });
}));

referencesRouter.get('/models/versions', (_req, res) => plannedResponse(res, 'Model version registry'));
