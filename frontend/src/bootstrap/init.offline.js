/**
 * Offline Initialization
 * File: init.offline.js
 */
import { networkListener, syncManager, hydration } from '@offline';
import { logger } from '@logging';
import store from '@store';
import { actions } from '@store/slices/network.slice';
import { NETWORK_QUALITY } from '@utils/networkQuality';

export async function initOffline() {
  try {
    // Register network listeners
    networkListener.startListening();
    
    // Subscribe to network changes and update Redux store
    networkListener.subscribe((snapshot) => {
      const isOnline = Boolean(snapshot?.isOnline);
      const quality = snapshot?.quality ?? NETWORK_QUALITY.UNKNOWN;
      store.dispatch(actions.setOnline(isOnline));
      store.dispatch(actions.setQuality(quality));
    });
    
    // Initialize current network status in store
    const currentStatus = await networkListener.checkConnectivity();
    const isOnline = Boolean(currentStatus?.isOnline);
    const quality = currentStatus?.quality ?? NETWORK_QUALITY.UNKNOWN;
    store.dispatch(actions.setOnline(isOnline));
    store.dispatch(actions.setQuality(quality));
    
    // Initialize request queue
    // Queue is initialized lazily when first request is queued
    
    // Trigger state hydration
    await hydration.hydrate();
    
    // Start sync manager (will sync when online)
    syncManager.startSync();
    
    logger.info('Offline system initialized successfully');
  } catch (error) {
    logger.error('Offline initialization failed', { error: error.message });
    // Offline failure is not fatal - app can continue without offline support
  }
}

