import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  facilitySettings,
  mySettings,
  patchFacilitySettings,
  patchMySettings,
} from './settings.controller.js';
import {
  facilitySettingsIdSchema,
  facilitySettingsSchema,
  userSettingsSchema,
} from './settings.validators.js';

export const settingsRouter = Router();

settingsRouter.use(requireAuth);
settingsRouter.get('/me', mySettings);
settingsRouter.patch('/me', validateRequest(userSettingsSchema), patchMySettings);
settingsRouter.get('/facilities/:facilityId', validateRequest(facilitySettingsIdSchema), facilitySettings);
settingsRouter.patch('/facilities/:facilityId', validateRequest(facilitySettingsSchema), patchFacilitySettings);

