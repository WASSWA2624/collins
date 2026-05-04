import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  approvedDatasets,
  createImport,
  exportDataset,
  parseNote,
  pendingReview,
  reviewImport,
} from './dataset.controller.js';
import {
  approvedDatasetsSchema,
  createDatasetImportSchema,
  exportDatasetSchema,
  parseNoteSchema,
  pendingDatasetSchema,
  reviewDatasetSchema,
} from './dataset.validators.js';

export const datasetRouter = Router();

datasetRouter.use(requireAuth);
datasetRouter.post('/dataset-imports/parse-note', validateRequest(parseNoteSchema), parseNote);
datasetRouter.post('/dataset-imports', validateRequest(createDatasetImportSchema), createImport);
datasetRouter.get('/dataset-imports/pending-review', validateRequest(pendingDatasetSchema), pendingReview);
datasetRouter.post('/dataset-imports/:id/review', validateRequest(reviewDatasetSchema), reviewImport);
datasetRouter.get('/datasets/approved', validateRequest(approvedDatasetsSchema), approvedDatasets);
datasetRouter.post('/datasets/:id/export', validateRequest(exportDatasetSchema), exportDataset);
