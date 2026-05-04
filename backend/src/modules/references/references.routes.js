import { Router } from 'express';
import { successResponse } from '../../utils/apiResponse.js';
import { prisma } from '../../config/prisma.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

export const referencesRouter = Router();

referencesRouter.get('/references/active', asyncHandler(async (_req, res) => {
  const now = new Date();
  const rules = await prisma.referenceRule.findMany({
    where: {
      OR: [
        { activeFrom: null },
        { activeFrom: { lte: now } },
      ],
      AND: [{ OR: [{ activeTo: null }, { activeTo: { gte: now } }] }],
    },
    orderBy: [{ name: 'asc' }, { version: 'desc' }],
  });

  return successResponse(res, {
    message: 'Active reference rules loaded',
    data: {
      rules,
      safetyStatement: 'Reference rules support clinical judgement only and do not create treatment orders.',
    },
  });
}));

referencesRouter.get('/models/versions', requireAuth, asyncHandler(async (_req, res) => {
  const versions = await prisma.modelVersion.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      modelName: true,
      version: true,
      trainingDatasetVersion: true,
      intendedUse: true,
      contraindicatedUse: true,
      performanceSummaryJson: true,
      calibrationSummaryJson: true,
      biasAssessmentJson: true,
      approvalStatus: true,
      activatedAt: true,
      retiredAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return successResponse(res, {
    message: 'Model versions loaded',
    data: {
      versions,
      liveClinicalPredictionEnabled: false,
      safetyStatement: 'Model outputs remain hidden from clinical users unless future governance approval explicitly enables a supervised pilot.',
    },
  });
}));
