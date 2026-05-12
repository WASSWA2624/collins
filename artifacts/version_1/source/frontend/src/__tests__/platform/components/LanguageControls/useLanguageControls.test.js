/**
 * useLanguageControls Hook Tests
 * File: useLanguageControls.test.js
 */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@store/rootReducer';
import useLanguageControls from '@platform/components/navigation/LanguageControls/useLanguageControls';
import { async as asyncStorage } from '@services/storage';

const act = TestRenderer.act;

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

jest.mock('@i18n', () => ({
  DEFAULT_LOCALE: 'en',
  createI18n: () => ({
    supportedLocales: ['en'],
  }),
  getDeviceLocale: () => 'en',
  resolveSupportedLocale: (locale) => (locale === 'en' ? 'en' : null),
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

describe('useLanguageControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns locale and supported options', () => {
    const { result } = renderHook(useLanguageControls, {
      initialState: {
        ui: { theme: 'light', locale: 'en', isLoading: false },
      },
    });

    expect(result.current.locale).toBe('en');
    expect(result.current.options).toHaveLength(1);
    expect(result.current.options[0].value).toBe('en');
    expect(result.current.options[0]).toMatchObject({
      label: 'settings.language.options.en',
      searchText: ['en', 'settings.language.options.en', 'GB'],
    });
    expect(result.current.options[0].icon.props.countryCode).toBe('GB');
  });

  it('falls back to default when stored locale is unsupported', () => {
    const { result } = renderHook(useLanguageControls, {
      initialState: {
        ui: { theme: 'light', locale: 'xx', isLoading: false },
      },
    });

    expect(result.current.locale).toBe('en');
  });

  it('ignores formerly supported locale values', () => {
    const { result, store } = renderHook(useLanguageControls, {
      initialState: {
        ui: { theme: 'light', locale: 'en', isLoading: false },
      },
    });

    act(() => {
      result.current.setLocale('fr');
    });

    expect(store.getState().ui.locale).toBe('en');
    expect(asyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('ignores invalid locale values', () => {
    const { result, store } = renderHook(useLanguageControls, {
      initialState: {
        ui: { theme: 'light', locale: 'en', isLoading: false },
      },
    });

    act(() => {
      result.current.setLocale('invalid');
    });

    expect(store.getState().ui.locale).toBe('en');
    expect(asyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('avoids persisting when locale is unchanged', () => {
    const { result, store } = renderHook(useLanguageControls, {
      initialState: {
        ui: { theme: 'light', locale: 'en', isLoading: false },
      },
    });

    act(() => {
      result.current.setLocale('en');
    });

    expect(store.getState().ui.locale).toBe('en');
    expect(asyncStorage.setItem).not.toHaveBeenCalled();
  });
});
