import { Router } from 'express';
import {
  getFavicon,
  getHealth,
  getLive,
  getReady,
} from './health.controller.js';

export const healthRouter = Router();
export const operationalHealthRouter = Router();

healthRouter.get('/', getHealth);

operationalHealthRouter.get('/health', getHealth);
operationalHealthRouter.get('/live', getLive);
operationalHealthRouter.get('/ready', getReady);
operationalHealthRouter.get('/favicon.ico', getFavicon);
