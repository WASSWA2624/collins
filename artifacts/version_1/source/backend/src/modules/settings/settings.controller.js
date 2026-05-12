import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { buildAuditContext } from '../../utils/audit.js';
import {
  getFacilitySettings,
  getUserSettings,
  updateFacilitySettings,
  updateUserSettings,
} from './settings.service.js';

export const mySettings = asyncHandler(async (req, res) => {
  const settings = await getUserSettings(req.user?.sub);
  return successResponse(res, {
    message: 'User settings loaded',
    data: { settings },
  });
});

export const patchMySettings = asyncHandler(async (req, res) => {
  const settings = await updateUserSettings(req.user?.sub, req.validated.body, buildAuditContext(req));
  return successResponse(res, {
    message: 'User settings updated',
    data: { settings },
  });
});

export const facilitySettings = asyncHandler(async (req, res) => {
  const settings = await getFacilitySettings(req.user?.sub, req.validated.params.facilityId);
  return successResponse(res, {
    message: 'Facility settings loaded',
    data: { settings },
  });
});

export const patchFacilitySettings = asyncHandler(async (req, res) => {
  const settings = await updateFacilitySettings(
    req.user?.sub,
    req.validated.params.facilityId,
    req.validated.body,
    buildAuditContext(req),
  );

  return successResponse(res, {
    message: 'Facility settings updated',
    data: { settings },
  });
});
