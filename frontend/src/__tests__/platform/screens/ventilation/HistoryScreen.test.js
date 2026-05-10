/**
 * Tracking screen tests
 * File: HistoryScreen.test.js
 */
const React = require('react');
const { render, fireEvent, waitFor } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock('@hooks', () => ({
  useI18n: () => {
    const mockEn = require('@i18n/locales/en.json');
    return {
      t: (key, params) => {
        const keys = key.split('.');
        let value = mockEn;
        for (const k of keys) {
          value = value?.[k];
          if (value === undefined) return key;
        }
        if (typeof value === 'string' && params) {
          return Object.entries(params).reduce(
            (text, [paramKey, paramValue]) =>
              text.replace(`{{${paramKey}}}`, String(paramValue)),
            value
          );
        }
        return value || key;
      },
      locale: 'en',
    };
  },
  useDebounce: (value) => value,
  useVentilationSession: jest.fn(),
}));

jest.mock('@features/tracking', () => ({
  filterTrackingRows: (rows, query) => {
    const normalized = String(query || '').trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(normalized)
    );
  },
  formatDateTime: jest.fn((value) => String(value || '')),
  listTrackingAdmissionsUseCase: jest.fn(),
  getTrackingAdmissionUseCase: jest.fn(),
}));

const HistoryScreenWeb =
  require('@platform/screens/ventilation/HistoryScreen/HistoryScreen.web').default;
const HistoryScreenAndroid =
  require('@platform/screens/ventilation/HistoryScreen/HistoryScreen.android').default;
const HistoryScreenIOS =
  require('@platform/screens/ventilation/HistoryScreen/HistoryScreen.ios').default;
const { useVentilationSession } = require('@hooks');
const { useLocalSearchParams } = require('expo-router');
const {
  getTrackingAdmissionUseCase,
  listTrackingAdmissionsUseCase,
} = require('@features/tracking');

const lightTheme =
  require('@theme/light.theme').default || require('@theme/light.theme');

const HISTORY_TEST_IDS = {
  screen: 'history-screen',
  empty: 'history-empty',
  draftBanner: 'tracking-draft-banner',
  admittedBanner: 'tracking-admitted-banner',
  list: 'history-list',
  search: 'tracking-search',
  searchEmpty: 'tracking-search-empty',
  viewDetails: 'history-view-details',
  detailPanel: 'tracking-detail-panel',
};

const trackingRow = {
  admissionId: 'adm-1',
  appAdmissionCode: 'COL-A-1',
  appPatientCode: 'COL-P-1',
  optionalName: 'Jane Doe',
  hospitalNumber: 'HN-7788',
  facilityId: 'facility-1',
  facilityName: 'City ICU',
  bedNumber: 'ICU-2',
  admissionStatusLabel: 'Active',
  patientPathwayLabel: 'Adult',
  admittedAtLabel: '5/1/26, 8:00 AM',
  reviewLabel: 'Review',
  syncLabel: 'Conflict',
  missingDataLabel: 'PaO2, PEEP',
  risk: {
    level: 'red',
    label: 'Conflict',
    prompt: 'Review conflict before using synced status.',
  },
};

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      ventilation: {
        sessionHistory: null,
        historyErrorCode: null,
        isHistoryLoading: false,
        ...initialState.ventilation,
      },
      ...initialState,
    },
  });

