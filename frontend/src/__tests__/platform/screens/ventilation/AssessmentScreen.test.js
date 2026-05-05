/**
 * AssessmentScreen Component Tests
 * File: AssessmentScreen.test.js
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

const mockReplace = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, back: mockBack }),
}));

jest.mock('@hooks', () => ({
  useI18n: () => {
    const mockEn = require('@i18n/locales/en.json');
    return {
      t: (key, params) => {
        const keys = key.split('.');
        let v = mockEn;
        for (const k of keys) {
          v = v?.[k];
          if (v === undefined) return key;
        }
        if (typeof v === 'string' && params) {
          return Object.entries(params).reduce((s, [k, val]) => s.replace(`{{${k}}}`, val), v);
        }
        return v || key;
      },
      locale: 'en',
    };
  },
  useVentilationSession: jest.fn(),
}));

jest.mock('@features/ventilation', () => ({
  ADMISSION_SYNC_STATUS: {
    SYNCED: 'synced',
    DUPLICATE: 'duplicate',
    QUEUED: 'queued',
  },
  createAdmissionClientRecordId: jest.fn(() => 'admission-test-client'),
  savePatientReasonStepApi: jest.fn(() => Promise.resolve({
    step: 'patient_reason',
    admission: { id: 'admission-1', clientRecordId: 'admission-test-client' },
    readiness: { isReadyToSave: true, warnings: [], blockers: [], missingData: [] },
    syncStatus: 'synced',
  })),
  saveOxygenAbgVentilatorStepApi: jest.fn(() => Promise.resolve({
    step: 'oxygen_abg_ventilator',
    admission: { id: 'admission-1', clientRecordId: 'admission-test-client' },
    readiness: { isReadyToSave: true, warnings: [], blockers: [], missingData: [] },
    syncStatus: 'synced',
  })),
  saveAdmissionReviewStepApi: jest.fn(() => Promise.resolve({
    step: 'save_review',
    admission: { id: 'admission-1', clientRecordId: 'admission-test-client' },
    review: { clinicianConfirmed: true, admissionReviewStatus: 'PENDING' },
    readiness: { isReadyToSave: true, warnings: [], blockers: [], missingData: [] },
    syncStatus: 'synced',
  })),
  buildVentilationAdditionalTestPrompts: jest.fn(() => []),
  getMissingSimilarityFields: jest.fn(() => []),
  getVentilationRecommendationUseCase: jest.fn(() => Promise.resolve({})),
  getVentilationUnits: jest.fn(() => ({
    spo2: '%',
    respiratoryRate: 'breaths/min',
    heartRate: 'bpm',
  })),
  VENTILATION_SIMILARITY_OPTIONAL_ABG_FIELDS: ['pao2', 'paco2', 'ph'],
}));

const AssessmentScreenAndroid = require('@platform/screens/ventilation/AssessmentScreen/AssessmentScreen.android').default;
const AssessmentScreenIOS = require('@platform/screens/ventilation/AssessmentScreen/AssessmentScreen.ios').default;
const AssessmentScreenWeb = require('@platform/screens/ventilation/AssessmentScreen/AssessmentScreen.web').default;

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');
const { useVentilationSession } = require('@hooks');

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      ventilation: {
        currentSessionId: null,
        currentInputs: null,
        lastRecommendationSummary: null,
        isHydrating: false,
        errorCode: null,
      },
      ...initialState,
    },
  });

const defaultSessionMock = {
  sessionId: null,
  inputs: null,
  setInputs: jest.fn(),
  startSession: jest.fn(),
  setRecommendationSummary: jest.fn(),
  appendToHistory: jest.fn(),
  persistDraft: jest.fn(() => Promise.resolve(true)),
  assessmentCurrentStep: 0,
  setAssessmentStep: jest.fn(),
  isHydrating: false,
  errorCode: null,
  hydrate: jest.fn(),
  clearError: jest.fn(),
};

const renderWithProviders = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('AssessmentScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useVentilationSession.mockReturnValue(defaultSessionMock);
  });

  describe('Platform rendering', () => {
    it('should render on Android', () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByTestId('assessment-screen')).toBeTruthy();
    });

    it('should render on iOS', () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenIOS />);
      expect(getByTestId('assessment-screen')).toBeTruthy();
    });

    it('should render on Web', () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenWeb />);
      expect(getByTestId('assessment-screen')).toBeTruthy();
    });
  });

  describe('Progress indicator', () => {
    it('should show progress bar', () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByTestId('assessment-progress')).toBeTruthy();
    });
  });

  describe('Wizard steps', () => {
    it('should show patient and reason step initially', () => {
      const { getByText } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByText('Patient & reason')).toBeTruthy();
    });

    it('should have Next button on first step', () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByTestId('assessment-next')).toBeTruthy();
    });

    it('should disable Next when required fields missing', () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      const nextBtn = getByTestId('assessment-next');
      expect(nextBtn).toBeTruthy();
      expect(nextBtn.props.accessibilityState?.disabled ?? nextBtn.props.disabled).toBe(true);
    });

    it('should show the three-step flow labels', () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
      });
      const { getByText } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByText('Oxygen, ABG & ventilator')).toBeTruthy();
    });
  });

  describe('Loading state', () => {
    it('should show loading when hydrating', () => {
      useVentilationSession.mockReturnValue({ ...defaultSessionMock, isHydrating: true });
      const { getByText } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByText(/Loading/)).toBeTruthy();
    });
  });

  describe('Summary', () => {
    it('should render compact summary', () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByTestId('assessment-summary')).toBeTruthy();
    });

    it('should toggle summary expand', () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      const expandBtn = getByTestId('assessment-summary-expand');
      expect(expandBtn).toBeTruthy();
      fireEvent.press(expandBtn);
      fireEvent.press(expandBtn);
    });
  });
});
