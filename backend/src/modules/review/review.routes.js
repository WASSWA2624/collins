import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { plannedResponse } from '../../utils/apiResponse.js';

export const reviewRouter = Router();

reviewRouter.get('/queue', requireAuth, (_req, res) => plannedResponse(res, 'Specialist review queue'));
reviewRouter.post('/:entityType/:entityId/approve', requireAuth, (_req, res) => plannedResponse(res, 'Reviewer approval'));
reviewRouter.post('/:entityType/:entityId/request-correction', requireAuth, (_req, res) => plannedResponse(res, 'Reviewer correction request'));
reviewRouter.post('/:entityType/:entityId/exclude', requireAuth, (_req, res) => plannedResponse(res, 'Reviewer exclusion'));
