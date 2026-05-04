import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  create,
  createAbgTest,
  createAirwayDevice,
  createClinicalSnapshot,
  createDailyReview,
  createHumidification,
  createOutcome,
  createVentilatorSetting,
  getById,
  list,
  patchById,
} from './admissions.controller.js';
import {
  abgTestSchema,
  admissionIdSchema,
  admissionListSchema,
  airwayDeviceSchema,
  clinicalSnapshotSchema,
  createAdmissionSchema,
  dailyReviewSchema,
  humidificationSchema,
  outcomeSchema,
  ventilatorSettingSchema,
} from './admissions.validators.js';

export const admissionsRouter = Router();

admissionsRouter.get('/', validateRequest(admissionListSchema), list);
admissionsRouter.post('/', requireAuth, validateRequest(createAdmissionSchema), create);
admissionsRouter.get('/:id', validateRequest(admissionIdSchema), getById);
admissionsRouter.patch('/:id', requireAuth, validateRequest(admissionIdSchema), patchById);
admissionsRouter.post('/:id/clinical-snapshots', requireAuth, validateRequest(clinicalSnapshotSchema), createClinicalSnapshot);
admissionsRouter.post('/:id/abg-tests', requireAuth, validateRequest(abgTestSchema), createAbgTest);
admissionsRouter.post('/:id/ventilator-settings', requireAuth, validateRequest(ventilatorSettingSchema), createVentilatorSetting);
admissionsRouter.post('/:id/airway-device', requireAuth, validateRequest(airwayDeviceSchema), createAirwayDevice);
admissionsRouter.post('/:id/humidification', requireAuth, validateRequest(humidificationSchema), createHumidification);
admissionsRouter.post('/:id/daily-review', requireAuth, validateRequest(dailyReviewSchema), createDailyReview);
admissionsRouter.post('/:id/outcome', requireAuth, validateRequest(outcomeSchema), createOutcome);
