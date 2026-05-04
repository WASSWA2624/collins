/**
 * useNavigationVisibility Hook Tests
 * File: useNavigationVisibility.test.js
 */
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react-native';
import rootReducer from '@store/rootReducer';
import useNavigationVisibility from '@hooks/useNavigationVisibility';

const TestComponent = ({ onResult }) => {
  const result = useNavigationVisibility();
  React.useEffect(() => {
    onResult(result);
  }, [onResult, result]);
  return null;
};

const createStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      network: { isOnline: true },
      auth: { isAuthenticated: false, user: null },
      ...preloadedState,
    },
  });

describe('useNavigationVisibility', () => {
  it('returns isItemVisible that is true when authenticated and item is truthy', () => {
    const store = createStore({
      auth: { isAuthenticated: true, user: {} },
    });
    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );
    expect(result.isItemVisible({ id: 'home' })).toBe(true);
  });

  it('returns isItemVisible that is false when not authenticated', () => {
    const store = createStore({ auth: { isAuthenticated: false, user: null } });
    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );
    expect(result.isItemVisible({ id: 'home' })).toBe(false);
  });

  it('returns isItemVisible that is false when item is falsy', () => {
    const store = createStore({
      auth: { isAuthenticated: true, user: {} },
    });
    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );
    expect(result.isItemVisible(null)).toBe(false);
    expect(result.isItemVisible(undefined)).toBe(false);
  });
});
