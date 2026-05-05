import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { buildAuditContext } from '../../utils/audit.js';
import { verifyFacility } from '../facilities/facilities.controller.js';
import {
  activateModelShadowMode,
  createShadowModelOutput,
  createReferenceRule,
  getAdminDashboard,
  getDatasetQuality,
  getModelCard,
  getModelDriftMonitoring,
  getModelMonitoring,
  getOverrideMonitoring,
  listModelCards,
  listAdminFacilities,
  listAuditLogs,
  listReferenceRules,
  requestReferenceCorrection,
  retireReferenceRule,
  retireModel,
  updateReferenceRule,
  verifyReferenceRule,
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

export const modelCards = asyncHandler(async (req, res) => {
  const data = await listModelCards(req.user?.sub);
  return successResponse(res, { message: 'Model governance cards loaded', data });
});

export const modelCard = asyncHandler(async (req, res) => {
  const data = await getModelCard(req.validated.params.id, req.user?.sub);
  return successResponse(res, { message: 'Model governance card loaded', data });
});

export const modelDriftMonitoring = asyncHandler(async (req, res) => {
  const data = await getModelDriftMonitoring(req.user?.sub, req.validated.query || {});
  return successResponse(res, { message: 'Model drift monitoring loaded', data });
});

export const overrideMonitoring = asyncHandler(async (req, res) => {
  const data = await getOverrideMonitoring(req.user?.sub, req.validated.query || {});
  return successResponse(res, { message: 'Override monitoring loaded', data });
});

export const createReference = asyncHandler(async (req, res) => {
  const rule = await createReferenceRule(req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, { status: 201, message: 'Reference rule created', data: { rule } });
});

export const references = asyncHandler(async (req, res) => {
  const result = await listReferenceRules(req.user?.sub, req.validated.query);
  return successResponse(res, {
    message: 'Reference rules loaded',
    data: result.items,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasNextPage: (result.page * result.limit) < result.total,
    },
  });
});

export const updateReference = asyncHandler(async (req, res) => {
  const rule = await updateReferenceRule(req.validated.params.id, req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, { message: 'Reference rule updated for review', data: { rule } });
});

export const verifyReference = asyncHandler(async (req, res) => {
  const rule = await verifyReferenceRule(req.validated.params.id, req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, { message: 'Reference rule verified', data: { rule } });
});

export const requestReferenceUpdate = asyncHandler(async (req, res) => {
  const rule = await requestReferenceCorrection(req.validated.params.id, req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, { message: 'Reference rule returned for correction', data: { rule } });
});

export const retireReference = asyncHandler(async (req, res) => {
  const rule = await retireReferenceRule(req.validated.params.id, req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, { message: 'Reference rule retired', data: { rule } });
});

export const activateShadowMode = asyncHandler(async (req, res) => {
  const model = await activateModelShadowMode(req.validated.params.id, req.user?.sub, buildAuditContext(req));
  return successResponse(res, { message: 'Model activated for shadow mode only', data: { model } });
});

export const retire = asyncHandler(async (req, res) => {
  const model = await retireModel(req.validated.params.id, req.user?.sub, buildAuditContext(req));
  return successResponse(res, { message: 'Model retired', data: { model } });
});

export const recordShadowOutput = asyncHandler(async (req, res) => {
  const result = await createShadowModelOutput(
    req.validated.params.id,
    req.validated.body,
    req.user?.sub,
    buildAuditContext(req),
  );
  return successResponse(res, {
    status: 201,
    message: 'Shadow model output recorded',
    data: result,
  });
});
