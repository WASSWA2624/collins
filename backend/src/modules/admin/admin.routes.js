import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  activateShadowMode,
  assignUserMemberships,
  auditLogs,
  createUser,
  createReference,
  dashboard,
  datasetQuality,
  modelCard,
  modelCards,
  modelDriftMonitoring,
  facilities,
  modelMonitoring,
  overrideMonitoring,
  recordShadowOutput,
  references,
  requestReferenceUpdate,
  retire,
  retireReference,
  updateUserStatus,
  updateUserMembership,
  updateReference,
  users,
  verifyReference,
  verifyFacility,
} from './admin.controller.js';
import {
  adminUserListSchema,
  auditLogSchema,
  assignManagedUserMembershipsSchema,
  createManagedUserSchema,
  createReferenceSchema,
  dashboardSchema,
  modelActionSchema,
  modelCardSchema,
  monitoringSchema,
  modelShadowOutputSchema,
  referenceLifecycleSchema,
  referenceListSchema,
  updateManagedUserStatusSchema,
  updateManagedUserMembershipSchema,
  updateReferenceSchema,
} from './admin.validators.js';
import { verifyFacilitySchema } from '../facilities/facilities.validators.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.get('/dashboard', validateRequest(dashboardSchema), dashboard);
adminRouter.get('/facilities', facilities);
adminRouter.patch('/facilities/:id/verify', validateRequest(verifyFacilitySchema), verifyFacility);
adminRouter.get('/users', validateRequest(adminUserListSchema), users);
adminRouter.post('/users', validateRequest(createManagedUserSchema), createUser);
adminRouter.patch('/users/:id', validateRequest(updateManagedUserStatusSchema), updateUserStatus);
adminRouter.post('/users/:id/facility-memberships', validateRequest(assignManagedUserMembershipsSchema), assignUserMemberships);
adminRouter.patch('/users/:id/facility-memberships/:membershipId', validateRequest(updateManagedUserMembershipSchema), updateUserMembership);
adminRouter.get('/audit-logs', validateRequest(auditLogSchema), auditLogs);
adminRouter.get('/dataset-quality', validateRequest(dashboardSchema), datasetQuality);
adminRouter.get('/model-monitoring', modelMonitoring);
adminRouter.get('/model-monitoring/drift', validateRequest(monitoringSchema), modelDriftMonitoring);
adminRouter.get('/override-monitoring', validateRequest(monitoringSchema), overrideMonitoring);
adminRouter.get('/models/cards', modelCards);
adminRouter.get('/models/:id/card', validateRequest(modelCardSchema), modelCard);
adminRouter.get('/references', validateRequest(referenceListSchema), references);
adminRouter.post('/references', validateRequest(createReferenceSchema), createReference);
adminRouter.patch('/references/:id', validateRequest(updateReferenceSchema), updateReference);
adminRouter.post('/references/:id/verify', validateRequest(referenceLifecycleSchema), verifyReference);
adminRouter.post('/references/:id/request-correction', validateRequest(referenceLifecycleSchema), requestReferenceUpdate);
adminRouter.post('/references/:id/retire', validateRequest(referenceLifecycleSchema), retireReference);
adminRouter.post('/models/:id/activate-shadow-mode', validateRequest(modelActionSchema), activateShadowMode);
adminRouter.post('/models/:id/shadow-outputs', validateRequest(modelShadowOutputSchema), recordShadowOutput);
adminRouter.post('/models/:id/retire', validateRequest(modelActionSchema), retire);
