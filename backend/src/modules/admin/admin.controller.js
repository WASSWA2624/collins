import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { buildAuditContext } from '../../utils/audit.js';
import { verifyFacility } from '../facilities/facilities.controller.js';
import {
  activateModelShadowMode,
  createReferenceRule,
  getAdminDashboard,
  getDatasetQuality,
  getModelMonitoring,
  listAdminFacilities,
  listAuditLogs,
  retireModel,
} from './admin.service.js';

export { verifyFacility };

export const dashboard = asyncHandler(async (req, res) => {
  const data = await getAdminDashboard(req.user?.sub, req.validated.query);
  return successResponse(res, { message: 'Admin dashboard loaded', data });
});

export const facilities = asyncHandler(async (req, res) => {
  const data = await listAdminFacilities(req.user?.sub);
  return successResponse(res, { message: 'Admin facilities loaded', data });
});

export const auditLogs = asyncHandler(async (req, res) => {
  const result = await listAuditLogs(req.user?.sub, req.validated.query);
  return successResponse(res, {
    message: 'Audit logs loaded',
    data: result.items,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasNextPage: (result.page * result.limit) < result.total,
    },
  });
});

export const datasetQuality = asyncHandler(async (req, res) => {
  const data = await getDatasetQuality(req.user?.sub, req.validated.query || {});
  return successResponse(res, { message: 'Dataset quality loaded', data });
});

export const modelMonitoring = asyncHandler(async (req, res) => {
  const data = await getModelMonitoring(req.user?.sub);
  return successResponse(res, { message: 'Model monitoring loaded', data });
});

export const createReference = asyncHandler(async (req, res) => {
  const rule = await createReferenceRule(req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, { status: 201, message: 'Reference rule created', data: { rule } });
});

export const activateShadowMode = asyncHandler(async (req, res) => {
  const model = await activateModelShadowMode(req.validated.params.id, req.user?.sub, buildAuditContext(req));
  return successResponse(res, { message: 'Model activated for shadow mode only', data: { model } });
});

export const retire = asyncHandler(async (req, res) => {
  const model = await retireModel(req.validated.params.id, req.user?.sub, buildAuditContext(req));
  return successResponse(res, { message: 'Model retired', data: { model } });
});
