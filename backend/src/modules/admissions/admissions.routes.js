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
  patchAdmissionSchema,
  ventilatorSettingSchema,
} from './admissions.validators.js';

export const admissionsRouter = Router();

admissionsRouter.use(requireAuth);
admissionsRouter.get('/', validateRequest(admissionListSchema), list);
admissionsRouter.post('/', validateRequest(createAdmissionSchema), create);
admissionsRouter.get('/:id', validateRequest(admissionIdSchema), getById);
admissionsRouter.patch('/:id', validateRequest(patchAdmissionSchema), patchById);
admissionsRouter.post('/:id/clinical-snapshots', validateRequest(clinicalSnapshotSchema), createClinicalSnapshot);
admissionsRouter.post('/:id/abg-tests', validateRequest(abgTestSchema), createAbgTest);
admissionsRouter.post('/:id/ventilator-settings', validateRequest(ventilatorSettingSchema), createVentilatorSetting);
admissionsRouter.post('/:id/airway-device', validateRequest(airwayDeviceSchema), createAirwayDevice);
admissionsRouter.post('/:id/humidification', validateRequest(humidificationSchema), createHumidification);
admissionsRouter.post('/:id/daily-review', validateRequest(dailyReviewSchema), createDailyReview);
admissionsRouter.post('/:id/outcome', validateRequest(outcomeSchema), createOutcome);
