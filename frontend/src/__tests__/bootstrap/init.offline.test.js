/**
 * Offline Initialization Tests
 * File: init.offline.test.js
 */
import { initOffline } from '@bootstrap/init.offline';
import { networkListener, syncManager, hydration } from '@offline';
import store from '@store';
import { actions } from '@store/slices/network.slice';
import { logger } from '@logging';
import { NETWORK_QUALITY } from '@utils/networkQuality';

jest.mock('@offline', () => ({
  networkListener: {
    startListening: jest.fn(),
    subscribe: jest.fn(),
    checkConnectivity: jest.fn(),
  },
  syncManager: {
    startSync: jest.fn(),
  },
  hydration: {
    hydrate: jest.fn(),
  },
}));

jest.mock('@store', () => ({
  dispatch: jest.fn(),
}));

jest.mock('@store/slices/network.slice', () => ({
  actions: {
    setOnline: jest.fn((isOnline) => ({ type: 'network/setOnline', payload: isOnline })),
    setQuality: jest.fn((quality) => ({ type: 'network/setQuality', payload: quality })),
  },
}));

jest.mock('@logging', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Offline Initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    networkListener.checkConnectivity.mockResolvedValue({
      isOnline: true,
      quality: NETWORK_QUALITY.GOOD,
    });
    hydration.hydrate.mockResolvedValue({ queue: [] });
  });

  it('initializes network listener and sync manager', async () => {
    await initOffline();

    expect(networkListener.startListening).toHaveBeenCalledTimes(1);
    expect(syncManager.startSync).toHaveBeenCalledTimes(1);
  });

  it('subscribes to network changes and updates Redux store', async () => {
    let networkChangeCallback;
    networkListener.subscribe.mockImplementation((callback) => {
      networkChangeCallback = callback;
      return jest.fn(); // unsubscribe function
    });

    await initOffline();

    expect(networkListener.subscribe).toHaveBeenCalledTimes(1);
    expect(networkListener.subscribe).toHaveBeenCalledWith(expect.any(Function));

    // Simulate network status change
    networkChangeCallback({ isOnline: false, quality: NETWORK_QUALITY.UNKNOWN });
    expect(store.dispatch).toHaveBeenCalledWith(actions.setOnline(false));
    expect(store.dispatch).toHaveBeenCalledWith(actions.setQuality(NETWORK_QUALITY.UNKNOWN));

    networkChangeCallback({ isOnline: true, quality: NETWORK_QUALITY.GOOD });
    expect(store.dispatch).toHaveBeenCalledWith(actions.setOnline(true));
    expect(store.dispatch).toHaveBeenCalledWith(actions.setQuality(NETWORK_QUALITY.GOOD));
  });

  it('initializes current network status in Redux store', async () => {
    networkListener.checkConnectivity.mockResolvedValue({
      isOnline: true,
      quality: NETWORK_QUALITY.GOOD,
    });

    await initOffline();

    expect(networkListener.checkConnectivity).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(actions.setOnline(true));
    expect(store.dispatch).toHaveBeenCalledWith(actions.setQuality(NETWORK_QUALITY.GOOD));
  });

  it('initializes network status as offline when connectivity check returns false', async () => {
    networkListener.checkConnectivity.mockResolvedValue({
      isOnline: false,
      quality: NETWORK_QUALITY.UNKNOWN,
    });

    await initOffline();

    expect(store.dispatch).toHaveBeenCalledWith(actions.setOnline(false));
    expect(store.dispatch).toHaveBeenCalledWith(actions.setQuality(NETWORK_QUALITY.UNKNOWN));
  });

  it('triggers state hydration', async () => {
    const mockQueue = [{ id: '1', url: '/api/test' }];
    hydration.hydrate.mockResolvedValue({ queue: mockQueue });

    await initOffline();

    expect(hydration.hydrate).toHaveBeenCalledTimes(1);
  });

  it('handles errors gracefully without throwing', async () => {
    const error = new Error('Offline initialization error');
    networkListener.startListening.mockImplementation(() => {
      throw error;
    });

    await expect(initOffline()).resolves.not.toThrow();

    expect(logger.error).toHaveBeenCalledWith('Offline initialization failed', {
      error: 'Offline initialization error',
    });
  });

  it('handles network connectivity check errors gracefully', async () => {
    networkListener.startListening.mockReturnValue(undefined);
    networkListener.subscribe.mockReturnValue(jest.fn());
    networkListener.checkConnectivity.mockRejectedValue(new Error('Connectivity check failed'));

    await expect(initOffline()).resolves.not.toThrow();

    expect(logger.error).toHaveBeenCalledWith('Offline initialization failed', {
      error: 'Connectivity check failed',
    });
  });

  it('handles hydration errors gracefully', async () => {
    networkListener.startListening.mockReturnValue(undefined);
    networkListener.subscribe.mockReturnValue(jest.fn());
    networkListener.checkConnectivity.mockResolvedValue(true);
    hydration.hydrate.mockRejectedValue(new Error('Hydration failed'));

    await expect(initOffline()).resolves.not.toThrow();

    expect(logger.error).toHaveBeenCalledWith('Offline initialization failed', {
      error: 'Hydration failed',
    });
  });

  it('logs success when initialization completes', async () => {
    await initOffline();

    expect(logger.info).toHaveBeenCalledWith('Offline system initialized successfully');
  });
});

