import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { trainingHelp } from './trainingHelp.controller.js';
import { trainingHelpSchema } from './trainingHelp.validators.js';

export const trainingHelpRouter = Router();

trainingHelpRouter.use(requireAuth);
trainingHelpRouter.get('/', validateRequest(trainingHelpSchema), trainingHelp);
