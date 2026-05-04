import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { buildAuditContext } from '../../utils/audit.js';
import {
  addAbgTest,
  addAirwayDevice,
  addClinicalSnapshot,
  addDailyReview,
  addHumidification,
  addOutcome,
  addVentilatorSetting,
  createAdmission,
  getAdmissionById,
  listAdmissions,
  updateAdmission,
} from './admissions.service.js';

export const list = asyncHandler(async (req, res) => {
  const result = await listAdmissions(req.user?.sub, req.validated.query);
  return successResponse(res, {
    message: 'Admissions loaded',
    data: result.items,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasNextPage: (result.page * result.limit) < result.total,
    },
  });
});

export const create = asyncHandler(async (req, res) => {
  const result = await createAdmission(req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, {
    status: result.syncStatus === 'duplicate' ? 200 : 201,
    message: result.syncStatus === 'duplicate' ? 'Duplicate admission request returned original result' : 'Admission created',
    data: result,
  });
});

export const getById = asyncHandler(async (req, res) => {
  const admission = await getAdmissionById(req.user?.sub, req.validated.params.id);
  return successResponse(res, {
    message: 'Admission loaded',
    data: { admission },
  });
});

export const patchById = asyncHandler(async (req, res) => {
  const result = await updateAdmission(req.user?.sub, req.validated.params.id, req.validated.body, buildAuditContext(req));
  return successResponse(res, {
    message: 'Admission updated',
    data: result,
  });
});

export const createClinicalSnapshot = asyncHandler(async (req, res) => {
  const result = await addClinicalSnapshot(req.user?.sub, req.validated.params.id, req.validated.body, buildAuditContext(req));
  return successResponse(res, {
    status: result.syncStatus === 'duplicate' ? 200 : 201,
    message: result.syncStatus === 'duplicate' ? 'Duplicate clinical snapshot request returned original result' : 'Clinical snapshot created',
    data: result,
  });
});

export const createAbgTest = asyncHandler(async (req, res) => {
  const result = await addAbgTest(req.user?.sub, req.validated.params.id, req.validated.body, buildAuditContext(req));
  return successResponse(res, {
    status: result.syncStatus === 'duplicate' ? 200 : 201,
    message: result.syncStatus === 'duplicate' ? 'Duplicate ABG request returned original result' : 'ABG test created as a new version',
    data: result,
  });
});

export const createVentilatorSetting = asyncHandler(async (req, res) => {
  const result = await addVentilatorSetting(req.user?.sub, req.validated.params.id, req.validated.body, buildAuditContext(req));
  return successResponse(res, {
    status: result.syncStatus === 'duplicate' ? 200 : 201,
    message: result.syncStatus === 'duplicate' ? 'Duplicate ventilator request returned original result' : 'Ventilator setting created as a new version',
    data: result,
  });
});

export const createAirwayDevice = asyncHandler(async (req, res) => {
  const result = await addAirwayDevice(req.user?.sub, req.validated.params.id, req.validated.body, buildAuditContext(req));
  return successResponse(res, {
    status: result.syncStatus === 'duplicate' ? 200 : 201,
    message: result.syncStatus === 'duplicate' ? 'Duplicate airway request returned original result' : 'Airway device record created',
    data: result,
  });
});

export const createHumidification = asyncHandler(async (req, res) => {
  const result = await addHumidification(req.user?.sub, req.validated.params.id, req.validated.body, buildAuditContext(req));
  return successResponse(res, {
    status: result.syncStatus === 'duplicate' ? 200 : 201,
    message: result.syncStatus === 'duplicate' ? 'Duplicate humidification request returned original result' : 'Humidification record created',
    data: result,
  });
});

export const createDailyReview = asyncHandler(async (req, res) => {
  const result = await addDailyReview(req.user?.sub, req.validated.params.id, req.validated.body, buildAuditContext(req));
  return successResponse(res, {
    status: result.syncStatus === 'duplicate' ? 200 : 201,
    message: result.syncStatus === 'duplicate' ? 'Duplicate daily review request returned original result' : 'Daily ventilation review created',
    data: result,
  });
});

export const createOutcome = asyncHandler(async (req, res) => {
  const result = await addOutcome(req.user?.sub, req.validated.params.id, req.validated.body, buildAuditContext(req));
  return successResponse(res, {
    status: result.syncStatus === 'duplicate' ? 200 : 201,
    message: result.syncStatus === 'duplicate' ? 'Duplicate outcome request returned original result' : 'Outcome created',
    data: result,
  });
});
