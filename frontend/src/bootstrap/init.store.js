/**
 * Store Initialization
 * File: init.store.js
 */
import store from '@store';
import { logger } from '@logging';

const waitForPersistorBootstrapped = (persistor, { timeoutMs = 5000 } = {}) => {
  if (!persistor || typeof persistor.subscribe !== 'function') {
    return Promise.resolve();
  }

  const alreadyBootstrapped = Boolean(persistor.getState?.()?.bootstrapped);
  if (alreadyBootstrapped) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      try {
        unsubscribe?.();
      } catch {
        // ignore cleanup errors
      }
      reject(new Error('Persistor hydration timed out'));
    }, timeoutMs);

    const unsubscribe = persistor.subscribe(() => {
      const { bootstrapped } = persistor.getState?.() ?? {};
      if (bootstrapped) {
        clearTimeout(timeoutId);
        unsubscribe();
        resolve();
      }
    });
  });
};

export async function initStore() {
  try {
    // Store is created synchronously in store/index.js
    // Persistence is handled by redux-persist. Hydration must complete
    // before we render the app tree (bootstrap-config.mdc).
    
    // Verify store is accessible
    const state = store.getState();
    if (!state) {
      throw new Error('Store state is undefined');
    }

    // Wait for persisted state hydration to complete
    await waitForPersistorBootstrapped(store.persistor);
    
    logger.info('Store initialized successfully');
  } catch (error) {
    logger.error('Store initialization failed', { error: error.message });
    throw error; // Store failure is fatal
  }
}

