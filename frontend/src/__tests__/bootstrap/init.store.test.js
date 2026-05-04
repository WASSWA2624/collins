/**
 * Store Initialization Tests
 * File: init.store.test.js
 */
import { initStore } from '@bootstrap/init.store';
import store from '@store';
import { logger } from '@logging';

jest.mock('@store', () => ({
  getState: jest.fn(),
}));

jest.mock('@logging', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Store Initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes successfully when store state is available', async () => {
    store.getState.mockReturnValue({});

    await initStore();

    expect(store.getState).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Store initialized successfully');
  });

  it('throws fatal error when store state is undefined', async () => {
    store.getState.mockReturnValue(undefined);

    await expect(initStore()).rejects.toThrow('Store state is undefined');

    expect(logger.error).toHaveBeenCalledWith('Store initialization failed', {
      error: 'Store state is undefined',
    });
  });

  it('throws fatal error when store.getState throws', async () => {
    const error = new Error('Store error');
    store.getState.mockImplementation(() => {
      throw error;
    });

    await expect(initStore()).rejects.toThrow('Store error');

    expect(logger.error).toHaveBeenCalledWith('Store initialization failed', {
      error: 'Store error',
    });
  });
});

