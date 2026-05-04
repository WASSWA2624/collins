/**
 * Monitoring Route Tests
 * File: monitoring.test.js - tests src/app/(main)/session/monitoring.jsx (P011 11.S.4)
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

jest.mock('@platform/screens', () => {
  const React = require('react');
  return {
    MonitoringScreen: () =>
      React.createElement('div', { testID: 'monitoring-screen', 'data-testid': 'monitoring-screen' }, 'Mock MonitoringScreen'),
  };
});

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      ventilation: { currentSessionId: 'session-1', currentInputs: {}, lastRecommendationSummary: {}, isHydrating: false },
      network: { isOnline: true },
      ...initialState,
    },
  });

const renderWithProviders = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('app/(main)/session/monitoring.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render MonitoringScreen', () => {
    const MonitoringRoute = require('../../../../app/(main)/session/monitoring').default;
    const { getByTestId } = renderWithProviders(<MonitoringRoute />);
    expect(getByTestId('monitoring-screen')).toBeDefined();
  });
});
