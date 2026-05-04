/**
 * useNetworkBanner Hook Tests
 * File: useNetworkBanner.test.js
 */
import React from 'react';
import { act, render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useNetworkBanner from '@hooks/useNetworkBanner';
import rootReducer from '@store/rootReducer';
import { actions as networkActions } from '@store/slices/network.slice';
import { NETWORK_QUALITY } from '@utils/networkQuality';

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

const TestComponent = ({ onResult, duration }) => {
  const result = useNetworkBanner({ duration });

  React.useEffect(() => {
    onResult(result);
  });

  return null;
};

describe('useNetworkBanner', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('shows online banner after reconnect and hides it', async () => {
    const store = createMockStore({
      network: { isOnline: false, isSyncing: false, quality: NETWORK_QUALITY.UNKNOWN },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent duration={2000} onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.isOffline).toBe(true);
      expect(result.showOnlineBanner).toBe(false);
    });

    act(() => {
      store.dispatch(networkActions.setOnline(true));
    });

    await waitFor(() => {
      expect(result.isOnline).toBe(true);
      expect(result.showOnlineBanner).toBe(true);
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.showOnlineBanner).toBe(false);
    });
  });

  it('clears online banner when offline', async () => {
    const store = createMockStore({
      network: { isOnline: true, isSyncing: false, quality: NETWORK_QUALITY.UNKNOWN },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent duration={1000} onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.isOnline).toBe(true);
      expect(result.showOnlineBanner).toBe(false);
    });

    act(() => {
      store.dispatch(networkActions.setOnline(false));
    });

    await waitFor(() => {
      expect(result.isOffline).toBe(true);
      expect(result.showOnlineBanner).toBe(false);
    });
  });
});
