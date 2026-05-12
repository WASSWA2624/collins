/**
 * Store Middleware Tests
 * File: middleware.test.js
 */
import { loggingMiddleware } from '@store/middleware';
import { logger } from '@logging';

jest.mock('@logging', () => ({
  logger: {
    debug: jest.fn(),
  },
}));

describe('store/middleware', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    logger.debug.mockClear();
  });

  it('logs actions in development', () => {
    process.env.NODE_ENV = 'development';
    const store = { getState: jest.fn() };
    const next = jest.fn();
    const action = { type: 'TEST_ACTION', payload: { id: 1 } };

    loggingMiddleware(store)(next)(action);

    expect(logger.debug).toHaveBeenCalledWith('Redux action', {
      type: action.type,
      payload: action.payload,
    });
    expect(next).toHaveBeenCalledWith(action);
  });

  it('skips logging outside development', () => {
    process.env.NODE_ENV = 'production';
    const store = { getState: jest.fn() };
    const next = jest.fn();
    const action = { type: 'TEST_ACTION' };

    loggingMiddleware(store)(next)(action);

    expect(logger.debug).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });
});
