/**
 * Memoized Selectors
 * File: index.js
 * 
 * Phase 0-7: Only UI and Network selectors are included.
 * Feature selectors will be added in Phase 9.
 */
import { createSelector } from '@reduxjs/toolkit';
import { NETWORK_QUALITY } from '@utils/networkQuality';

// UI Selectors (defensive for undefined state before rehydration / SSR)
const selectUI = (state) => state?.ui ?? null;
const selectTheme = createSelector([selectUI], (ui) => ui?.theme ?? 'light');
const selectLocale = createSelector([selectUI], (ui) => ui?.locale ?? 'en');
const selectDensity = createSelector([selectUI], (ui) => ui?.density ?? 'comfortable');
const selectIsLoading = createSelector([selectUI], (ui) => ui?.isLoading ?? false);
const selectSidebarWidth = createSelector([selectUI], (ui) => ui?.sidebarWidth ?? 260);
const selectIsSidebarCollapsed = createSelector([selectUI], (ui) => ui?.isSidebarCollapsed ?? false);
const selectIsHeaderHidden = createSelector([selectUI], (ui) => ui?.isHeaderHidden ?? false);
const selectHeaderActionVisibility = createSelector([selectUI], (ui) => ui?.headerActionVisibility ?? {});
const selectFooterVisible = createSelector([selectUI], (ui) => ui?.footerVisible ?? true);
const selectDisclaimerAcknowledged = createSelector([selectUI], (ui) => ui?.disclaimerAcknowledged ?? false);

// Auth Selectors (defensive for undefined state before rehydration / SSR)
const selectAuth = (state) => state?.auth ?? null;
const selectIsAuthenticated = createSelector([selectAuth], (auth) => auth?.isAuthenticated ?? false);
const selectUser = createSelector([selectAuth], (auth) => auth?.user ?? null);
const selectAuthErrorCode = createSelector([selectAuth], (auth) => auth?.errorCode ?? null);
const selectAuthLoading = createSelector([selectAuth], (auth) => auth?.isLoading ?? false);

// Ventilation (Session persistence)
const selectVentilation = (state) => state?.ventilation ?? null;
const selectVentilationSessionId = createSelector([selectVentilation], (ventilation) => ventilation?.currentSessionId ?? null);
const selectVentilationInputs = createSelector([selectVentilation], (ventilation) => ventilation?.currentInputs ?? null);
const selectVentilationRecommendationSummary = createSelector(
  [selectVentilation],
  (ventilation) => ventilation?.lastRecommendationSummary ?? null
);
const selectVentilationHydrating = createSelector([selectVentilation], (ventilation) => ventilation?.isHydrating ?? false);
const selectVentilationHydratedAt = createSelector([selectVentilation], (ventilation) => ventilation?.hydratedAt ?? null);
const selectVentilationErrorCode = createSelector([selectVentilation], (ventilation) => ventilation?.errorCode ?? null);
const selectVentilationSessionHistory = createSelector(
  [selectVentilation],
  (ventilation) => ventilation?.sessionHistory ?? null
);
const selectVentilationHistoryErrorCode = createSelector(
  [selectVentilation],
  (ventilation) => ventilation?.historyErrorCode ?? null
);
const selectVentilationHistoryLoading = createSelector(
  [selectVentilation],
  (ventilation) => ventilation?.isHistoryLoading ?? false
);

// Network Selectors (defensive for undefined state)
const selectNetwork = (state) => state?.network ?? null;
const selectIsOnline = createSelector([selectNetwork], (network) => network?.isOnline ?? true);
const selectIsOffline = createSelector([selectIsOnline], (isOnline) => !isOnline);
const selectIsSyncing = createSelector([selectNetwork], (network) => network?.isSyncing ?? false);
const selectNetworkQuality = createSelector([selectNetwork], (network) => network?.quality ?? null);
const selectIsLowQuality = createSelector(
  [selectIsOnline, selectNetworkQuality],
  (isOnline, quality) => isOnline && quality === NETWORK_QUALITY.LOW
);

export {
  // UI
  selectTheme,
  selectLocale,
  selectDensity,
  selectIsLoading,
  selectSidebarWidth,
  selectIsSidebarCollapsed,
  selectIsHeaderHidden,
  selectHeaderActionVisibility,
  selectFooterVisible,
  selectDisclaimerAcknowledged,
  // Auth (minimal - Phase 0-7)
  selectIsAuthenticated,
  selectUser,
  selectAuthErrorCode,
  selectAuthLoading,
  // Ventilation
  selectVentilationSessionId,
  selectVentilationInputs,
  selectVentilationRecommendationSummary,
  selectVentilationHydrating,
  selectVentilationHydratedAt,
  selectVentilationErrorCode,
  selectVentilationSessionHistory,
  selectVentilationHistoryErrorCode,
  selectVentilationHistoryLoading,
  // Network
  selectIsOnline,
  selectIsOffline,
  selectIsSyncing,
  selectNetworkQuality,
  selectIsLowQuality,
};

export default {
  // UI
  selectTheme,
  selectLocale,
  selectDensity,
  selectIsLoading,
  selectSidebarWidth,
  selectIsSidebarCollapsed,
  selectIsHeaderHidden,
  selectHeaderActionVisibility,
  selectFooterVisible,
  selectDisclaimerAcknowledged,
  // Auth (minimal - Phase 0-7)
  selectIsAuthenticated,
  selectUser,
  selectAuthErrorCode,
  selectAuthLoading,
  // Ventilation
  selectVentilationSessionId,
  selectVentilationInputs,
  selectVentilationRecommendationSummary,
  selectVentilationHydrating,
  selectVentilationHydratedAt,
  selectVentilationErrorCode,
  selectVentilationSessionHistory,
  selectVentilationHistoryErrorCode,
  selectVentilationHistoryLoading,
  // Network
  selectIsOnline,
  selectIsOffline,
  selectIsSyncing,
  selectNetworkQuality,
  selectIsLowQuality,
};
