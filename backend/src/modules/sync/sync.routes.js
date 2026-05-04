import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { syncQueue } from './sync.controller.js';
import { syncQueueSchema } from './sync.validators.js';

export const syncRouter = Router();

syncRouter.use(requireAuth);
syncRouter.post('/queue', validateRequest(syncQueueSchema), syncQueue);
syncRouter.post('/push', validateRequest(syncQueueSchema), syncQueue);
