/**
 * useThemeControls Hook Tests
 * File: useThemeControls.test.js
 */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@store/rootReducer';
import useThemeControls from '@platform/components/navigation/ThemeControls/useThemeControls';
import { THEME_MODES } from '@platform/components/navigation/ThemeControls/types';
import { async as asyncStorage } from '@services/storage';

const act = TestRenderer.act;

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

jest.mock('@services/storage', () => ({
  async: {
    setItem: jest.fn(),
  },
}));

const createStore = (preloadedState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

const renderHook = (hook, { initialState } = {}) => {
  const result = {};
  const store = createStore(initialState);

  const HookHarness = () => {
    const hookResult = hook();
    Object.assign(result, hookResult);
    return null;
  };

  let renderer;
  act(() => {
    renderer = TestRenderer.create(
      <Provider store={store}>
        <HookHarness />
      </Provider>
    );
  });

  return {
    result: { current: result },
    store,
    rerender: () => {
      act(() => {
        renderer.update(
          <Provider store={store}>
            <HookHarness />
          </Provider>
        );
      });
    },
  };
};

describe('useThemeControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns theme options and resolved theme', () => {
    const { result } = renderHook(useThemeControls, {
      initialState: {
        ui: { theme: THEME_MODES.DARK, locale: 'en', isLoading: false },
      },
    });

    expect(result.current.theme).toBe(THEME_MODES.DARK);
    expect(result.current.options).toHaveLength(4);
    expect(result.current.options[0].value).toBe(THEME_MODES.SYSTEM);
    expect(result.current.options[3].value).toBe(THEME_MODES.HIGH_CONTRAST);
  });

  it('falls back to light theme when state is invalid', () => {
    const { result } = renderHook(useThemeControls, {
      initialState: {
        ui: { theme: 'invalid', locale: 'en', isLoading: false },
      },
    });

    expect(result.current.theme).toBe(THEME_MODES.LIGHT);
  });

  it('persists and dispatches when setting a valid theme', () => {
    const { result, store } = renderHook(useThemeControls, {
      initialState: {
        ui: { theme: THEME_MODES.LIGHT, locale: 'en', isLoading: false },
      },
    });

    act(() => {
      result.current.setTheme(THEME_MODES.DARK);
    });

    expect(store.getState().ui.theme).toBe(THEME_MODES.DARK);
    expect(asyncStorage.setItem).toHaveBeenCalledWith('theme_preference', THEME_MODES.DARK);
  });

  it('ignores invalid theme values', () => {
    const { result, store } = renderHook(useThemeControls, {
      initialState: {
        ui: { theme: THEME_MODES.LIGHT, locale: 'en', isLoading: false },
      },
    });

    act(() => {
      result.current.setTheme('invalid-value');
    });

    expect(store.getState().ui.theme).toBe(THEME_MODES.LIGHT);
    expect(asyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('avoids persisting when theme is unchanged', () => {
    const { result, store } = renderHook(useThemeControls, {
      initialState: {
        ui: { theme: THEME_MODES.LIGHT, locale: 'en', isLoading: false },
      },
    });

    act(() => {
      result.current.setTheme(THEME_MODES.LIGHT);
    });

    expect(store.getState().ui.theme).toBe(THEME_MODES.LIGHT);
    expect(asyncStorage.setItem).not.toHaveBeenCalled();
  });
});
