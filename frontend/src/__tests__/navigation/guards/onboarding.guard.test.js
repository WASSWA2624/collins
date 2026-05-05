import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { OnboardingGuard } from '@navigation/guards';
import rootReducer from '@store/rootReducer';

let mockPathname = '/';

jest.mock('expo-router', () => ({
  Redirect: ({ href }) => <div data-testid="redirect" data-href={href}>Redirect</div>,
  usePathname: () => mockPathname,
}));

const createStore = (overrides = {}) =>
  configureStore({
    reducer: rootReducer,
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
    render(
      <Provider store={store}>
        <OnboardingGuard>
          <div data-testid="children">Main</div>
        </OnboardingGuard>
      </Provider>
    );

    expect(screen.getByTestId('redirect').getAttribute('data-href')).toBe('/onboarding');
    expect(screen.queryByTestId('children')).toBeNull();
  });

  it('allows the onboarding route to render without a redirect loop', () => {
    mockPathname = '/onboarding';
    const store = createStore();
    render(
      <Provider store={store}>
        <OnboardingGuard>
          <div data-testid="children">Onboarding</div>
        </OnboardingGuard>
      </Provider>
    );

    expect(screen.queryByTestId('redirect')).toBeNull();
    expect(screen.getByTestId('children').textContent).toBe('Onboarding');
  });
});

