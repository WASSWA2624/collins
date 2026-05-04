import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { plannedResponse } from '../../utils/apiResponse.js';

export const adminRouter = Router();

adminRouter.get('/dashboard', requireAuth, (_req, res) => plannedResponse(res, 'Admin dashboard'));
adminRouter.get('/facilities', requireAuth, (_req, res) => plannedResponse(res, 'Admin facilities'));
adminRouter.patch('/facilities/:id/verify', requireAuth, (_req, res) => plannedResponse(res, 'Facility verification decision'));
adminRouter.get('/audit-logs', requireAuth, (_req, res) => plannedResponse(res, 'Audit log search'));
adminRouter.get('/dataset-quality', requireAuth, (_req, res) => plannedResponse(res, 'Dataset quality dashboard'));
adminRouter.get('/model-monitoring', requireAuth, (_req, res) => plannedResponse(res, 'Model monitoring dashboard'));
adminRouter.post('/references', requireAuth, (_req, res) => plannedResponse(res, 'Reference rule creation'));
adminRouter.post('/models/:id/activate-shadow-mode', requireAuth, (_req, res) => plannedResponse(res, 'Model shadow-mode activation'));
adminRouter.post('/models/:id/retire', requireAuth, (_req, res) => plannedResponse(res, 'Model retirement'));
