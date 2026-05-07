/**
 * Memoized Selectors
 * File: index.js
 * 
 * Phase 0-7: Only UI and Network selectors are included.
 * Feature selectors will be added in Phase 9.
 */
import { createSelector } from '@reduxjs/toolkit';
import { NETWORK_QUALITY } from '@utils/networkQuality';
import {
  getActiveFacilityContext,
  getActiveFacilityRoleKeys,
  getApprovedMemberships,
  getPermissionsForUser,
  getRoleKeysForUser,
} from '@config/accessControl';

// UI Selectors (defensive for undefined state before rehydration / SSR)
const selectUI = (state) => state?.ui ?? null;
const selectAuthUserForOnboarding = (state) => state?.auth?.user ?? null;
const getUserOnboardingState = (user) => user?.onboardingState || user?.onboarding_state || null;
const getOnboardingCompletedSteps = (onboardingState) => {
  const steps =
    onboardingState?.completedSteps ||
    onboardingState?.completedStepsJson ||
    onboardingState?.completed_steps ||
    onboardingState?.completed_steps_json ||
    [];
  return Array.isArray(steps) ? steps.map((step) => String(step).toUpperCase()) : [];
};
const hasOnboardingStep = (onboardingState, step) =>
  getOnboardingCompletedSteps(onboardingState).includes(step);
const hasServerCompletedOnboarding = (user) => {
  const onboardingState = getUserOnboardingState(user);
  if (!onboardingState) return false;
  return (
    onboardingState.status === 'COMPLETED' ||
    onboardingState.currentStep === 'COMPLETED' ||
    Boolean(onboardingState.completedAt) ||
    hasOnboardingStep(onboardingState, 'COMPLETED')
  );
};
const hasServerClinicalSafetyAcknowledgement = (user) => {
  const onboardingState = getUserOnboardingState(user);
  if (!onboardingState) return false;
  return (
    Boolean(onboardingState.clinicalSafetyAcknowledgedAt) ||
    Boolean(onboardingState.clinicalSafetyAcknowledgement?.acknowledged) ||
    hasOnboardingStep(onboardingState, 'CLINICAL_SAFETY') ||
    hasServerCompletedOnboarding(user)
  );
};
const THEME_PREFERENCES = new Set(['system', 'light', 'dark', 'high-contrast']);
const selectTheme = createSelector([selectUI], (ui) =>
  THEME_PREFERENCES.has(ui?.theme) ? ui.theme : 'light'
);
const selectLocale = createSelector([selectUI], (ui) => ui?.locale ?? 'en');
const selectDensity = createSelector([selectUI], (ui) => ui?.density ?? 'comfortable');
const selectIsLoading = createSelector([selectUI], (ui) => ui?.isLoading ?? false);
const selectSidebarWidth = createSelector([selectUI], (ui) => ui?.sidebarWidth ?? 260);
const selectIsSidebarCollapsed = createSelector([selectUI], (ui) => ui?.isSidebarCollapsed ?? false);
const selectIsHeaderHidden = createSelector([selectUI], (ui) => ui?.isHeaderHidden ?? false);
const selectHeaderActionVisibility = createSelector([selectUI], (ui) => ui?.headerActionVisibility ?? {});
const selectFooterVisible = createSelector([selectUI], (ui) => ui?.footerVisible ?? true);
const selectDisclaimerAcknowledged = createSelector([selectUI], (ui) => ui?.disclaimerAcknowledged ?? false);
const selectClinicalSafetyAcknowledged = createSelector(
  [selectUI, selectAuthUserForOnboarding],
  (ui, user) => Boolean(
    ui?.clinicalSafetyAcknowledged ||
    ui?.disclaimerAcknowledged ||
    hasServerClinicalSafetyAcknowledgement(user)
  )
);
const selectOnboardingCompleted = createSelector(
  [selectUI, selectAuthUserForOnboarding],
  (ui, user) => Boolean(
    ui?.onboardingCompleted ||
    ui?.disclaimerAcknowledged ||
    hasServerCompletedOnboarding(user)
  )
);
// Phase 02: redirect first-run users into onboarding instead of a standalone disclaimer.
const selectOnboardingGuardRedirect = createSelector(
  [(state) => state?._persist?.rehydrated, selectOnboardingCompleted],
  (rehydrated, completed) => (rehydrated && !completed ? '/onboarding' : null)
);
const selectDisclaimerGuardRedirect = createSelector(
  [(state) => state?._persist?.rehydrated, selectDisclaimerAcknowledged],
  (rehydrated, acknowledged) => (rehydrated && !acknowledged ? '/onboarding' : null)
);
const selectAiDecisionSupportEnabled = createSelector([selectUI], () => false);
const selectAiProviderId = createSelector([selectUI], (ui) => ui?.aiProviderId ?? 'openai');
const selectAiModelId = createSelector([selectUI], (ui) => ui?.aiModelId ?? 'gpt-4o-mini');

