import crypto from 'crypto';
import { URL } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { operationalHealthRouter } from './modules/health/health.routes.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { successResponse } from './utils/apiResponse.js';

const LOCAL_DEVELOPMENT_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '::1',
  '[::1]',
  '10.0.2.2',
]);

const isPrivateNetworkHost = (hostname) => /^10\./.test(hostname)
  || /^192\.168\./.test(hostname)
  || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

const isDevelopmentCorsOrigin = (origin) => {
  try {
    const { hostname, protocol } = new URL(origin);
    return ['http:', 'https:'].includes(protocol)
      && (LOCAL_DEVELOPMENT_HOSTS.has(hostname) || isPrivateNetworkHost(hostname));
  } catch {
    return false;
  }
};

const isCorsOriginAllowed = (origin) => !origin
  || env.corsOrigins.includes(origin)
  || (env.nodeEnv !== 'production' && isDevelopmentCorsOrigin(origin));

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.trustProxy);
  app.use((req, res, next) => {
    req.id = req.headers['x-request-id'] || crypto.randomUUID();
    res.setHeader('x-request-id', req.id);
    next();
  });

  app.use(helmet());
  app.use(cors({
    origin: (origin, callback) => {
      if (isCorsOriginAllowed(origin)) return callback(null, true);
      return callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }));

  if (env.requestLogging) {
    app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
  }

  app.get('/', (_req, res) => {
    successResponse(res, {
      message: 'AI Vent backend is running',
      data: { apiBasePath: `/api/${env.apiVersion}` },
    });
  });

  app.use(operationalHealthRouter);
  app.use(`/api/${env.apiVersion}`, apiRouter);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
