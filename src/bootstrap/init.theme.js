/**
 * Theme & UI Preferences Initialization
 * File: init.theme.js
 * Loads theme and sidebar collapsed state so they persist and do not default to collapsed.
 */
import store from '@store';
import { actions } from '@store/slices/ui.slice';
import { async } from '@services/storage';
import { logger } from '@logging';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'sidebar_collapsed';

export async function initTheme() {
  try {
    // Try to load persisted theme preference
    let savedTheme = 'light'; // default

    try {
      const persistedTheme = await async.getItem('theme_preference');
      if (persistedTheme && ['light', 'dark', 'high-contrast'].includes(persistedTheme)) {
        savedTheme = persistedTheme;
      }
    } catch (error) {
      logger.debug('Could not load persisted theme, using default', { error: error.message });
    }

    store.dispatch(actions.setTheme(savedTheme));

    // Load persisted sidebar collapsed state (default: expanded, i.e. false)
    try {
      const persistedSidebar = await async.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
      if (persistedSidebar !== null && persistedSidebar !== undefined) {
        const isCollapsed = persistedSidebar === 'true';
        store.dispatch(actions.setSidebarCollapsed(isCollapsed));
      }
    } catch (error) {
      logger.debug('Could not load persisted sidebar state, using default (expanded)', { error: error.message });
    }

    logger.info('Theme initialized successfully', { theme: savedTheme });
  } catch (error) {
    logger.error('Theme initialization failed', { error: error.message });
  }
}

