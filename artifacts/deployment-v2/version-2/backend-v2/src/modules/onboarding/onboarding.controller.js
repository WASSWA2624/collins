import { asyncHandler } from '../../utils/asyncHandler.js';
import { buildAuditContext } from '../../utils/audit.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  acknowledgeClinicalSafety,
  getOnboardingConfig,
  getOnboardingState,
  updateOnboardingState,
} from './onboarding.service.js';

export const onboardingConfig = (_req, res) => successResponse(res, {
  message: 'Onboarding configuration loaded',
  data: getOnboardingConfig(),
});

export const onboardingState = asyncHandler(async (req, res) => {
  const state = await getOnboardingState(req.user?.sub);
  return successResponse(res, {
    message: 'Onboarding state loaded',
    data: { state },
  });
});

export const patchOnboardingState = asyncHandler(async (req, res) => {
  const state = await updateOnboardingState(req.user?.sub, req.validated.body, buildAuditContext(req));
  return successResponse(res, {
    message: 'Onboarding state updated',
    data: { state },
  });
});

export const acknowledgeSafety = asyncHandler(async (req, res) => {
  const result = await acknowledgeClinicalSafety(req.user?.sub, req.validated.body, buildAuditContext(req));
  return successResponse(res, {
    message: 'Clinical safety acknowledgement stored',
    data: result,
  });
});
