/**
 * Logger Implementation
 * Centralized logging with levels
 * File: logger.js
 */
import { NODE_ENV } from '@config';
import { DEBUG, INFO, WARN, ERROR, FATAL } from './levels';

const safeStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({
      level: ERROR,
      message: 'Failed to serialize log entry',
    });
  }
};

const log = (level, message, data = {}) => {
  if (NODE_ENV === 'production' && level === DEBUG) {
    return;
  }

  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...data,
  };

  // In production, send to monitoring service
  // For now, console logging
  const consoleMethod = level === FATAL ? 'error' : level;
  const fn = console?.[consoleMethod] || console?.log;
  if (typeof fn === 'function') {
    fn(safeStringify(logEntry));
  }
};

const logger = {
  debug: (message, data) => log(DEBUG, message, data),
  info: (message, data) => log(INFO, message, data),
  warn: (message, data) => log(WARN, message, data),
  error: (message, data) => log(ERROR, message, data),
  fatal: (message, data) => log(FATAL, message, data),
};

export { logger };

