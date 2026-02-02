/**
 * UI Slice
 * Global UI state (theme, locale, loading, etc.)
 * File: ui.slice.js
 */
import { createSlice } from '@reduxjs/toolkit';
import { getDeviceLocale } from '@i18n';

const initialState = {
  theme: 'light', // 'light', 'dark', 'high-contrast'
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
  // Disclaimer acknowledgement (Phase 7 guard / 11.S.11)
  disclaimerAcknowledged: false,
  // Minimal auth state for Phase 0-7 (guards need this)
  isAuthenticated: false,
  user: null,
  // AI decision support (P012): enabled + provider + model only; API key never in Redux (AI SDK v5–style)
  aiDecisionSupportEnabled: false,
  aiProviderId: 'openai',
  aiModelId: 'gpt-4o-mini',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLocale: (state, action) => {
      state.locale = action.payload;
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
      state.disclaimerAcknowledged = Boolean(action.payload);
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
    setAiDecisionSupportEnabled: (state, action) => {
      state.aiDecisionSupportEnabled = Boolean(action.payload);
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

