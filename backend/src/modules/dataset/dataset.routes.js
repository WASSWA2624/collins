import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { plannedResponse } from '../../utils/apiResponse.js';

export const datasetRouter = Router();

datasetRouter.post('/dataset-imports/parse-note', requireAuth, (_req, res) => plannedResponse(res, 'ICU note parsing'));
datasetRouter.post('/dataset-imports', requireAuth, (_req, res) => plannedResponse(res, 'Dataset import creation'));
datasetRouter.get('/dataset-imports/pending-review', requireAuth, (_req, res) => plannedResponse(res, 'Pending dataset import review'));
datasetRouter.post('/dataset-imports/:id/review', requireAuth, (_req, res) => plannedResponse(res, 'Dataset import review'));
datasetRouter.get('/datasets/approved', requireAuth, (_req, res) => plannedResponse(res, 'Approved de-identified datasets'));
datasetRouter.post('/datasets/:id/export', requireAuth, (_req, res) => plannedResponse(res, 'Approved dataset export'));
