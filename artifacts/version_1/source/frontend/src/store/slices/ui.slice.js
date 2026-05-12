/**
 * UI Slice
 * Global UI state (theme, locale, loading, etc.)
 * File: ui.slice.js
 */
import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_LOCALE, getDeviceLocale, resolveSupportedLocale } from '@i18n';

const THEME_PREFERENCES = new Set(['system', 'light', 'dark', 'high-contrast']);
const normalizeThemePreference = (value) => (THEME_PREFERENCES.has(value) ? value : 'light');
const normalizeLocale = (value) => resolveSupportedLocale(value) || DEFAULT_LOCALE;

const initialState = {
  theme: 'light', // 'system', 'light', 'dark', 'high-contrast'
  locale: getDeviceLocale(),
  density: 'comfortable', // 'compact', 'comfortable'
  isLoading: false,
  sidebarWidth: 260,
  isSidebarCollapsed: false,
  isHeaderHidden: false,
  headerActionVisibility: {
    notifications: true,
    network: true,
    fullscreen: true,
  },
  footerVisible: true,
  // Onboarding state. Keep the legacy disclaimer flag for persisted clients during route migration.
  onboardingCompleted: false,
  clinicalSafetyAcknowledged: false,
  disclaimerAcknowledged: false,
  // Minimal auth state for Phase 0-7 (guards need this)
  isAuthenticated: false,
  user: null,
  // Legacy keys kept for persisted clients; Phase 16 keeps clinical UI rule-based.
  aiDecisionSupportEnabled: false,
  aiProviderId: 'openai',
  aiModelId: 'gpt-4o-mini',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = normalizeThemePreference(action.payload);
    },
    setLocale: (state, action) => {
      state.locale = normalizeLocale(action.payload);
    },
    setDensity: (state, action) => {
      state.density = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSidebarWidth: (state, action) => {
      state.sidebarWidth = action.payload;
    },
    setSidebarCollapsed: (state, action) => {
      state.isSidebarCollapsed = action.payload;
    },
    setHeaderHidden: (state, action) => {
      state.isHeaderHidden = action.payload;
    },
    toggleHeaderHidden: (state) => {
      state.isHeaderHidden = !state.isHeaderHidden;
    },
    setHeaderActionVisibility: (state, action) => {
      const currentVisibility = state.headerActionVisibility || {};
      state.headerActionVisibility = {
        ...currentVisibility,
        ...action.payload,
      };
    },
    toggleHeaderActionVisibility: (state, action) => {
      const key = action.payload;
      if (!key) return;
      if (!state.headerActionVisibility) {
        state.headerActionVisibility = { ...initialState.headerActionVisibility };
      }
      const currentValue = state.headerActionVisibility[key];
      state.headerActionVisibility[key] = currentValue === undefined ? false : !currentValue;
    },
    setFooterVisible: (state, action) => {
      state.footerVisible = action.payload;
    },
    toggleFooterVisible: (state) => {
      state.footerVisible = !state.footerVisible;
    },
    setDisclaimerAcknowledged: (state, action) => {
      const acknowledged = Boolean(action.payload);
      state.disclaimerAcknowledged = acknowledged;
      state.clinicalSafetyAcknowledged = acknowledged;
      if (acknowledged) {
        state.onboardingCompleted = true;
      }
    },
    setClinicalSafetyAcknowledged: (state, action) => {
      const acknowledged = Boolean(action.payload);
      state.clinicalSafetyAcknowledged = acknowledged;
      state.disclaimerAcknowledged = acknowledged;
    },
    setOnboardingCompleted: (state, action) => {
      state.onboardingCompleted = Boolean(action.payload);
    },
    completeOnboarding: (state) => {
      state.onboardingCompleted = true;
      state.clinicalSafetyAcknowledged = true;
      state.disclaimerAcknowledged = true;
    },
    // Minimal auth reducers for Phase 0-7 (guards need this)
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    setAiDecisionSupportEnabled: (state) => {
      state.aiDecisionSupportEnabled = false;
    },
    setAiProviderId: (state, action) => {
      if (typeof action.payload === 'string' && action.payload.trim()) {
        state.aiProviderId = action.payload.trim();
      }
    },
    setAiModelId: (state, action) => {
      if (typeof action.payload === 'string' && action.payload.trim()) {
        state.aiModelId = action.payload.trim();
      }
    },
  },
});

const actions = uiSlice.actions;
const reducer = uiSlice.reducer;

export { actions, reducer };
export default { actions, reducer };
