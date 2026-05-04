/**
 * Disclaimer guard tests (P013 first-run acknowledgement).
 */
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Redirect } from 'expo-router';
import { DisclaimerGuard, useDisclaimerGuard } from '@navigation/guards';
import rootReducer from '@store/rootReducer';

jest.mock('expo-router', () => ({
  Redirect: ({ href }) => <div data-testid="redirect" data-href={href}>Redirect</div>,
}));

const defaultState = {
  _persist: { rehydrated: false },
  ui: { disclaimerAcknowledged: false },
  network: {},
  auth: {},
  ventilation: {},
};

const createStore = (overrides = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: { ...defaultState, ...overrides },
  });

describe('DisclaimerGuard', () => {
  it('redirects to /disclaimer when rehydrated and not acknowledged', () => {
    const store = createStore({
      _persist: { rehydrated: true },
      ui: { ...defaultState.ui, disclaimerAcknowledged: false },
    });
    render(
      <Provider store={store}>
        <DisclaimerGuard>
          <div data-testid="children">Main</div>
        </DisclaimerGuard>
      </Provider>
    );
    expect(screen.getByTestId('redirect')).toBeDefined();
    expect(screen.getByTestId('redirect').getAttribute('data-href')).toBe('/disclaimer');
    expect(screen.queryByTestId('children')).toBeNull();
  });

  it('renders children when rehydrated and acknowledged', () => {
    const store = createStore({
      _persist: { rehydrated: true },
      ui: { ...defaultState.ui, disclaimerAcknowledged: true },
    });
    render(
      <Provider store={store}>
        <DisclaimerGuard>
          <div data-testid="children">Main</div>
        </DisclaimerGuard>
      </Provider>
    );
    expect(screen.queryByTestId('redirect')).toBeNull();
    expect(screen.getByTestId('children').textContent).toBe('Main');
  });

  it('renders children when not yet rehydrated (no redirect before rehydration)', () => {
    const store = createStore({
      _persist: { rehydrated: false },
      ui: { ...defaultState.ui, disclaimerAcknowledged: false },
    });
    render(
      <Provider store={store}>
        <DisclaimerGuard>
          <div data-testid="children">Main</div>
        </DisclaimerGuard>
      </Provider>
    );
    expect(screen.queryByTestId('redirect')).toBeNull();
    expect(screen.getByTestId('children')).toBeDefined();
  });
});
