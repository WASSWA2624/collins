/**
 * Network Listener Tests
 * File: network.listener.test.js
 */
import NetInfo from '@react-native-community/netinfo';
import {
  __unsafeFlushPendingForTests,
  __unsafeResetForTests,
  checkConnectivity,
  getIsOnline,
  getNetworkSnapshot,
  startListening,
  stopListening,
  subscribe,
} from '@offline/network.listener';
import { NETWORK_QUALITY } from '@utils/networkQuality';

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
}));

jest.mock('@logging', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Network Listener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    __unsafeResetForTests();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('checkConnectivity', () => {
    it('returns true when online', async () => {
      NetInfo.fetch.mockResolvedValue({ isConnected: true });

      const result = await checkConnectivity();

      expect(result).toEqual({ isOnline: true, quality: NETWORK_QUALITY.UNKNOWN });
      expect(getIsOnline()).toBe(true);
    });

    it('returns false when offline', async () => {
      NetInfo.fetch.mockResolvedValue({ isConnected: false });

      const result = await checkConnectivity();

      expect(result).toEqual({ isOnline: false, quality: NETWORK_QUALITY.UNKNOWN });
      expect(getIsOnline()).toBe(false);
    });

    it('treats missing state as offline (false)', async () => {
      NetInfo.fetch.mockResolvedValue(null);

      const result = await checkConnectivity();

      expect(result).toEqual({ isOnline: false, quality: NETWORK_QUALITY.UNKNOWN });
    });

    it('treats null/undefined connectivity as offline (false)', async () => {
      NetInfo.fetch.mockResolvedValue({ isConnected: null });
      await expect(checkConnectivity()).resolves.toEqual({
        isOnline: false,
        quality: NETWORK_QUALITY.UNKNOWN,
      });

      NetInfo.fetch.mockResolvedValue({ isConnected: undefined });
      await expect(checkConnectivity()).resolves.toEqual({
        isOnline: false,
        quality: NETWORK_QUALITY.UNKNOWN,
      });
    });

    it('treats unreachable internet as offline', async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: true,
        isInternetReachable: false,
      });

      const result = await checkConnectivity();

      expect(result).toEqual({ isOnline: false, quality: NETWORK_QUALITY.UNKNOWN });
    });

    it('detects low quality from downlink', async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: true,
        details: { downlink: 0.5 },
      });

      const result = await checkConnectivity();

      expect(result.quality).toBe(NETWORK_QUALITY.LOW);
    });

    it('detects low quality from signal strength', async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: true,
        details: { strength: 20 },
      });

      const result = await checkConnectivity();

      expect(result.quality).toBe(NETWORK_QUALITY.LOW);
    });

    it('detects low quality from cellular generation', async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: true,
        details: { cellularGeneration: '2g' },
      });

      const result = await checkConnectivity();

      expect(result.quality).toBe(NETWORK_QUALITY.LOW);
    });

    it('detects good quality from cellular generation', async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: true,
        details: { cellularGeneration: '4g' },
      });

      const result = await checkConnectivity();

      expect(result.quality).toBe(NETWORK_QUALITY.GOOD);
    });

    it('detects good quality from downlink', async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: true,
        details: { downlink: 10 },
      });

      const result = await checkConnectivity();

      expect(result.quality).toBe(NETWORK_QUALITY.GOOD);
    });

    it('detects good quality for wifi', async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: true,
        type: 'wifi',
      });

      const result = await checkConnectivity();

      expect(result.quality).toBe(NETWORK_QUALITY.GOOD);
    });

    it('notifies subscribers only when status changes', async () => {
      const listener = jest.fn();
      subscribe(listener);

      NetInfo.fetch
        .mockResolvedValueOnce({ isConnected: true }) // true -> true (no change)
        .mockResolvedValueOnce({ isConnected: true }) // true -> true (no change)
        .mockResolvedValueOnce({ isConnected: false }) // true -> false (change)
        .mockResolvedValueOnce({ isConnected: false }); // false -> false (no change)

      await checkConnectivity();
      await checkConnectivity();
      await checkConnectivity();
      await checkConnectivity();

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        isOnline: false,
        quality: NETWORK_QUALITY.UNKNOWN,
      });
    });
  });

  describe('subscribe', () => {
    it('returns an unsubscribe function that prevents future notifications', async () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      const unsubscribe1 = subscribe(listener1);
      subscribe(listener2);

      unsubscribe1();

      NetInfo.fetch.mockResolvedValue({ isConnected: false });
      await checkConnectivity();

      expect(listener1).toHaveBeenCalledTimes(0);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledWith({
        isOnline: false,
        quality: NETWORK_QUALITY.UNKNOWN,
      });
    });
  });

  describe('startListening', () => {
    it('registers a NetInfo event listener and returns an unsubscribe function', () => {
      const unsubscribe = jest.fn();
      NetInfo.addEventListener.mockReturnValue(unsubscribe);

      const result = startListening();

      expect(NetInfo.addEventListener).toHaveBeenCalledTimes(1);
      expect(result).toBe(unsubscribe);
    });

    it('is idempotent (does not register multiple NetInfo listeners)', () => {
      const unsubscribe = jest.fn();
      NetInfo.addEventListener.mockReturnValue(unsubscribe);

      const a = startListening();
      const b = startListening();

      expect(NetInfo.addEventListener).toHaveBeenCalledTimes(1);
      expect(a).toBe(b);
    });

    it('notifies subscribers when NetInfo emits a change', () => {
      const unsubscribe = jest.fn();
      let handler;
      NetInfo.addEventListener.mockImplementation((h) => {
        handler = h;
        return unsubscribe;
      });

      const listener = jest.fn();
      subscribe(listener);

      startListening();
      handler({ isConnected: false });
      jest.advanceTimersByTime(300);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        isOnline: false,
        quality: NETWORK_QUALITY.UNKNOWN,
      });
    });

    it('debounces rapid network updates and emits last snapshot', () => {
      const unsubscribe = jest.fn();
      let handler;
      NetInfo.addEventListener.mockImplementation((h) => {
        handler = h;
        return unsubscribe;
      });

      const listener = jest.fn();
      subscribe(listener);

      startListening();
      handler({ isConnected: false });
      handler({ isConnected: true, details: { cellularGeneration: '4g' } });
      handler({ isConnected: true, details: { downlink: 0.5 } });

      jest.advanceTimersByTime(300);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        isOnline: true,
        quality: NETWORK_QUALITY.LOW,
      });
    });

    it('does not notify when status does not change', () => {
      const unsubscribe = jest.fn();
      let handler;
      NetInfo.addEventListener.mockImplementation((h) => {
        handler = h;
        return unsubscribe;
      });

      const listener = jest.fn();
      subscribe(listener);

      startListening();
      handler({ isConnected: true });

      jest.advanceTimersByTime(300);

      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('stopListening calls NetInfo unsubscribe and allows re-starting', () => {
      const unsubscribe = jest.fn();
      NetInfo.addEventListener.mockReturnValue(unsubscribe);

      startListening();
      stopListening();
      expect(unsubscribe).toHaveBeenCalledTimes(1);

      startListening();
      expect(NetInfo.addEventListener).toHaveBeenCalledTimes(2);
    });
  });

  describe('getNetworkSnapshot', () => {
    it('returns the latest committed snapshot', async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: true,
        details: { cellularGeneration: '4g' },
      });

      await checkConnectivity();

      expect(getNetworkSnapshot()).toEqual({
        isOnline: true,
        quality: NETWORK_QUALITY.GOOD,
      });
    });
  });

  describe('stopListening', () => {
    it('is a no-op when not started', () => {
      expect(() => stopListening()).not.toThrow();
    });
  });

  describe('__unsafeResetForTests', () => {
    it('clears pending debounce timers safely', () => {
      const unsubscribe = jest.fn();
      let handler;
      NetInfo.addEventListener.mockImplementation((h) => {
        handler = h;
        return unsubscribe;
      });

      const listener = jest.fn();
      subscribe(listener);

      startListening();
      handler({ isConnected: false });
      __unsafeResetForTests();

      jest.advanceTimersByTime(300);
      expect(listener).toHaveBeenCalledTimes(0);
    });
  });

  describe('__unsafeFlushPendingForTests', () => {
    it('is a no-op when there is no pending state', () => {
      const snapshot = getNetworkSnapshot();
      __unsafeFlushPendingForTests();
      expect(getNetworkSnapshot()).toEqual(snapshot);
    });
  });
});

