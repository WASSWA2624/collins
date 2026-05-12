import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { getTrackingAdmission, getTrackingTimeline, listTrackingAdmissions } from './tracking.service.js';

export const list = asyncHandler(async (req, res) => {
  const result = await listTrackingAdmissions(req.user?.sub, req.validated.query);
  return successResponse(res, {
    message: 'Tracking admissions loaded',
    data: result.items,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasNextPage: (result.page * result.limit) < result.total,
    },
  });
});

export const getById = asyncHandler(async (req, res) => {
  const tracking = await getTrackingAdmission(req.user?.sub, req.validated.params.id);
  return successResponse(res, {
    message: 'Tracking admission loaded',
    data: { tracking },
  });
});

export const timeline = asyncHandler(async (req, res) => {
  const result = await getTrackingTimeline(req.user?.sub, req.validated.params.id);
  return successResponse(res, {
    message: 'Tracking timeline loaded',
    data: result,
  });
});
