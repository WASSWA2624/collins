/**
 * AssessmentScreen Component Tests
 * File: AssessmentScreen.test.js
 */
const React = require('react');
const { render, fireEvent, waitFor } = require('@testing-library/react-native');
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

jest.mock('@hooks/useVentilationSession', () => jest.fn());

jest.mock('@features/ventilation', () => ({
  ADMISSION_SYNC_STATUS: {
    SYNCED: 'synced',
    DUPLICATE: 'duplicate',
    QUEUED: 'queued',
    NEEDS_SYNC: 'needs_sync',
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
  getVentilationRecommendationUseCase: jest.fn(() => Promise.resolve({
    source: { confidenceTier: 'medium' },
    safety: { intendedUseWarning: 'Dataset preview only.', validationRequirement: 'Clinician review required.' },
    units: { tidalVolume: 'mL', fio2: 'fraction', peep: 'cmH2O', respiratoryRate: 'breaths/min', ieRatio: '' },
    initialVentilatorSettings: {
      settings: { mode: 'ACV', tidalVolume: 420, respiratoryRate: 18, fio2: 0.5, peep: 8, ieRatio: '1:2' },
    },
  })),
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
const { updateBodyMetricInputs } = require('@platform/screens/ventilation/AssessmentScreen/useAssessmentScreen');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');
const useVentilationSession = require('@hooks/useVentilationSession');
const {
  getVentilationRecommendationUseCase,
  saveAdmissionReviewStepApi,
  saveOxygenAbgVentilatorStepApi,
  savePatientReasonStepApi,
} = require('@features/ventilation');

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

    it('should allow Next with default pathway and optional reason', () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      const nextBtn = getByTestId('assessment-next');
      expect(nextBtn).toBeTruthy();
      expect(nextBtn.props.accessibilityState?.disabled ?? nextBtn.props.disabled).toBeFalsy();
    });

    it('should hide facility, bed, and permitted missing fields from the admit form', () => {
      const { getByTestId, queryByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByTestId('assessment-height')).toBeTruthy();
      expect(getByTestId('assessment-bmi')).toBeTruthy();
      expect(queryByTestId('assessment-facility-id')).toBeNull();
      expect(queryByTestId('assessment-bed-number')).toBeNull();
      expect(queryByTestId('assessment-permitted-weight')).toBeNull();
    });

    it('should show the three-step flow labels', () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
      });
      const { getByText } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByText('Oxygen & ABG')).toBeTruthy();
    });

    it('captures oxygen and ABG values without manual ventilator settings on step two', () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
      });

      const { getByTestId, queryByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      expect(getByTestId('assessment-oxygen-support')).toBeTruthy();
      expect(getByTestId('assessment-measured-at')).toBeTruthy();
      expect(getByTestId('assessment-ph')).toBeTruthy();
      expect(queryByTestId('assessment-ventilator-mode')).toBeNull();
      expect(queryByTestId('assessment-tidal-volume')).toBeNull();
      expect(queryByTestId('assessment-peep')).toBeNull();
    });

    it('advances to clinical information after the patient step save', async () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(savePatientReasonStepApi).toHaveBeenCalled();
        expect(defaultSessionMock.setAssessmentStep).toHaveBeenCalledWith(1);
      });
    });

    it('still advances locally when the patient step sync fails', async () => {
      savePatientReasonStepApi.mockRejectedValueOnce({ code: 'NETWORK_ERROR' });
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(defaultSessionMock.setAssessmentStep).toHaveBeenCalledWith(1);
      });
    });

    it('generates the dataset recommendation after the clinical information step', async () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
        inputs: {
          admissionId: 'admission-1',
          clientRecordId: 'admission-test-client',
          patientPathway: 'ADULT',
          reasonForSupport: 'ARDS',
          spo2: 88,
          respiratoryRate: 28,
          heartRate: 110,
          pao2: 65,
          paco2: 45,
          ph: 7.35,
        },
      });
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(saveOxygenAbgVentilatorStepApi).toHaveBeenCalledWith('admission-1', expect.objectContaining({
          oxygen: expect.any(Object),
          abg: expect.any(Object),
        }));
        expect(saveOxygenAbgVentilatorStepApi.mock.calls[0][1].ventilator).toBeUndefined();
        expect(getVentilationRecommendationUseCase).toHaveBeenCalledWith(expect.objectContaining({
          input: expect.objectContaining({ condition: 'ARDS', spo2: 88, respiratoryRate: 28, heartRate: 110 }),
        }));
        expect(defaultSessionMock.setInputs).toHaveBeenCalledWith(expect.objectContaining({
          ventilatorMode: 'ACV',
          tidalVolumeMl: 420,
          respiratoryRateSet: 18,
          ventilatorFio2: 0.5,
          peep: 8,
          ieRatio: '1:2',
        }));
        expect(defaultSessionMock.setAssessmentStep).toHaveBeenCalledWith(2);
      });
    });

    it('shows the dataset recommendation on the final admit step', () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 2,
        recommendationSummary: {
          source: { confidenceTier: 'medium' },
          units: { tidalVolume: 'mL', fio2: 'fraction', peep: 'cmH2O', respiratoryRate: 'breaths/min', ieRatio: '' },
          initialVentilatorSettings: {
            settings: { mode: 'ACV', tidalVolume: 420, respiratoryRate: 18, fio2: 0.5, peep: 8, ieRatio: '1:2' },
          },
        },
      });

      const { getByTestId, getByText } = renderWithProviders(<AssessmentScreenAndroid />);

      expect(getByTestId('assessment-recommendation')).toBeTruthy();
      expect(getByText('Dataset recommendation')).toBeTruthy();
      expect(getByTestId('assessment-suggested-ventilator-mode').props.value).toBe('ACV');
      expect(getByTestId('assessment-suggested-tidal-volume')).toBeTruthy();
    });

    it('saves suggested ventilator settings before completing admit review', async () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 2,
        inputs: {
          admissionId: 'admission-1',
          clientRecordId: 'admission-test-client',
          patientPathway: 'ADULT',
          clinicianConfirmed: true,
          ventilatorMode: 'ACV',
          tidalVolumeMl: 420,
          respiratoryRateSet: 18,
          ventilatorFio2: 0.5,
          peep: 8,
          ieRatio: '1:2',
        },
        recommendationSummary: {
          source: { confidenceTier: 'medium' },
          units: { tidalVolume: 'mL', fio2: 'fraction', peep: 'cmH2O', respiratoryRate: 'breaths/min', ieRatio: '' },
          initialVentilatorSettings: {
            settings: { mode: 'ACV', tidalVolume: 420, respiratoryRate: 18, fio2: 0.5, peep: 8, ieRatio: '1:2' },
          },
        },
      });

      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-generate'));

      await waitFor(() => {
        expect(saveOxygenAbgVentilatorStepApi).toHaveBeenCalledWith('admission-1', expect.objectContaining({
          ventilator: expect.objectContaining({
            mode: 'ACV',
            tidalVolumeMl: 420,
            respiratoryRateSet: 18,
            fio2: 0.5,
            peep: 8,
            ieRatio: '1:2',
          }),
        }));
        expect(saveAdmissionReviewStepApi).toHaveBeenCalledWith('admission-1', expect.objectContaining({
          clinicianConfirmed: true,
        }));
        expect(mockReplace).toHaveBeenCalledWith('/tracking');
      });
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

  describe('Body metrics', () => {
    it('calculates BMI from weight and height', () => {
      const first = updateBodyMetricInputs({}, 'actualWeightKg', 70);
      const second = updateBodyMetricInputs(first, 'heightOrLengthCm', 175);
      expect(second).toMatchObject({
        actualWeightKg: 70,
        heightOrLengthCm: 175,
        bmi: 22.9,
      });
    });

    it('calculates the missing weight from BMI and height', () => {
      const first = updateBodyMetricInputs({}, 'heightOrLengthCm', 180);
      const second = updateBodyMetricInputs(first, 'bmi', 25);
      expect(second).toMatchObject({
        actualWeightKg: 81,
        heightOrLengthCm: 180,
        bmi: 25,
      });
    });
  });
});
