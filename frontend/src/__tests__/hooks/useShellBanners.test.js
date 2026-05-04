/**
 * useShellBanners Hook Tests
 * File: useShellBanners.test.js
 */
import React from 'react';
import { act, render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useShellBanners from '@hooks/useShellBanners';
import rootReducer from '@store/rootReducer';
import { actions as networkActions } from '@store/slices/network.slice';
import { NETWORK_QUALITY } from '@utils/networkQuality';

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

const TestComponent = ({ onResult }) => {
  const result = useShellBanners({ maintenanceMode: false });

  React.useEffect(() => {
    onResult(result);
  });

  return null;
};

describe('useShellBanners', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('returns offline banner when offline', async () => {
    const store = createMockStore({
      network: { isOnline: false, isSyncing: false, quality: NETWORK_QUALITY.UNKNOWN },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.some((banner) => banner.id === 'offline')).toBe(true);
    });
  });

  it('returns low quality banner when online with low quality', async () => {
    const store = createMockStore({
      network: { isOnline: true, isSyncing: false, quality: NETWORK_QUALITY.LOW },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.some((banner) => banner.id === 'low-quality')).toBe(true);
    });
  });

  it('shows and hides the online banner after reconnect', async () => {
    const store = createMockStore({
      network: { isOnline: false, isSyncing: false, quality: NETWORK_QUALITY.UNKNOWN },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => {
      expect(result.some((banner) => banner.id === 'offline')).toBe(true);
    });

    act(() => {
      store.dispatch(networkActions.setOnline(true));
    });

    await waitFor(() => {
      expect(result.some((banner) => banner.id === 'online')).toBe(true);
    });

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    await waitFor(() => {
      expect(result.some((banner) => banner.id === 'online')).toBe(false);
    });
  });
});
