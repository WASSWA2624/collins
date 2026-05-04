/**
 * useUiState Hook Tests
 * File: useUiState.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useUiState from '@hooks/useUiState';
import rootReducer from '@store/rootReducer';

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

const TestComponent = ({ onResult }) => {
  const result = useUiState();

  React.useEffect(() => {
    onResult(result);
  });

  return null;
};

describe('useUiState', () => {
  it('returns loading state when false', async () => {
    const store = createMockStore({
      ui: { theme: 'light', locale: 'en', isLoading: false },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.isLoading).toBe(false);
    });
  });

  it('returns loading state when true', async () => {
    const store = createMockStore({
      ui: { theme: 'light', locale: 'en', isLoading: true },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.isLoading).toBe(true);
    });
  });
});
