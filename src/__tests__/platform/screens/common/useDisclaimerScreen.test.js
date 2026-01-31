/**
 * useDisclaimerScreen Hook Tests
 * File: useDisclaimerScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default || require('@store/rootReducer');

const useDisclaimerScreen = require('@platform/screens/common/DisclaimerScreen/useDisclaimerScreen').default;

const act = TestRenderer.act;
const renderHookWithStore = (hook, store) => {
  const result = {};
  const HookHarness = () => {
    Object.assign(result, hook());
    return null;
  };
  let renderer;
  act(() => {
    renderer = TestRenderer.create(
      React.createElement(Provider, { store }, React.createElement(HookHarness))
    );
  });
  return { result: { current: result }, unmount: () => renderer.unmount() };
};

describe('useDisclaimerScreen', () => {
  it('sets disclaimerAcknowledged to true when handleAcknowledge is called', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: { ui: { disclaimerAcknowledged: false }, network: { isOnline: true } },
    });

    const { result } = renderHookWithStore(() => useDisclaimerScreen(), store);
    act(() => {
      result.current.handleAcknowledge();
    });

    expect(store.getState().ui.disclaimerAcknowledged).toBe(true);
  });
});

