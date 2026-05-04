/**
 * Network Listener
 * Monitors network connectivity
 * File: network.listener.js
 */
import NetInfo from '@react-native-community/netinfo';
import { logger } from '@logging';
import { NETWORK_QUALITY } from '@utils/networkQuality';

const DEFAULT_DEBOUNCE_MS = 300;
const LOW_QUALITY_DOWNLINK_MBPS = 1.5;

let networkState = {
  isOnline: true,
  quality: NETWORK_QUALITY.UNKNOWN,
};
let pendingState = null;
let debounceTimer = null;
let listeners = new Set();
let netInfoUnsubscribe = null;

const normalizeIsOnline = (state) => {
  if (!state || state.isConnected == null) return false;
  if (state.isConnected === false) return false;
  if (state.isInternetReachable === false) return false;
  return true;
};

const resolveNetworkQuality = (state, isOnline) => {
  if (!isOnline) return NETWORK_QUALITY.UNKNOWN;

  const details = state?.details || {};
  const downlink = typeof details.downlink === 'number' ? details.downlink : null;
  const strength = typeof details.strength === 'number' ? details.strength : null;
  const generation = typeof details.cellularGeneration === 'string' ? details.cellularGeneration : null;

  if (strength !== null && strength >= 0 && strength <= 30) {
    return NETWORK_QUALITY.LOW;
  }

  if (downlink !== null && downlink <= LOW_QUALITY_DOWNLINK_MBPS) {
    return NETWORK_QUALITY.LOW;
  }

  if (generation === '2g' || generation === '3g') {
    return NETWORK_QUALITY.LOW;
  }

  if (generation === '4g' || generation === '5g') {
    return NETWORK_QUALITY.GOOD;
  }

  if (downlink !== null && downlink > LOW_QUALITY_DOWNLINK_MBPS) {
    return NETWORK_QUALITY.GOOD;
  }

  if (state?.type === 'wifi') {
    return NETWORK_QUALITY.GOOD;
  }

  return NETWORK_QUALITY.UNKNOWN;
};

const notify = () => {
  listeners.forEach((listener) => {
    try {
      listener(networkState);
    } catch {
      // Listener errors must not break the global connectivity observer.
    }
  });
};

const flushPending = () => {
  if (!pendingState) return;
  networkState = pendingState;
  pendingState = null;
  notify();
};

const scheduleFlush = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    flushPending();
  }, DEFAULT_DEBOUNCE_MS);
};

const applyState = (state, { flush = false } = {}) => {
  const nextIsOnline = normalizeIsOnline(state);
  const nextQuality = resolveNetworkQuality(state, nextIsOnline);
  const nextState = { isOnline: nextIsOnline, quality: nextQuality };
  const didChange =
    networkState.isOnline !== nextIsOnline || networkState.quality !== nextQuality;

  if (!didChange) {
    return networkState;
  }

  if (flush) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    pendingState = null;
    networkState = nextState;
    logger.info('Network status changed', nextState);
    notify();
    return networkState;
  }

  pendingState = nextState;
  logger.info('Network status changed', nextState);
  scheduleFlush();

  return nextState;
};

/**
 * Fetch current connectivity from NetInfo and update internal state.
 * Notifies subscribers only when the online status changes.
 */
export const checkConnectivity = async () => {
  const state = await NetInfo.fetch();
  return applyState(state, { flush: true });
};

/**
 * Subscribe to online-status changes.
 * Returns an unsubscribe function.
 */
export const subscribe = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Start listening to NetInfo changes.
 * Idempotent: subsequent calls return the same unsubscribe function.
 */
export const startListening = () => {
  if (netInfoUnsubscribe) return netInfoUnsubscribe;

  netInfoUnsubscribe = NetInfo.addEventListener((state) => {
    applyState(state);
  });

  return netInfoUnsubscribe;
};

export const stopListening = () => {
  if (!netInfoUnsubscribe) return;
  try {
    netInfoUnsubscribe();
  } finally {
    netInfoUnsubscribe = null;
  }
};

export const getIsOnline = () => networkState.isOnline;
export const getNetworkSnapshot = () => ({ ...networkState });

/**
 * Testing-only reset helper to avoid state leaking across unit tests.
 * @private
 */
export const __unsafeResetForTests = () => {
  stopListening();
  networkState = { isOnline: true, quality: NETWORK_QUALITY.UNKNOWN };
  pendingState = null;
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  listeners = new Set();
};

/**
 * Testing-only helper to flush pending state safely.
 * @private
 */
export const __unsafeFlushPendingForTests = () => {
  flushPending();
};

export default {
  checkConnectivity,
  subscribe,
  startListening,
  stopListening,
  getIsOnline,
  getNetworkSnapshot,
};

