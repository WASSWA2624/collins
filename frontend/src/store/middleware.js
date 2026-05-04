/**
 * Custom Middleware
 * File: middleware.js
 */
import { logger } from '@logging';

const loggingMiddleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Redux action', { type: action.type, payload: action.payload });
  }
  return next(action);
};

export { loggingMiddleware };
export default [loggingMiddleware];

