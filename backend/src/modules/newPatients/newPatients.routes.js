import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  create,
  createCurrentReadings,
  createAbgTest,
  createAirwayDevice,
  createClinicalSnapshot,
  createDailyReview,
  createHumidification,
  createOutcome,
  createPatientReasonStep,
  createVentilatorSetting,
  getById,
  list,
  patchById,
  recommendVentilatorSettings,
  saveOxygenAbgVentilatorStep,
  saveReviewStep,
} from './newPatients.controller.js';
import {
  abgTestSchema,
  newPatientCurrentReadingsSchema,
  newPatientIdSchema,
  newPatientListSchema,
  newPatientOxygenAbgVentilatorStepSchema,
  newPatientReasonStepSchema,
  newPatientSaveReviewStepSchema,
  newPatientVentilatorRecommendationSchema,
  airwayDeviceSchema,
  clinicalSnapshotSchema,
  createNewPatientSchema,
  dailyReviewSchema,
  humidificationSchema,
  outcomeSchema,
  patchNewPatientSchema,
  ventilatorSettingSchema,
} from './newPatients.validators.js';

export const newPatientsRouter = Router();

newPatientsRouter.use(requireAuth);
newPatientsRouter.get('/', validateRequest(newPatientListSchema), list);
newPatientsRouter.post('/', validateRequest(createNewPatientSchema), create);
newPatientsRouter.post('/three-step/patient-reason', validateRequest(newPatientReasonStepSchema), createPatientReasonStep);
newPatientsRouter.post('/ventilator-recommendation', validateRequest(newPatientVentilatorRecommendationSchema), recommendVentilatorSettings);
newPatientsRouter.get('/:id', validateRequest(newPatientIdSchema), getById);
newPatientsRouter.patch('/:id', validateRequest(patchNewPatientSchema), patchById);
newPatientsRouter.post('/:id/three-step/oxygen-abg-ventilator', validateRequest(newPatientOxygenAbgVentilatorStepSchema), saveOxygenAbgVentilatorStep);
newPatientsRouter.post('/:id/three-step/save-review', validateRequest(newPatientSaveReviewStepSchema), saveReviewStep);
newPatientsRouter.post('/:id/current-readings', validateRequest(newPatientCurrentReadingsSchema), createCurrentReadings);
newPatientsRouter.post('/:id/clinical-snapshots', validateRequest(clinicalSnapshotSchema), createClinicalSnapshot);
newPatientsRouter.post('/:id/abg-tests', validateRequest(abgTestSchema), createAbgTest);
newPatientsRouter.post('/:id/ventilator-settings', validateRequest(ventilatorSettingSchema), createVentilatorSetting);
newPatientsRouter.post('/:id/airway-device', validateRequest(airwayDeviceSchema), createAirwayDevice);
newPatientsRouter.post('/:id/humidification', validateRequest(humidificationSchema), createHumidification);
newPatientsRouter.post('/:id/daily-review', validateRequest(dailyReviewSchema), createDailyReview);
newPatientsRouter.post('/:id/outcome', validateRequest(outcomeSchema), createOutcome);
