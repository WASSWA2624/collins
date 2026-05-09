/**
 * useMainRouteLayoutWebShell Tests
 * File: useMainRouteLayoutWebShell.test.js
 */
import React from 'react';
import { act, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@store/rootReducer';
import { renderHookResult } from '../../../helpers/render-hook';

import useMainRouteLayoutWebShell from '@platform/layouts/MainRouteLayout/useMainRouteLayoutWebShell';

const createStore = () =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      network: { isOnline: true },
      auth: { user: null, isAuthenticated: false, isLoading: false, error: null },
    },
  });

const createWrapper = (store) =>
  function StoreWrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  };

const renderShellHook = () => {
  const store = createStore();
  let value;
  const Test = () => {
    value = useMainRouteLayoutWebShell();
    return null;
  };
  const tree = (component) => <Provider store={store}>{component}</Provider>;
  const view = render(tree(<Test />));
  return {
    get value() {
      return value;
    },
    rerender: () => view.rerender(tree(<Test />)),
  };
};

describe('useMainRouteLayoutWebShell', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('returns defaults', () => {
    const store = createStore();
    const result = renderHookResult(() => useMainRouteLayoutWebShell(), {
      wrapper: createWrapper(store),
    });
    expect(result.sidebarCollapsed).toBe(false);
    expect(typeof result.sidebarWidth).toBe('number');
    expect(typeof result.collapsedWidth).toBe('number');
    expect(typeof result.toggleSidebar).toBe('function');
    expect(typeof result.resizerProps).toBe('object');
  });

  it('toggles sidebarCollapsed', () => {
    const shell = renderShellHook();

    expect(shell.value.sidebarCollapsed).toBe(false);
    act(() => shell.value.toggleSidebar());
    shell.rerender();
    expect(shell.value.sidebarCollapsed).toBe(true);
    act(() => shell.value.toggleSidebar());
    shell.rerender();
    expect(shell.value.sidebarCollapsed).toBe(false);
  });

  it('keyboard resizer adjusts width when expanded', () => {
    const shell = renderShellHook();

    const startWidth = shell.value.sidebarWidth;
    act(() => shell.value.resizerProps.onKeyDown({ key: 'ArrowRight', preventDefault: jest.fn() }));
    shell.rerender();
    expect(shell.value.sidebarWidth).toBeGreaterThan(startWidth);
  });

  it('keyboard resizer does nothing when collapsed', () => {
    const shell = renderShellHook();

    act(() => shell.value.toggleSidebar());
    shell.rerender();
    const startWidth = shell.value.sidebarWidth;
    act(() => shell.value.resizerProps.onKeyDown({ key: 'ArrowRight', preventDefault: jest.fn() }));
    shell.rerender();
    expect(shell.value.sidebarWidth).toBe(startWidth);
  });
});
