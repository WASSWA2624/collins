import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { OnboardingGuard } from '@navigation/guards';
import rootReducer from '@store/rootReducer';

let mockPathname = '/';

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
  usePathname: () => mockPathname,
}));

const createPersistedReducer = (rehydrated = true) => (state, action) => {
  const { _persist, ...sliceState } = state ?? {};
  return {
    ...rootReducer(sliceState, action),
    _persist: _persist ?? { rehydrated },
  };
};

const createStore = (overrides = {}, rehydrated = true) =>
  configureStore({
    reducer: createPersistedReducer(rehydrated),
    preloadedState: {
      _persist: { rehydrated: true },
      ui: { onboardingCompleted: false, clinicalSafetyAcknowledged: false, disclaimerAcknowledged: false },
      network: {},
      auth: {},
      ventilation: {},
      ...overrides,
    },
  });

describe('OnboardingGuard', () => {
  beforeEach(() => {
    mockPathname = '/';
  });

  it('redirects first-run users to onboarding', () => {
    const store = createStore();
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <OnboardingGuard>
          <Text testID="children">Main</Text>
        </OnboardingGuard>
      </Provider>
    );

    expect(getByTestId('redirect').props.href).toBe('/onboarding');
    expect(queryByTestId('children')).toBeNull();
  });

  it('allows the onboarding route to render without a redirect loop', () => {
    mockPathname = '/onboarding';
    const store = createStore();
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <OnboardingGuard>
          <Text testID="children">Onboarding</Text>
        </OnboardingGuard>
      </Provider>
    );

    expect(queryByTestId('redirect')).toBeNull();
    expect(getByTestId('children').props.children).toBe('Onboarding');
  });

  it('allows users whose server onboarding state is already completed', () => {
    const store = createStore({
      ui: { onboardingCompleted: false, clinicalSafetyAcknowledged: false, disclaimerAcknowledged: false },
      auth: {
        user: {
          id: 'user-1',
          onboardingState: {
            status: 'COMPLETED',
            currentStep: 'COMPLETED',
            completedStepsJson: ['CLINICAL_SAFETY', 'COMPLETED'],
            completedAt: '2026-05-06T00:00:00.000Z',
          },
        },
      },
    });
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <OnboardingGuard>
          <Text testID="children">Main</Text>
        </OnboardingGuard>
      </Provider>
    );

    expect(queryByTestId('redirect')).toBeNull();
    expect(getByTestId('children').props.children).toBe('Main');
  });
});
