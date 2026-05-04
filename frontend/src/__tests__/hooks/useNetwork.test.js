/**
 * useNetwork Hook Tests
 * File: useNetwork.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useNetwork from '@hooks/useNetwork';
import rootReducer from '@store/rootReducer';

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

const TestComponent = ({ onResult }) => {
  const result = useNetwork();

  React.useEffect(() => {
    onResult(result);
  });

  return null;
};

describe('useNetwork', () => {
  it('returns online state and derived isOffline flag', async () => {
    const store = createMockStore({
      network: { isOnline: true, isSyncing: false },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.isOnline).toBe(true);
      expect(result.isOffline).toBe(false);
      expect(result.isSyncing).toBe(false);
    });
  });

  it('returns offline state', async () => {
    const store = createMockStore({
      network: { isOnline: false, isSyncing: false },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.isOnline).toBe(false);
      expect(result.isOffline).toBe(true);
    });
  });

  it('returns syncing state', async () => {
    const store = createMockStore({
      network: { isOnline: true, isSyncing: true },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => expect(result.isSyncing).toBe(true));
  });
});
