import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { processSyncQueue } from './sync.service.js';

export const syncQueue = asyncHandler(async (req, res) => {
  const results = await processSyncQueue(req.validated.body.items, req.user?.sub, req);
  const hasConflict = results.some((result) => result.status === 'conflict');
  const hasFailed = results.some((result) => ['failed', 'failed_validation'].includes(result.status));
  return successResponse(res, {
    status: hasConflict ? 207 : hasFailed ? 207 : 200,
    message: 'Sync queue processed',
    data: { results },
  });
});