const renderWithProviders = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('Tracking screen compatibility route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLocalSearchParams.mockReturnValue({});
    useVentilationSession.mockReturnValue({
      sessionId: null,
      inputs: null,
      recommendationSummary: null,
      assessmentCurrentStep: 0,
      monitoringTimeSeries: [],
    });
    listTrackingAdmissionsUseCase.mockResolvedValue({ items: [] });
    getTrackingAdmissionUseCase.mockResolvedValue({
      row: trackingRow,
      timeline: [
        {
          entityType: 'Admission',
          entityId: 'adm-1',
          eventType: 'admission_created',
          occurredAt: '2026-05-01T08:00:00.000Z',
        },
      ],
    });
  });

  it('web: shows empty tracking state when no active admissions are returned', async () => {
    const { getByTestId, getByText } = renderWithProviders(
      <HistoryScreenWeb />
    );

    await waitFor(() =>
      expect(getByTestId(HISTORY_TEST_IDS.empty)).toBeDefined()
    );
    expect(
      getByText('No admitted patients are available for tracking yet.')
    ).toBeDefined();
    expect(getByText('Start a New Patient record first to begin tracking.')).toBeDefined();
    expect(getByText('New Patient')).toBeDefined();
    expect(listTrackingAdmissionsUseCase).toHaveBeenCalledWith({
      status: 'ACTIVE',
      limit: 100,
    });
  });

  it('web: renders backend-confirmed active patient, review, sync, conflict, and missing-data status', async () => {
    listTrackingAdmissionsUseCase.mockResolvedValue({ items: [trackingRow] });

    const { getAllByText, getByTestId, getByText } = renderWithProviders(
      <HistoryScreenWeb />
    );

    await waitFor(() =>
      expect(getByTestId(HISTORY_TEST_IDS.list)).toBeDefined()
    );
    expect(getByText('City ICU')).toBeDefined();
    expect(getByText('COL-A-1')).toBeDefined();
    expect(getByText('Bed ICU-2')).toBeDefined();
    expect(getByText('Review')).toBeDefined();
    expect(getAllByText('Conflict').length).toBeGreaterThan(0);
    expect(getByText('Missing data: PaO2, PEEP')).toBeDefined();
  });

  it('web: shows local draft only as draft context', async () => {
    useVentilationSession.mockReturnValue({
      sessionId: 'local-session-1',
      inputs: { condition: 'ARDS' },
      recommendationSummary: null,
      assessmentCurrentStep: 2,
      monitoringTimeSeries: [],
    });

    const { getByTestId } = renderWithProviders(<HistoryScreenWeb />);

    await waitFor(() =>
      expect(getByTestId(HISTORY_TEST_IDS.draftBanner)).toBeDefined()
    );
  });

  it('web: loads backend detail and append-only timeline on details press', async () => {
    listTrackingAdmissionsUseCase.mockResolvedValue({ items: [trackingRow] });

    const { getByTestId, getByText } = renderWithProviders(
      <HistoryScreenWeb />
    );

    await waitFor(() =>
      expect(getByTestId(HISTORY_TEST_IDS.list)).toBeDefined()
    );
    fireEvent.press(getByTestId(HISTORY_TEST_IDS.viewDetails));

    await waitFor(() =>
      expect(getByTestId(HISTORY_TEST_IDS.detailPanel)).toBeDefined()
    );
    expect(getTrackingAdmissionUseCase).toHaveBeenCalledWith('adm-1');
    expect(
      getByText('admission_created | 2026-05-01T08:00:00.000Z')
    ).toBeDefined();
  });

  it('web: confirms a saved admission and auto-opens its tracking detail', async () => {
    useLocalSearchParams.mockReturnValue({
      admissionId: 'adm-1',
      admitted: '1',
    });
    listTrackingAdmissionsUseCase.mockResolvedValue({ items: [trackingRow] });

    const { getByTestId, getByText } = renderWithProviders(
      <HistoryScreenWeb />
    );

    await waitFor(() =>
      expect(getByTestId(HISTORY_TEST_IDS.admittedBanner)).toBeDefined()
    );
    expect(
      getByText('Admission saved. This patient is admitted and available for tracking.')
    ).toBeDefined();
    await waitFor(() =>
      expect(getTrackingAdmissionUseCase).toHaveBeenCalledWith('adm-1')
    );
    expect(getByTestId(HISTORY_TEST_IDS.detailPanel)).toBeDefined();
  });

  it('android and ios render the tracking screen', async () => {
    listTrackingAdmissionsUseCase.mockResolvedValue({ items: [trackingRow] });

    const android = renderWithProviders(<HistoryScreenAndroid />);
    await waitFor(() => expect(android.getByText('COL-A-1')).toBeDefined());

    const ios = renderWithProviders(<HistoryScreenIOS />);
    await waitFor(() => expect(ios.getByText('COL-A-1')).toBeDefined());
  });
});
