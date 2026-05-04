import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { buildAuditContext } from '../../utils/audit.js';
import {
  createDatasetImport,
  exportDatasetCase,
  listApprovedDatasets,
  listPendingDatasetImports,
  parseIcuNote,
  reviewDatasetImport,
} from './dataset.service.js';

export const parseNote = asyncHandler(async (req, res) => {
  const result = await parseIcuNote(req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, {
    message: 'Structured note preview created for human review',
    data: result,
  });
});

export const createImport = asyncHandler(async (req, res) => {
  const datasetCase = await createDatasetImport(req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, {
    status: 201,
    message: 'Dataset import submitted for review',
    data: { datasetCase },
  });
});

export const pendingReview = asyncHandler(async (req, res) => {
  const result = await listPendingDatasetImports(req.user?.sub, req.validated.query);
  return successResponse(res, {
    message: 'Pending dataset imports loaded',
    data: result.items,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasNextPage: (result.page * result.limit) < result.total,
    },
  });
});

export const reviewImport = asyncHandler(async (req, res) => {
  const datasetCase = await reviewDatasetImport(req.validated.params.id, req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, {
    message: 'Dataset review action saved',
    data: { datasetCase },
  });
});

export const approvedDatasets = asyncHandler(async (req, res) => {
  const result = await listApprovedDatasets(req.user?.sub, req.validated.query);
  return successResponse(res, {
    message: 'Approved de-identified datasets loaded',
    data: result.items,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasNextPage: (result.page * result.limit) < result.total,
    },
  });
});

export const exportDataset = asyncHandler(async (req, res) => {
  const datasetExport = await exportDatasetCase(req.validated.params.id, req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, {
    message: 'Approved de-identified dataset export created',
    data: { datasetExport },
  });
});
