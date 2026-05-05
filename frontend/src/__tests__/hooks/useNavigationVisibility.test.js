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
import { MAIN_NAV_ITEMS } from '@config/sideMenu';

const getNavItem = (id) => MAIN_NAV_ITEMS.find((item) => item.id === id);

const membership = (role, overrides = {}) => ({
  id: `${role}-membership`,
  facilityId: 'facility-1',
  role,
  status: 'APPROVED',
  facility: { id: 'facility-1', name: 'Kampala ICU' },
  ...overrides,
});

const userWithRole = (role, overrides = {}) => ({
  id: 'user-1',
  activeFacility: {
    id: 'facility-1',
    facilityId: 'facility-1',
    name: 'Kampala ICU',
    roles: [role],
  },
  memberships: [membership(role)],
  ...overrides,
});

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

const renderHookWithStore = (store) => {
  let result;
  render(
    <Provider store={store}>
      <TestComponent onResult={(value) => (result = value)} />
    </Provider>
  );
  return result;
};

describe('useNavigationVisibility', () => {
  it('shows base navigation for authenticated users', () => {
    const store = createStore({
      auth: { isAuthenticated: true, user: { id: 'user-1' } },
    });
    const result = renderHookWithStore(store);

    expect(result.isItemVisible(getNavItem('home'))).toBe(true);
  });

  it('hides auth-required navigation when unauthenticated', () => {
    const store = createStore({ auth: { isAuthenticated: false, user: null } });
    const result = renderHookWithStore(store);

    expect(result.isItemVisible(getNavItem('home'))).toBe(false);
  });

  it('hides falsy items', () => {
    const store = createStore({
      auth: { isAuthenticated: true, user: { id: 'user-1' } },
    });
    const result = renderHookWithStore(store);

    expect(result.isItemVisible(null)).toBe(false);
    expect(result.isItemVisible(undefined)).toBe(false);
  });

  it('shows facility-scoped clinical write navigation to clinicians with an active facility', () => {
    const store = createStore({
      auth: { isAuthenticated: true, user: userWithRole('CLINICIAN') },
    });
    const result = renderHookWithStore(store);

    expect(result.isItemVisible(getNavItem('assessment'))).toBe(true);
    expect(result.isItemVisible(getNavItem('history'))).toBe(true);
    expect(result.isItemVisible(getNavItem('dashboard'))).toBe(true);
  });

  it('allows read-only reviewers to see read history but not clinical write workflows', () => {
    const store = createStore({
      auth: { isAuthenticated: true, user: userWithRole('READ_ONLY_REVIEWER') },
    });
    const result = renderHookWithStore(store);

    expect(result.isItemVisible(getNavItem('history'))).toBe(true);
    expect(result.isItemVisible(getNavItem('assessment'))).toBe(false);
  });

  it('shows review queue to approved reviewer roles', () => {
    const store = createStore({
      auth: { isAuthenticated: true, user: userWithRole('SPECIALIST_REVIEWER') },
    });
    const result = renderHookWithStore(store);

    expect(result.isItemVisible(getNavItem('review-queue'))).toBe(true);
  });

  it('hides facility-scoped workflows when no active facility can be resolved', () => {
    const store = createStore({
      auth: {
        isAuthenticated: true,
        user: {
          id: 'user-1',
          memberships: [
            membership('CLINICIAN', { facilityId: 'facility-1', facility: { id: 'facility-1', name: 'A' } }),
            membership('CLINICIAN', { id: 'membership-2', facilityId: 'facility-2', facility: { id: 'facility-2', name: 'B' } }),
          ],
        },
      },
    });
    const result = renderHookWithStore(store);

    expect(result.isItemVisible(getNavItem('assessment'))).toBe(false);
  });
});
