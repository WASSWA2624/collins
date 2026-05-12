/**
 * useTheme Hook Tests
 * File: useTheme.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useTheme from '@hooks/useTheme';
import rootReducer from '@store/rootReducer';
import { darkTheme, highContrastTheme, lightTheme } from '@theme';

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

const TestComponent = ({ onResult }) => {
  const theme = useTheme();

  // Intentionally run after every render so tests can observe stability across rerenders.
  React.useEffect(() => {
    onResult(theme);
  });

  return null;
};

describe('useTheme', () => {
  it('returns light theme by default', async () => {
    const store = createMockStore({
      ui: { theme: 'light', locale: 'en', isLoading: false },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => expect(result).toBe(lightTheme));
  });

  it('returns dark theme when theme mode is dark', async () => {
    const store = createMockStore({
      ui: { theme: 'dark', locale: 'en', isLoading: false },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => expect(result).toBe(darkTheme));
  });

  it('returns high-contrast theme when theme mode is high-contrast', async () => {
    const store = createMockStore({
      ui: { theme: 'high-contrast', locale: 'en', isLoading: false },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => expect(result).toBe(highContrastTheme));
  });

  it('does not crash and falls back to light theme when theme mode is undefined', async () => {
    const store = createMockStore({
      ui: { theme: undefined, locale: 'en', isLoading: false },
    });

    let result;
    render(
      <Provider store={store}>
        <TestComponent onResult={(value) => (result = value)} />
      </Provider>
    );

    await waitFor(() => expect(result).toBe(lightTheme));
  });

  it('returns a stable theme reference across unrelated rerenders', async () => {
    const store = createMockStore({
      ui: { theme: 'light', locale: 'en', isLoading: false },
    });

    const results = [];
    const renderTree = () => (
      <Provider store={store}>
        <TestComponent onResult={(value) => results.push(value)} />
      </Provider>
    );

    const { rerender } = render(renderTree());

    await waitFor(() => expect(results[0]).toBe(lightTheme));

    act(() => {
      rerender(renderTree());
    });

    await waitFor(() => expect(results.length).toBeGreaterThanOrEqual(2));
    expect(results[1]).toBe(results[0]);
  });
});
