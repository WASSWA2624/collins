import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { buildAuditContext } from '../../utils/audit.js';
import { applyReviewAction, listReviewQueue } from './review.service.js';

export const queue = asyncHandler(async (req, res) => {
  const result = await listReviewQueue(req.user?.sub, req.validated.query);
  return successResponse(res, {
    message: 'Review queue loaded',
    data: result.items,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasNextPage: (result.page * result.limit) < result.total,
    },
  });
});

const makeAction = (action) => asyncHandler(async (req, res) => {
  const item = await applyReviewAction({
    entityType: req.validated.params.entityType,
    entityId: req.validated.params.entityId,
    action,
    payload: req.validated.body,
    userId: req.user?.sub,
    auditContext: buildAuditContext(req),
  });
  return successResponse(res, {
    message: 'Review action saved',
    data: { item },
  });
});

export const approve = makeAction('approve');
export const requestCorrection = makeAction('request_correction');
export const exclude = makeAction('exclude');
