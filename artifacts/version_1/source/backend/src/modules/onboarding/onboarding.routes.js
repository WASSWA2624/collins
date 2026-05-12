import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  acknowledgeSafety,
  onboardingConfig,
  onboardingState,
  patchOnboardingState,
} from './onboarding.controller.js';
import {
  acknowledgeClinicalSafetySchema,
  getOnboardingStateSchema,
  onboardingConfigSchema,
  updateOnboardingStateSchema,
} from './onboarding.validators.js';

export const onboardingRouter = Router();

onboardingRouter.get('/config', validateRequest(onboardingConfigSchema), onboardingConfig);
onboardingRouter.get('/state', requireAuth, validateRequest(getOnboardingStateSchema), onboardingState);
onboardingRouter.patch('/state', requireAuth, validateRequest(updateOnboardingStateSchema), patchOnboardingState);
onboardingRouter.post(
  '/clinical-safety/acknowledgement',
  requireAuth,
  validateRequest(acknowledgeClinicalSafetySchema),
  acknowledgeSafety
);
