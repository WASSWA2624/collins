/**
 * AssessmentScreen Component Tests
 * File: AssessmentScreen.test.js
 */
const React = require('react');
const { act, render, fireEvent, waitFor } = require('@testing-library/react-native');
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
    units: { tidalVolume: 'mL', peep: 'cmH2O', respiratoryRate: 'breaths/min', ieRatio: '' },
    initialVentilatorSettings: {
      settings: { mode: 'ACV', tidalVolume: 420, respiratoryRate: 18, peep: 8, ieRatio: '1:2' },
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
const {
  parseAdmissionNumberInput,
  updateBodyMetricInputs,
} = require('@platform/screens/ventilation/AssessmentScreen/useAssessmentScreen');

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
  clearDraft: jest.fn(() => Promise.resolve(true)),
  resetSession: jest.fn(),
};

const completePatientInputs = {
  clientRecordId: 'admission-test-client',
  patientPathway: 'ADULT',
  reasonForSupport: 'ARDS with hypoxaemia',
  ageYears: 48,
  actualWeightKg: 70,
  heightOrLengthCm: 172,
};

const completeClinicalInputs = {
  ...completePatientInputs,
  admissionId: 'admission-1',
  oxygenSupportType: 'INVASIVE_VENTILATION',
  spo2: 88,
  respiratoryRate: 28,
  heartRate: 110,
  ph: 7.35,
  pao2: 65,
  paco2: 45,
};

