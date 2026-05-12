import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { getById, list, timeline } from './tracking.controller.js';
import { trackingIdSchema, trackingListSchema } from './tracking.validators.js';

export const trackingRouter = Router();

trackingRouter.use(requireAuth);
trackingRouter.get('/', validateRequest(trackingListSchema), list);
trackingRouter.get('/:id/timeline', validateRequest(trackingIdSchema), timeline);
trackingRouter.get('/:id', validateRequest(trackingIdSchema), getById);
