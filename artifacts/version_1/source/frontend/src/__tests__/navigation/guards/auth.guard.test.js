/**
 * Auth guard tests.
 */
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { AuthGuard, PublicAuthGuard } from '@navigation/guards';
import rootReducer from '@store/rootReducer';

jest.mock('expo-router', () => ({
  Redirect: ({ href }) => {
    const React = require('react');
    const { Text: MockText } = require('react-native');
    return React.createElement(MockText, { testID: 'redirect', dataHref: href }, 'Redirect');
  },
}));

const createStore = (auth) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', onboardingCompleted: true },
      network: { isOnline: true },
      auth,
      ventilation: {},
      review: {},
    },
  });

const renderWithStore = (auth, children) => {
  const store = createStore(auth);
  return render(<Provider store={store}>{children}</Provider>);
};

describe('AuthGuard', () => {
  it('renders nothing until session restoration finishes', () => {
    const { queryByTestId } = renderWithStore(
      {
        hasRestoredSession: false,
        isLoading: true,
        isAuthenticated: false,
        requiresActiveFacility: false,
      },
      <AuthGuard>
        <Text testID="children">Main</Text>
      </AuthGuard>
    );

    expect(queryByTestId('children')).toBeNull();
    expect(queryByTestId('redirect')).toBeNull();
  });

  it('redirects unauthenticated users to login', () => {
    const { getByTestId } = renderWithStore(
      {
        hasRestoredSession: true,
        isLoading: false,
        isAuthenticated: false,
        requiresActiveFacility: false,
      },
      <AuthGuard>
        <Text testID="children">Main</Text>
      </AuthGuard>
    );

    expect(getByTestId('redirect').props.dataHref).toBe('/login');
  });

  it('redirects authenticated users without facility context', () => {
    const { getByTestId } = renderWithStore(
      {
        hasRestoredSession: true,
        isLoading: false,
        isAuthenticated: true,
        requiresActiveFacility: true,
      },
      <AuthGuard>
        <Text testID="children">Main</Text>
      </AuthGuard>
    );

    expect(getByTestId('redirect').props.dataHref).toBe('/select-facility');
  });

  it('renders protected children when session and facility are ready', () => {
    const { getByTestId } = renderWithStore(
      {
        hasRestoredSession: true,
        isLoading: false,
        isAuthenticated: true,
        requiresActiveFacility: false,
      },
      <AuthGuard>
        <Text testID="children">Main</Text>
      </AuthGuard>
    );

    expect(getByTestId('children').props.children).toBe('Main');
  });
});

describe('PublicAuthGuard', () => {
  it('keeps public auth routes visible while auth requests are loading', () => {
    const { getByTestId, queryByTestId } = renderWithStore(
      {
        hasRestoredSession: true,
        isLoading: true,
        isAuthenticated: false,
        requiresActiveFacility: false,
      },
      <PublicAuthGuard>
        <Text testID="children">Login</Text>
      </PublicAuthGuard>
    );

    expect(getByTestId('children').props.children).toBe('Login');
    expect(queryByTestId('redirect')).toBeNull();
  });

  it('keeps public auth routes visible while session restoration is pending', () => {
    const { getByTestId, queryByTestId } = renderWithStore(
      {
        hasRestoredSession: false,
        isLoading: true,
        isAuthenticated: false,
        requiresActiveFacility: false,
      },
      <PublicAuthGuard>
        <Text testID="children">Login</Text>
      </PublicAuthGuard>
    );

    expect(getByTestId('children').props.children).toBe('Login');
    expect(queryByTestId('redirect')).toBeNull();
  });

  it('redirects authenticated public-route users to home', () => {
    const { getByTestId } = renderWithStore(
      {
        hasRestoredSession: true,
        isLoading: false,
        isAuthenticated: true,
        requiresActiveFacility: false,
      },
      <PublicAuthGuard>
        <Text testID="children">Login</Text>
      </PublicAuthGuard>
    );

    expect(getByTestId('redirect').props.dataHref).toBe('/');
  });
});
