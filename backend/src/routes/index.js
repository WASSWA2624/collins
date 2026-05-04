import { Router } from 'express';
import { healthRouter } from '../modules/health/health.routes.js';
import { authRouter } from '../modules/auth/auth.routes.js';
import { facilitiesRouter } from '../modules/facilities/facilities.routes.js';
import { myFacilities } from '../modules/facilities/facilities.controller.js';
import { admissionsRouter } from '../modules/admissions/admissions.routes.js';
import { reviewRouter } from '../modules/review/review.routes.js';
import { datasetRouter } from '../modules/dataset/dataset.routes.js';
import { referencesRouter } from '../modules/references/references.routes.js';
import { syncRouter } from '../modules/sync/sync.routes.js';
import { adminRouter } from '../modules/admin/admin.routes.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.get('/me/facilities', requireAuth, myFacilities);
apiRouter.use('/facilities', facilitiesRouter);
apiRouter.use('/admissions', admissionsRouter);
apiRouter.use('/review', reviewRouter);
apiRouter.use('/sync', syncRouter);
apiRouter.use('/', datasetRouter);
apiRouter.use('/', referencesRouter);
apiRouter.use('/admin', adminRouter);
