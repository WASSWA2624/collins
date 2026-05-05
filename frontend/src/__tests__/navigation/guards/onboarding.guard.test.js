import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { OnboardingGuard } from '@navigation/guards';
import rootReducer from '@store/rootReducer';

let mockPathname = '/';

jest.mock('expo-router', () => ({
  Redirect: ({ href }) => (
    <View testID="redirect" href={href}>
      <Text>Redirect</Text>
    </View>
  ),
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
});
