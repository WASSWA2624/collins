import { successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  getClinicalDashboard,
  getGovernanceDashboard,
} from './dashboards.service.js';

export const clinical = asyncHandler(async (req, res) => {
  const data = await getClinicalDashboard(req.user?.sub, req.validated.query);
  return successResponse(res, { message: 'Clinical dashboard loaded', data });
});

export const governance = asyncHandler(async (req, res) => {
  const data = await getGovernanceDashboard(req.user?.sub, req.validated.query);
  return successResponse(res, { message: 'Governance dashboard loaded', data });
});
