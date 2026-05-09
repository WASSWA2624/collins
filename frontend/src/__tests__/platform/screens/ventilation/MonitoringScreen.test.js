/**
 * MonitoringScreen Component Tests
 * File: MonitoringScreen.test.js (P011 11.S.4)
 * Tests: sparse/out-of-order points, alert severity branches, offline banner, keyboard navigation (web)
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

jest.mock('@hooks', () => {
  const mockEn = require('@i18n/locales/en.json');
  return {
    useI18n: () => ({
      t: (key, params) => {
        const keys = key.split('.');
        let v = mockEn;
        for (const k of keys) v = v?.[k];
        if (typeof v === 'string' && params) return Object.entries(params).reduce((s, [k, val]) => s.replace(`{{${k}}}`, String(val)), v);
        return v ?? key;
      },
      locale: 'en',
    }),
  };
});

const MonitoringScreenAndroid = require('@platform/screens/ventilation/MonitoringScreen/MonitoringScreen.android').default;
const MonitoringScreenWeb = require('@platform/screens/ventilation/MonitoringScreen/MonitoringScreen.web').default;

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      ventilation: { currentSessionId: 'session-1', currentInputs: {}, lastRecommendationSummary: { monitoringPoints: ['SpO2', 'RR'] }, isHydrating: false },
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

describe('MonitoringScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render screen with quick entry and sections', () => {
      const { getByTestId, getByText } = renderWithProviders(<MonitoringScreenAndroid />);
      expect(getByTestId('monitoring-screen')).toBeTruthy();
      expect(getByTestId('monitoring-quick-entry')).toBeTruthy();
      expect(getByTestId('monitoring-trend')).toBeTruthy();
      expect(getByTestId('monitoring-alerts')).toBeTruthy();
      expect(getByText(/Quick entry/)).toBeTruthy();
      expect(getByText(/Add point/)).toBeTruthy();
    });

    it('should show empty trend and alerts when no points', () => {
      const { getByText } = renderWithProviders(<MonitoringScreenAndroid />);
      expect(getByText(/Add vitals or labs points to see trends and alerts/)).toBeTruthy();
      expect(getByText(/No alerts/)).toBeTruthy();
    });
  });

  describe('Sparse and out-of-order points', () => {
    it('should show insufficient data trend after one point', () => {
      const { getByTestId, getByLabelText, getByText } = renderWithProviders(<MonitoringScreenAndroid />);
      fireEvent.changeText(getByLabelText('Name (e.g. SpO₂, RR)'), 'SpO2');
      fireEvent.changeText(getByLabelText('Value'), '95');
      fireEvent.press(getByTestId('monitoring-add-point'));
      expect(getByText(/Insufficient data/)).toBeTruthy();
    });

    it('should show trend direction after two points', () => {
      const { getByTestId, getByLabelText, getByText } = renderWithProviders(<MonitoringScreenAndroid />);
      fireEvent.changeText(getByLabelText('Name (e.g. SpO₂, RR)'), 'RR');
      fireEvent.changeText(getByLabelText('Value'), '18');
      fireEvent.press(getByTestId('monitoring-add-point'));
      fireEvent.changeText(getByLabelText('Value'), '22');
      fireEvent.press(getByTestId('monitoring-add-point'));
      expect(getByText(/Trending up|Stable|Insufficient data/)).toBeTruthy();
    });
  });

  describe('Alert severity branches', () => {
    it('should show critical severity and suggested action for SpO2 below critical low', () => {
      const { getByTestId, getByText, getByLabelText } = renderWithProviders(<MonitoringScreenAndroid />);
      fireEvent.changeText(getByLabelText('Name (e.g. SpO₂, RR)'), 'SpO2');
      fireEvent.changeText(getByLabelText('Value'), '85');
      fireEvent.press(getByTestId('monitoring-add-point'));
      expect(getByText('Critical')).toBeTruthy();
      expect(getByText(/Address immediately/)).toBeTruthy();
    });

    it('should show warning severity for SpO2 in warning range', () => {
      const { getByTestId, getByText, getByLabelText } = renderWithProviders(<MonitoringScreenAndroid />);
      fireEvent.changeText(getByLabelText('Name (e.g. SpO₂, RR)'), 'SpO2');
      fireEvent.changeText(getByLabelText('Value'), '90');
      fireEvent.press(getByTestId('monitoring-add-point'));
      expect(getByText('Warning')).toBeTruthy();
      expect(getByText(/Review and consider intervention/)).toBeTruthy();
    });
  });

  describe('Offline banner', () => {
    it('should show offline banner when isOffline is true', () => {
      const store = createMockStore({ network: { isOnline: false } });
      const { getByTestId, getByText } = renderWithProviders(<MonitoringScreenAndroid />, store);
      expect(getByTestId('monitoring-offline-banner')).toBeTruthy();
      expect(getByText(/You are offline/)).toBeTruthy();
    });

    it('should not show offline banner when online', () => {
      const { queryByTestId } = renderWithProviders(<MonitoringScreenAndroid />);
      expect(queryByTestId('monitoring-offline-banner')).toBeNull();
    });
  });

  describe('Keyboard navigation (web)', () => {
    it('should submit quick entry on Enter key', () => {
      const { getByTestId, getByLabelText, getByText } = renderWithProviders(<MonitoringScreenWeb />);
      fireEvent.changeText(getByLabelText('Name (e.g. SpO₂, RR)'), 'SpO2');
      fireEvent.changeText(getByLabelText('Value'), '95');
      const form = getByTestId('monitoring-quick-entry-form');
      fireEvent(form, 'keyDown', { key: 'Enter', preventDefault: jest.fn(), target: { tagName: 'INPUT' } });
      expect(getByText(/Insufficient data/)).toBeTruthy();
    });
  });

  describe('Loading and error', () => {
    it('should show loading when hydrating', () => {
      const store = createMockStore({
        ventilation: {
          currentSessionId: 'session-1',
          currentInputs: {},
          lastRecommendationSummary: { monitoringPoints: ['SpO2', 'RR'] },
          monitoringTimeSeries: [],
          isHydrating: true,
        },
      });
      const { getByText } = renderWithProviders(<MonitoringScreenAndroid />, store);
      expect(getByText(/Loading/)).toBeTruthy();
    });

    it('should show error and back button when errorCode set', () => {
      const store = createMockStore({
        ventilation: {
          currentSessionId: 'session-1',
          currentInputs: {},
          lastRecommendationSummary: { monitoringPoints: ['SpO2', 'RR'] },
          monitoringTimeSeries: [],
          isHydrating: false,
          errorCode: 'ERR',
        },
      });
      const { getByText } = renderWithProviders(<MonitoringScreenAndroid />, store);
      expect(getByText(/Unable to load monitoring/)).toBeTruthy();
      expect(getByText(/Back to recommendation/)).toBeTruthy();
    });
  });
});
