/**
 * useDisclaimerScreen Hook Tests (P011 11.S.11)
 * File: useDisclaimerScreen.test.js
 */
const { renderHook, act } = require('@testing-library/react');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const React = require('react');
const rootReducer = require('@store/rootReducer').default;
const useDisclaimerScreen = require('@platform/screens/settings/DisclaimerScreen/useDisclaimerScreen').default;

jest.mock('@services/storage', () => ({ async: { setItem: jest.fn() } }));
jest.mock('@features/ventilation/ventilation.model', () => ({
  getDefaultVentilationDataset: () => ({}),
  getVentilationDatasetIntendedUse: () => ({ warning: 'Test warning', validationRequirement: 'Test validation' }),
}));

const createStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', density: 'comfortable', disclaimerAcknowledged: false, ...initialState.ui },
      ...initialState,
    },
  });

const wrapper = ({ children, store }) =>
  React.createElement(Provider, { store: store || createStore() }, children);

describe('useDisclaimerScreen', () => {
  it('returns intendedUse, acknowledged, acknowledge', () => {
    const store = createStore();
    const { result } = renderHook(() => useDisclaimerScreen(), {
      wrapper: ({ children }) => wrapper({ children, store }),
    });
    expect(result.current.intendedUse).toEqual({ warning: 'Test warning', validationRequirement: 'Test validation' });
    expect(result.current.acknowledged).toBe(false);
    expect(typeof result.current.acknowledge).toBe('function');
    expect(result.current.testIds.screen).toBe('disclaimer-screen');
  });

  it('acknowledge dispatches and persists', () => {
    const store = createStore();
    const { result } = renderHook(() => useDisclaimerScreen(), {
      wrapper: ({ children }) => wrapper({ children, store }),
    });
    act(() => {
      result.current.acknowledge();
    });
    expect(store.getState().ui.disclaimerAcknowledged).toBe(true);
  });
});
