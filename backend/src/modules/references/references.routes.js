import { Router } from 'express';
import { successResponse } from '../../utils/apiResponse.js';
import { prisma } from '../../config/prisma.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { MODEL_GOVERNANCE_ROLES, assertAnyApprovedRole } from '../../utils/authorization.js';
import {
  getReferencePolicy,
  listActiveReferenceRangeRecords,
  listActiveReferenceRules,
} from './references.service.js';

export const referencesRouter = Router();

referencesRouter.get('/references/active', asyncHandler(async (_req, res) => {
  const rules = await listActiveReferenceRules();
  const rangeRecords = await listActiveReferenceRangeRecords();
  const referencePolicy = getReferencePolicy();

  return successResponse(res, {
    message: 'Active reference rules loaded',
    data: {
      rules,
      rangeRecords,
      rangeDatasetStatus: {
        status: rangeRecords.length > 0 ? 'backend_verified' : 'missing_verified_records',
        verifiedOnly: true,
        count: rangeRecords.length,
      },
      referencePolicy,
      safetyStatement: referencePolicy.safetyStatement,
    },
  });
}));

referencesRouter.get('/models/versions', requireAuth, asyncHandler(async (req, res) => {
  await assertAnyApprovedRole(req.user?.sub, MODEL_GOVERNANCE_ROLES, 'Model governance permission is required');
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
