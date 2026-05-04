import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  activateShadowMode,
  auditLogs,
  createReference,
  dashboard,
  datasetQuality,
  facilities,
  modelMonitoring,
  retire,
  verifyFacility,
} from './admin.controller.js';
import {
  auditLogSchema,
  createReferenceSchema,
  dashboardSchema,
  modelActionSchema,
} from './admin.validators.js';
import { verifyFacilitySchema } from '../facilities/facilities.validators.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.get('/dashboard', validateRequest(dashboardSchema), dashboard);
adminRouter.get('/facilities', facilities);
adminRouter.patch('/facilities/:id/verify', validateRequest(verifyFacilitySchema), verifyFacility);
adminRouter.get('/audit-logs', validateRequest(auditLogSchema), auditLogs);
adminRouter.get('/dataset-quality', validateRequest(dashboardSchema), datasetQuality);
adminRouter.get('/model-monitoring', modelMonitoring);
adminRouter.post('/references', validateRequest(createReferenceSchema), createReference);
adminRouter.post('/models/:id/activate-shadow-mode', validateRequest(modelActionSchema), activateShadowMode);
adminRouter.post('/models/:id/retire', validateRequest(modelActionSchema), retire);
