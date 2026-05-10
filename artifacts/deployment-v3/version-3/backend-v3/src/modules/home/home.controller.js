import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { getHomeSummary } from './home.service.js';

export const summary = asyncHandler(async (req, res) => {
  const data = await getHomeSummary(req.user?.sub, req.validated.query || {});
  return successResponse(res, {
    message: 'Home summary loaded',
    data,
  });
});