// Auth Selectors (defensive for undefined state before rehydration / SSR)
const selectAuth = (state) => state?.auth ?? null;
const selectIsAuthenticated = createSelector([selectAuth], (auth) => auth?.isAuthenticated ?? false);
const selectUser = createSelector([selectAuth], (auth) => auth?.user ?? null);
const selectActiveFacility = createSelector([selectUser], (user) => getActiveFacilityContext(user));
const selectActiveFacilityId = createSelector(
  [selectActiveFacility],
  (facility) => facility?.facilityId || facility?.id || null
);
const selectActiveFacilityRoles = createSelector([selectUser], (user) => getActiveFacilityRoleKeys(user));
const selectUserRoleKeys = createSelector([selectUser], (user) => getRoleKeysForUser(user));
const selectUserPermissions = createSelector([selectUser], (user) => getPermissionsForUser(user));
const selectUserMemberships = createSelector([selectUser], (user) => getApprovedMemberships(user));
const selectRequiresActiveFacility = createSelector(
  [selectAuth],
  (auth) => auth?.requiresActiveFacility ?? false
);
const selectAuthErrorCode = createSelector([selectAuth], (auth) => auth?.errorCode ?? null);
const selectAuthSessionErrorCode = createSelector([selectAuth], (auth) => auth?.sessionErrorCode ?? null);
const selectAuthLoading = createSelector([selectAuth], (auth) => auth?.isLoading ?? false);
const selectAuthHasRestoredSession = createSelector(
  [selectAuth],
  (auth) => auth?.hasRestoredSession ?? false
);
const selectAuthSessionStatus = createSelector([selectAuth], (auth) => auth?.sessionStatus ?? 'idle');

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
const selectAssessmentCurrentStep = createSelector(
  [selectVentilation],
  (ventilation) => (typeof ventilation?.assessmentCurrentStep === 'number' ? ventilation.assessmentCurrentStep : 0)
);
const selectAssessmentRecommendationSource = createSelector(
  [selectVentilation],
  () => 'local'
);
const selectMonitoringTimeSeries = createSelector(
  [selectVentilation],
  (ventilation) => (Array.isArray(ventilation?.monitoringTimeSeries) ? ventilation.monitoringTimeSeries : [])
);

// Review Queue
const selectReview = (state) => state?.review ?? null;
const selectReviewQueueItems = createSelector([selectReview], (review) => review?.items ?? []);
const selectReviewQueueMeta = createSelector([selectReview], (review) => review?.meta ?? {});
const selectReviewQueueFilters = createSelector([selectReview], (review) => review?.filters ?? {});
const selectReviewQueueLoading = createSelector([selectReview], (review) => review?.isLoading ?? false);
const selectReviewActionLoadingById = createSelector([selectReview], (review) => review?.actionLoadingById ?? {});
const selectReviewQueueErrorCode = createSelector([selectReview], (review) => review?.errorCode ?? null);

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
  selectClinicalSafetyAcknowledged,
  selectOnboardingCompleted,
  selectOnboardingGuardRedirect,
  selectDisclaimerGuardRedirect,
  selectAiDecisionSupportEnabled,
  selectAiProviderId,
  selectAiModelId,
  // Auth (minimal - Phase 0-7)
  selectIsAuthenticated,
  selectUser,
  selectActiveFacility,
  selectActiveFacilityId,
  selectActiveFacilityRoles,
  selectUserRoleKeys,
  selectUserPermissions,
  selectUserMemberships,
  selectRequiresActiveFacility,
  selectAuthErrorCode,
  selectAuthSessionErrorCode,
  selectAuthLoading,
  selectAuthHasRestoredSession,
  selectAuthSessionStatus,
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
  selectAssessmentCurrentStep,
  selectAssessmentRecommendationSource,
  selectMonitoringTimeSeries,
  // Review
  selectReviewQueueItems,
  selectReviewQueueMeta,
  selectReviewQueueFilters,
  selectReviewQueueLoading,
  selectReviewActionLoadingById,
  selectReviewQueueErrorCode,
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
  selectClinicalSafetyAcknowledged,
  selectOnboardingCompleted,
  selectOnboardingGuardRedirect,
  selectDisclaimerGuardRedirect,
  selectAiDecisionSupportEnabled,
  selectAiProviderId,
  selectAiModelId,
  // Auth (minimal - Phase 0-7)
  selectIsAuthenticated,
  selectUser,
  selectActiveFacility,
  selectActiveFacilityId,
  selectActiveFacilityRoles,
  selectUserRoleKeys,
  selectUserPermissions,
  selectUserMemberships,
  selectRequiresActiveFacility,
  selectAuthErrorCode,
  selectAuthSessionErrorCode,
  selectAuthLoading,
  selectAuthHasRestoredSession,
  selectAuthSessionStatus,
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
  selectAssessmentCurrentStep,
  selectAssessmentRecommendationSource,
  selectMonitoringTimeSeries,
  // Review
  selectReviewQueueItems,
  selectReviewQueueMeta,
  selectReviewQueueFilters,
  selectReviewQueueLoading,
  selectReviewActionLoadingById,
  selectReviewQueueErrorCode,
  // Network
  selectIsOnline,
  selectIsOffline,
  selectIsSyncing,
  selectNetworkQuality,
  selectIsLowQuality,
};
