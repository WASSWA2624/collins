import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { getTrainingHelpSummary } from './trainingHelp.service.js';

export const trainingHelp = asyncHandler(async (req, res) => {
  const data = getTrainingHelpSummary({
    roles: req.user?.roles || [],
    workflow: req.validated?.query?.workflow,
  });

  return successResponse(res, {
    message: 'Training and help content loaded',
    data,
  });
});