const completeReviewInputs = {
  ...completeClinicalInputs,
  clinicianConfirmed: true,
  ventilatorMode: 'ACV',
  tidalVolumeMl: 420,
  respiratoryRateSet: 18,
  peep: 8,
  ieRatio: '1:2',
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
    it('should show the admission stepper', () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByTestId('assessment-progress')).toBeTruthy();
    });
  });

  describe('Wizard steps', () => {
    it('should show patient and reason step initially', () => {
      const { getAllByText } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getAllByText('Patient & reason').length).toBeGreaterThan(0);
    });

    it('should have Next button on first step', () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByTestId('assessment-next')).toBeTruthy();
    });

    it('shows validation after a blocked Next attempt', () => {
      const { getByTestId, getByText } = renderWithProviders(<AssessmentScreenAndroid />);
      const nextBtn = getByTestId('assessment-next');
      expect(nextBtn).toBeTruthy();
      expect(nextBtn.props.accessibilityState?.disabled ?? nextBtn.props.disabled).toBeFalsy();

      fireEvent.press(nextBtn);

      expect(getByText('Some required admission details are missing. Please review the highlighted fields.')).toBeTruthy();
      expect(getByText('Age is required before continuing.')).toBeTruthy();
      expect(getByText('4 fields need attention')).toBeTruthy();
      expect(savePatientReasonStepApi).not.toHaveBeenCalled();
    });

    it('allows Next when required patient details are complete', () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        inputs: completePatientInputs,
      });
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      const nextBtn = getByTestId('assessment-next');
      expect(nextBtn).toBeTruthy();
      expect(nextBtn.props.accessibilityState?.disabled ?? nextBtn.props.disabled).toBeFalsy();
    });

    it('should hide facility, bed, and permitted missing fields from the New Patient form', () => {
      const { getByTestId, queryByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByTestId('assessment-height')).toBeTruthy();
      expect(getByTestId('assessment-bmi')).toBeTruthy();
      expect(queryByTestId('assessment-facility-id')).toBeNull();
      expect(queryByTestId('assessment-bed-number')).toBeNull();
      expect(queryByTestId('assessment-permitted-weight')).toBeNull();
    });

    it('updates the age group from entered age', async () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.changeText(getByTestId('assessment-age'), '0.5');

      await waitFor(() => {
        expect(defaultSessionMock.setInputs).toHaveBeenCalledWith(expect.objectContaining({
          ageYears: 0.5,
          patientPathway: 'INFANT',
        }));
      });
    });

    it('should show the three-step flow labels', () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
      });
      const { getAllByText } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getAllByText('Oxygen & ABG').length).toBeGreaterThan(0);
    });

    it('captures oxygen and ABG values without manual timestamp, FiO2, or ventilator settings on step two', () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
      });

      const { getByTestId, queryByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      expect(getByTestId('assessment-oxygen-support')).toBeTruthy();
      expect(queryByTestId('assessment-measured-at')).toBeNull();
      expect(queryByTestId('assessment-fio2')).toBeNull();
      expect(queryByTestId('assessment-fio2-at-sample')).toBeNull();
      expect(getByTestId('assessment-ph')).toBeTruthy();
      expect(getByTestId('assessment-ph').props.keyboardType).toBe('decimal-pad');
      expect(getByTestId('assessment-pao2').props.accessibilityState?.required ?? getByTestId('assessment-pao2').props.required).toBeFalsy();
      expect(getByTestId('assessment-paco2').props.accessibilityState?.required ?? getByTestId('assessment-paco2').props.required).toBeFalsy();
      expect(queryByTestId('assessment-ventilator-mode')).toBeNull();
      expect(queryByTestId('assessment-tidal-volume')).toBeNull();
      expect(queryByTestId('assessment-peep')).toBeNull();
    });

    it('advances to clinical information after the patient step save', async () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        inputs: completePatientInputs,
      });
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(savePatientReasonStepApi).toHaveBeenCalled();
        expect(defaultSessionMock.setAssessmentStep).toHaveBeenCalledWith(1);
      });
    });

    it('does not advance when the patient step save fails', async () => {
      savePatientReasonStepApi.mockRejectedValueOnce({ code: 'NETWORK_ERROR' });
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        inputs: completePatientInputs,
      });
      const { getByTestId, getByText } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(savePatientReasonStepApi).toHaveBeenCalled();
        expect(defaultSessionMock.setInputs).toHaveBeenCalledWith(expect.objectContaining({
          syncStatus: 'needs_sync',
        }));
        expect(getByText('We could not connect to the server. Please check your internet connection and try again.')).toBeTruthy();
      });
      expect(defaultSessionMock.setAssessmentStep).not.toHaveBeenCalledWith(1);
    });

    it('generates the dataset recommendation after the clinical information step', async () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
        inputs: completeClinicalInputs,
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
          input: expect.objectContaining({ condition: 'ARDS with hypoxaemia', spo2: 88, respiratoryRate: 28, heartRate: 110 }),
        }));
        expect(defaultSessionMock.setInputs).toHaveBeenCalledWith(expect.objectContaining({
          ventilatorMode: 'ACV',
          tidalVolumeMl: 420,
          respiratoryRateSet: 18,
          peep: 8,
          ieRatio: '1:2',
        }));
        expect(defaultSessionMock.setAssessmentStep).toHaveBeenCalledWith(2);
      });
    });

    it('uses the hydrated admission id for dependent admission steps', async () => {
      const store = createMockStore();
      let sessionState = {
        ...defaultSessionMock,
        sessionId: null,
        assessmentCurrentStep: 1,
        inputs: null,
      };
      useVentilationSession.mockImplementation(() => sessionState);

      const { getByTestId, rerender } = renderWithProviders(<AssessmentScreenAndroid />, store);

      sessionState = {
        ...sessionState,
        sessionId: 'hydrated-session',
        inputs: {
          ...completeClinicalInputs,
          clientRecordId: 'hydrated-client-record',
          admissionId: 'hydrated-admission',
        },
      };

      await act(async () => {
        rerender(
          <Provider store={store}>
            <ThemeProvider theme={lightTheme}>
              <AssessmentScreenAndroid />
            </ThemeProvider>
          </Provider>
        );
      });

      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(saveOxygenAbgVentilatorStepApi).toHaveBeenCalledWith(
          'hydrated-admission',
          expect.objectContaining({
            clientRecordId: 'hydrated-client-record',
            oxygen: expect.any(Object),
            abg: expect.any(Object),
          })
        );
      });
    });

    it('shows the dataset recommendation on the final New Patient step', () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 2,
        recommendationSummary: {
          source: { confidenceTier: 'medium' },
          units: { tidalVolume: 'mL', peep: 'cmH2O', respiratoryRate: 'breaths/min', ieRatio: '' },
          initialVentilatorSettings: {
            settings: { mode: 'ACV', tidalVolume: 420, respiratoryRate: 18, peep: 8, ieRatio: '1:2' },
          },
        },
      });

      const { getByTestId, getByText } = renderWithProviders(<AssessmentScreenAndroid />);

      expect(getByTestId('assessment-recommendation')).toBeTruthy();
      expect(getByText('Dataset recommendation')).toBeTruthy();
      expect(getByTestId('assessment-suggested-ventilator-mode').props.value).toBe('ACV');
      expect(getByTestId('assessment-suggested-tidal-volume')).toBeTruthy();
    });

    it('updates clinician confirmation when the final checkbox is pressed', () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 2,
        inputs: {
          ...completeClinicalInputs,
          clinicianConfirmed: false,
          ventilatorMode: 'ACV',
          tidalVolumeMl: 420,
          respiratoryRateSet: 18,
          peep: 8,
        },
      });

      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      const checkbox = getByTestId('assessment-clinician-confirmed');
      fireEvent.press(checkbox);
      fireEvent(checkbox, 'change', { target: { checked: true } });

      expect(defaultSessionMock.setInputs).toHaveBeenCalledWith(expect.objectContaining({
        clinicianConfirmed: true,
      }));
    });

    it('shows range suggestions without blocking out-of-range clinical values', async () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
        inputs: {
          ...completeClinicalInputs,
          spo2: 140,
        },
      });

      const { getByTestId, getByText } = renderWithProviders(<AssessmentScreenAndroid />);
      const nextBtn = getByTestId('assessment-next');

      expect(getByText('Suggested range: 92-100%, or local target.')).toBeTruthy();
      fireEvent.press(nextBtn);

      await waitFor(() => {
        expect(saveOxygenAbgVentilatorStepApi).toHaveBeenCalled();
      });
    });

    it('continues to review when dataset recommendation generation fails', async () => {
      getVentilationRecommendationUseCase.mockRejectedValueOnce({ code: 'ADMISSION_RECOMMENDATION_FAILED' });
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
        inputs: completeClinicalInputs,
      });

      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(defaultSessionMock.setRecommendationSummary).toHaveBeenCalledWith(null);
        expect(defaultSessionMock.setAssessmentStep).toHaveBeenCalledWith(2);
      });
    });

    it('allows final save when optional PaO2 is missing', async () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 2,
        inputs: {
          ...completeReviewInputs,
          pao2: null,
        },
      });

      const { getByTestId, getByText } = renderWithProviders(<AssessmentScreenAndroid />);
      const saveBtn = getByTestId('assessment-generate');

      expect(() => getByText('PaO2 is required before continuing.')).toThrow();
      fireEvent.press(saveBtn);

      await waitFor(() => {
        expect(saveAdmissionReviewStepApi).toHaveBeenCalledWith('admission-1', expect.objectContaining({
          clinicianConfirmed: true,
        }));
      });
    });

    it('saves suggested ventilator settings before completing New Patient review', async () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 2,
        inputs: completeReviewInputs,
        recommendationSummary: {
          source: { confidenceTier: 'medium' },
          units: { tidalVolume: 'mL', peep: 'cmH2O', respiratoryRate: 'breaths/min', ieRatio: '' },
          initialVentilatorSettings: {
            settings: { mode: 'ACV', tidalVolume: 420, respiratoryRate: 18, peep: 8, ieRatio: '1:2' },
          },
        },
      });

      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-generate'));

      await waitFor(() => {
        expect(saveOxygenAbgVentilatorStepApi).toHaveBeenCalledWith('admission-1', expect.objectContaining({
          oxygen: expect.objectContaining({
            spo2: 88,
            measuredAt: expect.any(String),
          }),
          abg: expect.objectContaining({
            pao2: 65,
            paco2: 45,
            ph: 7.35,
          }),
          ventilator: expect.objectContaining({
            mode: 'ACV',
            tidalVolumeMl: 420,
            respiratoryRateSet: 18,
            peep: 8,
            ieRatio: '1:2',
          }),
        }));
        expect(saveAdmissionReviewStepApi).toHaveBeenCalledWith('admission-1', expect.objectContaining({
          clinicianConfirmed: true,
        }));
        expect(defaultSessionMock.clearDraft).toHaveBeenCalled();
        expect(defaultSessionMock.resetSession).toHaveBeenCalled();
        expect(mockReplace).toHaveBeenCalledWith('/tracking?admissionId=admission-1&admitted=1');
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
    it('parses only complete numeric input', () => {
      expect(parseAdmissionNumberInput('0.5')).toBe(0.5);
      expect(parseAdmissionNumberInput('12abc')).toBeNull();
      expect(parseAdmissionNumberInput('')).toBeNull();
    });

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
