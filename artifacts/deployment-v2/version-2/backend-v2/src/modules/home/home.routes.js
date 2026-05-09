import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { summary } from './home.controller.js';
import { homeSummarySchema } from './home.validators.js';

export const homeRouter = Router();

homeRouter.use(requireAuth);
homeRouter.get('/summary', validateRequest(homeSummarySchema), summary);
