/**
 * useVentilationSession Hook Tests
 * File: useVentilationSession.test.js
 */
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react-native';
import rootReducer from '@store/rootReducer';
import useVentilationSession from '@hooks/useVentilationSession';

const TestComponent = ({ onResult }) => {
  const result = useVentilationSession();
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

describe('useVentilationSession', () => {
  it('returns defaults when no session is active', () => {
    const store = createStore();
    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    expect(result.sessionId).toBeNull();
    expect(result.inputs).toBeNull();
    expect(result.recommendationSummary).toBeNull();
    expect(result.isHydrating).toBe(false);
    expect(result.hydratedAt).toBeNull();
    expect(result.errorCode).toBeNull();
    expect(typeof result.startSession).toBe('function');
    expect(typeof result.hydrate).toBe('function');
    expect(typeof result.persistDraft).toBe('function');
  });

  it('returns state when session exists', () => {
    const store = createStore({
      ventilation: {
        currentSessionId: 's1',
        currentInputs: { spo2: 91 },
        lastRecommendationSummary: { source: { confidenceTier: 'high' } },
        isHydrating: true,
        hydratedAt: 123,
        errorCode: 'VENTILATION_SESSION_DRAFT_LOAD_FAILED',
      },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    expect(result.sessionId).toBe('s1');
    expect(result.inputs).toEqual({ spo2: 91 });
    expect(result.recommendationSummary).toEqual({ source: { confidenceTier: 'high' } });
    expect(result.isHydrating).toBe(true);
    expect(result.hydratedAt).toBe(123);
    expect(result.errorCode).toBe('VENTILATION_SESSION_DRAFT_LOAD_FAILED');
  });
});

