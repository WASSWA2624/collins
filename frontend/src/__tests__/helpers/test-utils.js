/**
 * Test Utilities
 * Shared test helpers for rendering components with providers
 * File: test-utils.js
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from 'styled-components/native';
import rootReducer from '@store/rootReducer';
import lightTheme from '@theme/light.theme';

/**
 * Create a mock Redux store for testing
 * @param {Object} initialState - Initial state for the store
 * @returns {Object} Configured Redux store
 */
export const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: {
        theme: 'light',
        locale: 'en',
        isLoading: false,
      },
      network: {
        isOnline: true,
      },
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
      ...initialState,
    },
  });
};

/**
 * Render component with ThemeProvider and Redux Provider
 * @param {React.Component} component - Component to render
 * @param {Object} options - Options for rendering
 * @param {Object} options.initialState - Initial Redux state
 * @param {Object} options.theme - Theme to use (defaults to lightTheme)
 * @returns {Object} Render result from testing-library
 */
export const renderWithProviders = (component, options = {}) => {
  const { initialState = {}, theme = lightTheme } = options;
  const store = createMockStore(initialState);

  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </Provider>
  );
};

/**
 * Render component with only ThemeProvider (for components that don't need Redux)
 * @param {React.Component} component - Component to render
 * @param {Object} options - Options for rendering
 * @param {Object} options.theme - Theme to use (defaults to lightTheme)
 * @returns {Object} Render result from testing-library
 */
export const renderWithTheme = (component, options = {}) => {
  const { theme = lightTheme } = options;
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

