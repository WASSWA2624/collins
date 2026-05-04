/**
 * Bootstrap Entry Point
 * Single entry for app initialization
 * File: index.js
 */
import { initSecurity } from './init.security';
import { initStore } from './init.store';
import { initTheme } from './init.theme';
import { initOffline } from './init.offline';
import { logger } from '@logging';

/**
 * Bootstrap the application
 * Initializes all global systems in the correct order:
 * 1. Security (protects everything)
 * 2. Store (required by most layers)
 * 3. Theme (required by UI)
 * 4. Offline (depends on store and services)
 */
export async function bootstrapApp() {
  try {
    logger.info('Starting application bootstrap...');
    
    // 1. Security - must initialize first
    await initSecurity();
    
    // 2. Store - required by most layers
    await initStore();
    
    // 3. Theme - required by UI
    await initTheme();
    
    // 4. Offline - depends on store and services
    await initOffline();
    
    logger.info('Application bootstrap completed successfully');
  } catch (error) {
    logger.error('Application bootstrap failed', { error: error.message, stack: error.stack });
    // Fatal errors should be handled by ErrorBoundary
    throw error;
  }
}

