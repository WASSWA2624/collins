/**
 * useAuth Hook Tests
 * File: useAuth.test.js
 */
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react-native';
import rootReducer from '@store/rootReducer';
import useAuth from '@hooks/useAuth';

const TestComponent = ({ onResult }) => {
  const result = useAuth();
  React.useEffect(() => {
    onResult(result);
  }, [onResult, result]);
  return null;
};

const createStore = (preloadedState = {}) =>
  configureStore({
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
        errorCode: null,
        lastUpdated: null,
      },
      ...preloadedState,
    },
  });

describe('useAuth', () => {
  it('returns defaults when unauthenticated', () => {
    const store = createStore();
    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );
    expect(result.isAuthenticated).toBe(false);
    expect(result.user).toBeNull();
    expect(result.roles).toEqual([]);
    expect(result.role).toBeNull();
    expect(result.isLoading).toBe(false);
    expect(result.errorCode).toBeNull();
  });

  it('returns normalized roles when authenticated', () => {
    const store = createStore({
      auth: {
        user: {
          id: '1',
          role: 'Patient',
          roles: ['Patient', 'Admin'],
        },
        isAuthenticated: true,
        isLoading: false,
        errorCode: null,
        lastUpdated: null,
      },
    });
    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );
    expect(result.isAuthenticated).toBe(true);
    expect(result.user).toMatchObject({ id: '1' });
    expect(result.roles).toEqual(['patient', 'admin']);
    expect(result.role).toBe('patient');
    expect(result.isLoading).toBe(false);
    expect(result.errorCode).toBeNull();
  });

  it('returns loading and error state', () => {
    const store = createStore({
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        errorCode: 'UNAUTHORIZED',
        lastUpdated: null,
      },
    });
    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );
    expect(result.isLoading).toBe(true);
    expect(result.errorCode).toBe('UNAUTHORIZED');
  });
});
