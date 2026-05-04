import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { approve, exclude, queue, requestCorrection } from './review.controller.js';
import { reviewActionSchema, reviewQueueSchema } from './review.validators.js';

export const reviewRouter = Router();

reviewRouter.use(requireAuth);
reviewRouter.get('/queue', validateRequest(reviewQueueSchema), queue);
reviewRouter.post('/:entityType/:entityId/approve', validateRequest(reviewActionSchema), approve);
reviewRouter.post('/:entityType/:entityId/request-correction', validateRequest(reviewActionSchema), requestCorrection);
reviewRouter.post('/:entityType/:entityId/exclude', validateRequest(reviewActionSchema), exclude);
