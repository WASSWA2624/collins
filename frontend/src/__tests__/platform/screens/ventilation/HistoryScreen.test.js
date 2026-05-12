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

jest.mock('@features/facilities', () => ({
  searchFacilitiesUseCase: jest.fn(),
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
const { searchFacilitiesUseCase } = require('@features/facilities');

const lightTheme =
  require('@theme/light.theme').default || require('@theme/light.theme');

const HISTORY_TEST_IDS = {
  screen: 'history-screen',
  empty: 'history-empty',
  draftBanner: 'tracking-draft-banner',
  admittedBanner: 'tracking-admitted-banner',
  list: 'history-list',
  listHeader: 'tracking-list-header',
  search: 'tracking-search',
  searchEmpty: 'tracking-search-empty',
  facilitySelect: 'tracking-facility-select',
  viewDetails: 'history-view-details',
  rowNumber: 'history-row-number',
  rowButton: 'history-row-button',
  detailPanel: 'tracking-detail-panel',
  detailPatientData: 'tracking-detail-patient-data',
};

const trackingRow = {
  admissionId: 'adm-1',
  patientId: 'patient-1',
  patientCode: 'YMXB24',
  appAdmissionCode: 'ADM001',
  appPatientCode: 'YMXB24',
  optionalName: 'Jane Doe',
  hospitalNumber: 'HN-7788',
  facilityId: 'facility-1',
  facilityName: 'City ICU',
  bedNumber: 'ICU-2',
  admissionStatusLabel: 'Active',
  patientPathwayLabel: 'Adult',
  ageLabel: '8y 2m',
  dateOfBirthLabel: 'Mar 1, 2018',
  actualWeightKg: 26,
  referenceWeightKg: 25.5,
  heightOrLengthCm: 124,
  admittedAtLabel: '5/1/26, 8:00 AM',
  admittedDateLabel: '5/1/26',
  admittedTimeLabel: '8:00 AM',
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
      auth: {
        user: {
          id: 'clinician-1',
          name: 'Clinician User',
          activeFacilityId: 'facility-1',
          activeFacility: {
            id: 'facility-1',
            facilityId: 'facility-1',
            name: 'City ICU',
            roles: ['CLINICIAN'],
          },
          memberships: [
            {
              id: 'membership-1',
              facilityId: 'facility-1',
              role: 'CLINICIAN',
              status: 'APPROVED',
              facility: {
                id: 'facility-1',
                name: 'City ICU',
                district: 'Central',
                region: 'Metro',
              },
            },
          ],
        },
        activeFacility: {
          id: 'facility-1',
          facilityId: 'facility-1',
          name: 'City ICU',
          roles: ['CLINICIAN'],
        },
        isAuthenticated: true,
        requiresActiveFacility: false,
        isLoading: false,
        hasRestoredSession: true,
        sessionStatus: 'authenticated',
        errorCode: null,
        sessionErrorCode: null,
        ...initialState.auth,
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
    searchFacilitiesUseCase.mockResolvedValue({
      facilities: [
        {
          id: 'facility-1',
          name: 'City ICU',
          district: 'Central',
          region: 'Metro',
        },
        {
          id: 'facility-2',
          name: 'County Hospital',
          district: 'North',
          region: 'Metro',
        },
      ],
    });
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
      facilityId: 'facility-1',
      limit: 100,
    });
    expect(searchFacilitiesUseCase).toHaveBeenCalledWith({ limit: 500 });
  });

  it('web: loads all facilities and filters tracking by a selected outside facility', async () => {
    listTrackingAdmissionsUseCase.mockResolvedValue({ items: [trackingRow] });

    const { getByTestId } = renderWithProviders(<HistoryScreenWeb />);

    await waitFor(() =>
      expect(getByTestId(HISTORY_TEST_IDS.list)).toBeDefined()
    );
    await waitFor(() =>
      expect(searchFacilitiesUseCase).toHaveBeenCalledWith({ limit: 500 })
    );

    fireEvent(getByTestId(`${HISTORY_TEST_IDS.facilitySelect}-input`), 'focus');
    await waitFor(() =>
      expect(
        getByTestId(`${HISTORY_TEST_IDS.facilitySelect}-option-1-name`).props
          .children
      ).toBe('County Hospital')
    );

    fireEvent(
      getByTestId(`${HISTORY_TEST_IDS.facilitySelect}-option-1`),
      'click'
    );

    await waitFor(() =>
      expect(listTrackingAdmissionsUseCase).toHaveBeenLastCalledWith({
        status: 'ACTIVE',
        facilityId: 'facility-2',
        limit: 100,
      })
    );
    expect(
      getByTestId(`${HISTORY_TEST_IDS.facilitySelect}-input`).props.value
    ).toBe('County Hospital');
  });

  it('web: renders backend-confirmed active patients as compact one-line rows', async () => {
    listTrackingAdmissionsUseCase.mockResolvedValue({ items: [trackingRow] });

    const { getByTestId, getByText, queryByTestId, queryByText } = renderWithProviders(
      <HistoryScreenWeb />
    );

    await waitFor(() =>
      expect(getByTestId(HISTORY_TEST_IDS.list)).toBeDefined()
    );
    expect(
      getByTestId(`${HISTORY_TEST_IDS.facilitySelect}-input`).props.value
    ).toBe('City ICU');
    expect(
      getByTestId(`${HISTORY_TEST_IDS.facilitySelect}-clear`)
    ).toBeDefined();
    expect(getByTestId(HISTORY_TEST_IDS.search)).toBeDefined();
    expect(getByTestId(HISTORY_TEST_IDS.listHeader)).toBeDefined();
    expect(getByText('No.')).toBeDefined();
    expect(getByText('Code')).toBeDefined();
    expect(getByText('Patient')).toBeDefined();
    expect(getByText('Admission Date')).toBeDefined();
    expect(getByText('Admission Time')).toBeDefined();
    expect(
      getByTestId(`${HISTORY_TEST_IDS.rowNumber}-${trackingRow.admissionId}`)
        .props.children
    ).toBe(1);
    expect(getByText('YMXB24')).toBeDefined();
    expect(getByText('Jane Doe')).toBeDefined();
    expect(getByText('5/1/26')).toBeDefined();
    expect(getByText('8:00 AM')).toBeDefined();
    expect(queryByText('patient-1')).toBeNull();
    expect(queryByText('5/1/26, 8:00 AM')).toBeNull();
    expect(queryByTestId(HISTORY_TEST_IDS.viewDetails)).toBeNull();
    expect(queryByText('Missing data: PaO2, PEEP')).toBeNull();
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

  it('web: opens patient detail page when a compact row is pressed', async () => {
    listTrackingAdmissionsUseCase.mockResolvedValue({ items: [trackingRow] });

    const { getByTestId } = renderWithProviders(
      <HistoryScreenWeb />
    );

    await waitFor(() =>
      expect(getByTestId(HISTORY_TEST_IDS.list)).toBeDefined()
    );
    const rowButton = getByTestId(
      `${HISTORY_TEST_IDS.rowButton}-${trackingRow.admissionId}`
    );
    fireEvent.press(rowButton);

    expect(mockPush).toHaveBeenCalledWith('/tracking/adm-1?detail=1');
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
      expect(mockPush).toHaveBeenCalledWith('/tracking/adm-1?detail=1')
    );
  });

  it('web: direct detail route loads tracking detail without rendering the list', async () => {
    useLocalSearchParams.mockReturnValue({
      admissionId: 'adm-1',
      admitted: '1',
    });
    listTrackingAdmissionsUseCase.mockResolvedValue({ items: [trackingRow] });

    const { getByTestId, queryByTestId, getByText } = renderWithProviders(
      <HistoryScreenWeb detailMode />
    );

    await waitFor(() =>
      expect(getTrackingAdmissionUseCase).toHaveBeenCalledWith('adm-1')
    );
    expect(getByTestId(HISTORY_TEST_IDS.detailPanel)).toBeDefined();
    expect(queryByTestId(HISTORY_TEST_IDS.list)).toBeNull();
    expect(getByText('Jane Doe')).toBeDefined();
    expect(getByText('Patient data')).toBeDefined();
    expect(getByText('Patient ID')).toBeDefined();
    expect(getByText('YMXB24')).toBeDefined();
    expect(getByText('Admission ID')).toBeDefined();
    expect(getByText('ADM001')).toBeDefined();
    expect(getByText('Patient history')).toBeDefined();
    expect(listTrackingAdmissionsUseCase).not.toHaveBeenCalled();
  });

  it('android and ios render the tracking screen', async () => {
    listTrackingAdmissionsUseCase.mockResolvedValue({ items: [trackingRow] });

    const android = renderWithProviders(<HistoryScreenAndroid />);
    await waitFor(() => expect(android.getByText('Jane Doe')).toBeDefined());

    const ios = renderWithProviders(<HistoryScreenIOS />);
    await waitFor(() => expect(ios.getByText('Jane Doe')).toBeDefined());
  });
});
