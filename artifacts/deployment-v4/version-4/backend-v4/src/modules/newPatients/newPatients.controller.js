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
  createNewPatient,
  createNewPatientReasonStep,
  getNewPatientById,
  listNewPatients,
  recommendNewPatientVentilatorSettings,
  saveNewPatientAbgVentilatorUpdate,
  saveNewPatientOxygenAbgVentilatorStep,
  saveNewPatientReviewStep,
  updateNewPatient,
} from './newPatients.service.js';

export const list = asyncHandler(async (req, res) => {
  const result = await listNewPatients(req.user?.sub, req.validated.query);
  return successResponse(res, {
    message: 'New patients loaded',
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
  const result = await createNewPatient(req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, {
    status: result.syncStatus === 'duplicate' ? 200 : 201,
    message: result.syncStatus === 'duplicate' ? 'Duplicate New Patient request returned original result' : 'New Patient created',
    data: result,
  });
});

export const createPatientReasonStep = asyncHandler(async (req, res) => {
  const result = await createNewPatientReasonStep(req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, {
    status: result.syncStatus === 'duplicate' ? 200 : 201,
    message: result.syncStatus === 'duplicate'
      ? 'Duplicate patient and reason step returned original result'
      : 'Patient and reason step saved',
    data: result,
  });
});

export const getById = asyncHandler(async (req, res) => {
  const admission = await getNewPatientById(req.user?.sub, req.validated.params.id);
  return successResponse(res, {
    message: 'New Patient record loaded',
    data: { admission },
  });
});

export const patchById = asyncHandler(async (req, res) => {
  const result = await updateNewPatient(req.user?.sub, req.validated.params.id, req.validated.body, buildAuditContext(req));
  return successResponse(res, {
    message: result.syncStatus === 'duplicate' ? 'Duplicate New Patient update returned original result' : 'New Patient updated',
    data: result,
  });
});

export const saveOxygenAbgVentilatorStep = asyncHandler(async (req, res) => {
  const result = await saveNewPatientOxygenAbgVentilatorStep(
    req.user?.sub,
    req.validated.params.id,
    req.validated.body,
    buildAuditContext(req)
  );
  return successResponse(res, {
    message: result.syncStatus === 'duplicate'
      ? 'Duplicate oxygen, ABG, and ventilator step returned original result'
      : 'Oxygen, ABG, and ventilator step saved',
    data: result,
  });
});

export const createAbgVentilatorUpdate = asyncHandler(async (req, res) => {
  const result = await saveNewPatientAbgVentilatorUpdate(
    req.user?.sub,
    req.validated.params.id,
    req.validated.body,
    buildAuditContext(req)
  );
  return successResponse(res, {
    message: result.syncStatus === 'duplicate'
      ? 'Duplicate ABG and ventilator settings update returned original result'
      : 'ABG and ventilator settings saved as new history entries',
    data: result,
  });
});

export const saveReviewStep = asyncHandler(async (req, res) => {
  const result = await saveNewPatientReviewStep(
    req.user?.sub,
    req.validated.params.id,
    req.validated.body,
    buildAuditContext(req)
  );
  return successResponse(res, {
    message: result.syncStatus === 'duplicate'
      ? 'Duplicate save and review step returned original result'
      : 'Save and review step recorded',
    data: result,
  });
});

export const recommendVentilatorSettings = asyncHandler(async (req, res) => {
  const result = await recommendNewPatientVentilatorSettings(req.validated.body, req.user?.sub);
  return successResponse(res, {
    message: 'Ventilator recommendation generated from approved dataset cases',
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
