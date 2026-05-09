import { env } from '../../config/env.js';
import {
  checkMariaDbConnection,
  sanitizeDatabaseAttempt,
  sanitizeMariaDbConnectionConfig,
  summarizeDatabaseUrl,
} from '../../config/database.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { errorResponse, successResponse } from '../../utils/apiResponse.js';
import { writeDiagnosticLog } from '../../utils/diagnosticLogger.js';

const buildHealthData = (database) => ({
  service: 'collins-backend',
  apiVersion: env.apiVersion,
  environment: env.nodeEnv,
  database,
  timestamp: new Date().toISOString(),
});

const getDatabaseErrorSummary = (error, attemptedConfigs = []) => ({
  name: error?.name,
  code: error?.code,
  errno: error?.errno,
  sqlState: error?.sqlState,
  fatal: error?.fatal,
  message: error?.message,
  attemptedConfigs: attemptedConfigs.map(sanitizeMariaDbConnectionConfig),
});

const shouldIncludeDebug = (req) => String(req.query.debug || '').toLowerCase() === 'true';

const buildDatabaseDiagnostics = (result) => ({
  enabled: env.databaseDiagnosticsEnabled,
  databaseUrl: summarizeDatabaseUrl(env.databaseUrl),
  runtime: {
    hostOverride: env.databaseHost || null,
    portOverride: env.databasePort || null,
    socketPathOverride: env.databaseSocketPath || null,
    useTextProtocol: env.databaseUseTextProtocol,
    connectionLimit: env.databaseConnectionLimit,
    connectTimeoutMs: env.databaseConnectTimeoutMs,
    acquireTimeoutMs: env.databaseAcquireTimeoutMs,
  },
  status: result.status,
  selectedConfig: result.config ? sanitizeMariaDbConnectionConfig(result.config) : null,
  attempts: (result.attempts || []).map(sanitizeDatabaseAttempt),
});

const getDebugMeta = (req, result) => {
  if (!shouldIncludeDebug(req)) return {};

  if (!env.databaseDiagnosticsEnabled) {
    return {
      databaseDiagnostics: {
        enabled: false,
        message: 'Set DATABASE_DIAGNOSTICS_ENABLED=true temporarily to expose sanitized database diagnostics.',
      },
    };
  }

  return { databaseDiagnostics: buildDatabaseDiagnostics(result) };
};

const checkDatabase = async (req) => {
  const result = await checkMariaDbConnection(env.databaseUrl, {
    host: env.databaseHost,
    port: env.databasePort,
    socketPath: env.databaseSocketPath,
    connectTimeoutMs: env.databaseConnectTimeoutMs,
    acquireTimeoutMs: env.databaseAcquireTimeoutMs,
  });

  if (result.status === 'connected') {
    return { status: 'connected', result };
  }

  const summary = getDatabaseErrorSummary(result.error, result.attemptedConfigs);
  console.error('Database readiness check failed', summary);

  if (env.databaseDiagnosticsEnabled) {
    writeDiagnosticLog('database_readiness_failed', {
      requestId: req?.id,
      diagnostics: buildDatabaseDiagnostics(result),
    });
  }

  return { status: 'unavailable', result };
};

export const getHealth = asyncHandler(async (req, res) => {
  let database = 'not_checked';
  let meta = {};

  if (req.query.includeDb === 'true') {
    const databaseCheck = await checkDatabase(req);
    database = databaseCheck.status;
    meta = getDebugMeta(req, databaseCheck.result);
  }

  return successResponse(res, {
    message: 'AI Vent backend health check passed',
    data: buildHealthData(database),
    meta,
  });
});

export const getLive = asyncHandler(async (_req, res) => successResponse(res, {
  message: 'AI Vent backend liveness check passed',
  data: buildHealthData('not_checked'),
}));

export const getReady = asyncHandler(async (req, res) => {
  const databaseCheck = await checkDatabase(req);
  const database = databaseCheck.status;

  if (database !== 'connected') {
    return errorResponse(res, {
      status: 503,
      message: 'AI Vent backend readiness check failed',
      errors: [
        {
          path: ['database'],
          message: 'Database connection is unavailable',
        },
      ],
      meta: {
        database,
        ...getDebugMeta(req, databaseCheck.result),
      },
    });
  }

  return successResponse(res, {
    message: 'AI Vent backend readiness check passed',
    data: buildHealthData(database),
    meta: getDebugMeta(req, databaseCheck.result),
  });
});

export const getFavicon = (_req, res) => res.status(204).end();
