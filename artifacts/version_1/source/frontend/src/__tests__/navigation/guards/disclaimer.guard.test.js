/**
 * Compatibility tests for legacy disclaimer guard exports.
 */
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { DisclaimerGuard } from '@navigation/guards';
import rootReducer from '@store/rootReducer';

jest.mock('expo-router', () => ({
  Redirect: ({ href }) => {
    const React = require('react');
    const { Text, View } = require('react-native');
    return React.createElement(
      View,
      { testID: 'redirect', href },
      React.createElement(Text, null, 'Redirect')
    );
  },
  usePathname: () => '/',
}));

const defaultState = {
  _persist: { rehydrated: false },
  ui: { disclaimerAcknowledged: false },
  network: {},
  auth: {},
  ventilation: {},
  review: {},
};

const createPersistedReducer = (rehydrated = false) => (state, action) => {
  const { _persist, ...sliceState } = state ?? {};
  return {
    ...rootReducer(sliceState, action),
    _persist: _persist ?? { rehydrated },
  };
};

const createStore = (overrides = {}) =>
  configureStore({
    reducer: createPersistedReducer(overrides._persist?.rehydrated ?? defaultState._persist.rehydrated),
    preloadedState: { ...defaultState, ...overrides },
  });

describe('DisclaimerGuard compatibility export', () => {
  it('redirects to /onboarding when rehydrated and onboarding is not complete', () => {
    const store = createStore({
      _persist: { rehydrated: true },
      ui: { ...defaultState.ui, disclaimerAcknowledged: false },
    });
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <DisclaimerGuard>
          <Text testID="children">Main</Text>
        </DisclaimerGuard>
      </Provider>
    );
    expect(getByTestId('redirect')).toBeDefined();
    expect(getByTestId('redirect').props.href).toBe('/onboarding');
    expect(queryByTestId('children')).toBeNull();
  });

  it('renders children when rehydrated and acknowledged', () => {
    const store = createStore({
      _persist: { rehydrated: true },
      ui: { ...defaultState.ui, disclaimerAcknowledged: true },
    });
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <DisclaimerGuard>
          <Text testID="children">Main</Text>
        </DisclaimerGuard>
      </Provider>
    );
    expect(queryByTestId('redirect')).toBeNull();
    expect(getByTestId('children').props.children).toBe('Main');
  });

  it('renders children when not yet rehydrated (no redirect before rehydration)', () => {
    const store = createStore({
      _persist: { rehydrated: false },
      ui: { ...defaultState.ui, disclaimerAcknowledged: false },
    });
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <DisclaimerGuard>
          <Text testID="children">Main</Text>
        </DisclaimerGuard>
      </Provider>
    );
    expect(queryByTestId('redirect')).toBeNull();
    expect(getByTestId('children')).toBeDefined();
  });
});
