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
  // Minimal auth state for Phase 0-7 (guards need this)
  // Full auth feature will be implemented in Phase 9
  isAuthenticated: false,
  user: null,
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
  },
});

const actions = uiSlice.actions;
const reducer = uiSlice.reducer;

export { actions, reducer };
export default { actions, reducer };

