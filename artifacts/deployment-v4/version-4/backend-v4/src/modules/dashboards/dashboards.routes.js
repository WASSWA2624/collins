import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { clinical, governance, operational } from './dashboards.controller.js';
import { dashboardSchema } from './dashboards.validators.js';

export const dashboardsRouter = Router();

dashboardsRouter.use(requireAuth);
dashboardsRouter.get('/clinical', validateRequest(dashboardSchema), clinical);
dashboardsRouter.get('/governance', validateRequest(dashboardSchema), governance);
dashboardsRouter.get('/operational', validateRequest(dashboardSchema), operational);
