import { asyncHandler } from '../../utils/asyncHandler.js';
import { plannedResponse, successResponse } from '../../utils/apiResponse.js';
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
} from './admissions.service.js';

export const list = asyncHandler(async (req, res) => {
  const result = await listAdmissions(req.validated.query);
  return successResponse(res, {
    message: 'Admissions loaded',
    data: result.items,
    meta: { total: result.total, page: result.page, limit: result.limit },
  });
});

export const create = asyncHandler(async (req, res) => {
  const admission = await createAdmission(req.validated.body, req.user?.sub || null);
  return successResponse(res, {
    status: 201,
    message: 'Admission created',
    data: { admission },
  });
});

export const getById = asyncHandler(async (req, res) => {
  const admission = await getAdmissionById(req.validated.params.id);
  return successResponse(res, {
    message: 'Admission loaded',
    data: { admission },
  });
});

export const patchById = (_req, res) => plannedResponse(res, 'Admission update');

export const createClinicalSnapshot = asyncHandler(async (req, res) => {
  const clinicalSnapshot = await addClinicalSnapshot(req.validated.params.id, req.validated.body, req.user?.sub || null);
  return successResponse(res, { status: 201, message: 'Clinical snapshot created', data: { clinicalSnapshot } });
});

export const createAbgTest = asyncHandler(async (req, res) => {
  const abgTest = await addAbgTest(req.validated.params.id, req.validated.body, req.user?.sub || null);
  return successResponse(res, { status: 201, message: 'ABG test created', data: { abgTest } });
});

export const createVentilatorSetting = asyncHandler(async (req, res) => {
  const ventilatorSetting = await addVentilatorSetting(req.validated.params.id, req.validated.body, req.user?.sub || null);
  return successResponse(res, { status: 201, message: 'Ventilator setting created', data: { ventilatorSetting } });
});

export const createAirwayDevice = asyncHandler(async (req, res) => {
  const airwayDevice = await addAirwayDevice(req.validated.params.id, req.validated.body, req.user?.sub || null);
  return successResponse(res, { status: 201, message: 'Airway device record created', data: { airwayDevice } });
});

export const createHumidification = asyncHandler(async (req, res) => {
  const humidification = await addHumidification(req.validated.params.id, req.validated.body, req.user?.sub || null);
  return successResponse(res, { status: 201, message: 'Humidification record created', data: { humidification } });
});

export const createDailyReview = asyncHandler(async (req, res) => {
  const dailyReview = await addDailyReview(req.validated.params.id, req.validated.body, req.user?.sub || null);
  return successResponse(res, { status: 201, message: 'Daily ventilation review created', data: { dailyReview } });
});

export const createOutcome = asyncHandler(async (req, res) => {
  const outcome = await addOutcome(req.validated.params.id, req.validated.body, req.user?.sub || null);
  return successResponse(res, { status: 201, message: 'Outcome created', data: { outcome } });
});
