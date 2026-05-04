import crypto from 'crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.use((req, res, next) => {
    req.id = req.headers['x-request-id'] || crypto.randomUUID();
    res.setHeader('x-request-id', req.id);
    next();
  });

  app.use(helmet());
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
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
    res.json({
      success: true,
      message: 'Collins backend is running',
      data: { apiBasePath: `/api/${env.apiVersion}` },
    });
  });

  app.use(`/api/${env.apiVersion}`, apiRouter);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
