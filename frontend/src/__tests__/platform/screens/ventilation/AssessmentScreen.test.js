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
let mockUseAuthState;
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, back: mockBack }),
}));

jest.mock('@hooks', () => ({
  useDebounce: (value) => value,
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
  useAuth: () => mockUseAuthState,
  useVentilationSession: jest.fn(),
}));

jest.mock('@hooks/useVentilationSession', () => jest.fn());

const mockFacilities = [
  {
    id: 'facility-1',
    name: 'Mulago National Referral Hospital',
    district: 'Kampala',
    region: 'Central',
    ownership: 'Government',
  },
  {
    id: 'facility-2',
    name: 'Kiruddu National Referral Hospital',
    district: 'Kampala',
    region: 'Central',
    ownership: 'Government',
  },
];
const createFacilitiesResponse = () => ({
  facilities: mockFacilities,
  meta: { total: mockFacilities.length, page: 1, limit: 25, hasNextPage: false },
});
const mockSearchFacilitiesUseCase = jest.fn(() => new Promise(() => {}));

jest.mock('@features/facilities', () => ({
  searchFacilitiesUseCase: (...args) => mockSearchFacilitiesUseCase(...args),
}));

jest.mock('@features/ventilation', () => ({
  NEW_PATIENT_SYNC_STATUS: {
    SYNCED: 'synced',
    DUPLICATE: 'duplicate',
    QUEUED: 'queued',
    NEEDS_SYNC: 'needs_sync',
  },
  createNewPatientClientRecordId: jest.fn(() => 'admission-test-client'),
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
  saveNewPatientReviewStepApi: jest.fn(() => Promise.resolve({
    step: 'save_review',
    admission: { id: 'admission-1', clientRecordId: 'admission-test-client' },
    review: { clinicianConfirmed: true, admissionReviewStatus: 'PENDING' },
    readiness: { isReadyToSave: true, warnings: [], blockers: [], missingData: [] },
    syncStatus: 'synced',
  })),
  getNewPatientVentilatorRecommendationApi: jest.fn(() => Promise.resolve(null)),
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
  parseAdmissionIntegerInput,
  parseAdmissionNumberInput,
  updateAgeComponentInputs,
  updateBodyMetricInputs,
} = require('@platform/screens/ventilation/AssessmentScreen/useAssessmentScreen');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');
const useVentilationSession = require('@hooks/useVentilationSession');
const {
  createNewPatientClientRecordId,
  getNewPatientVentilatorRecommendationApi,
  getVentilationRecommendationUseCase,
  saveNewPatientReviewStepApi,
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
  facilityId: 'facility-1',
  firstName: 'Jane',
  lastName: 'Doe',
  optionalName: 'Jane Doe',
  patientPathway: 'ADULT',
  reasonForSupport: 'ARDS with hypoxaemia',
  ageYears: 48,
  actualWeightKg: 70,
  heightOrLengthCm: 172,
};

const completeClinicalInputs = {
  ...completePatientInputs,
  admissionId: 'admission-1',
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

const formatDateInput = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const dateInputDaysAgo = (daysAgo) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return formatDateInput(date);
};

describe('AssessmentScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthState = {
      activeFacility: {
        id: 'facility-1',
        facilityId: 'facility-1',
        name: 'Mulago National Referral Hospital',
        roles: ['CLINICIAN'],
      },
      user: {
        id: 'clinician-1',
        memberships: [
          {
            id: 'membership-1',
            facilityId: 'facility-1',
            role: 'CLINICIAN',
            status: 'APPROVED',
            facility: mockFacilities[0],
          },
        ],
      },
    };
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

    it('jumps directly to a clicked step without saving the current step', async () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-step-saveReview'));

      await waitFor(() => {
        expect(defaultSessionMock.setAssessmentStep).toHaveBeenCalledWith(2);
      });
      expect(savePatientReasonStepApi).not.toHaveBeenCalled();
      expect(saveOxygenAbgVentilatorStepApi).not.toHaveBeenCalled();
      expect(mockBack).not.toHaveBeenCalled();
    });
  });

  describe('Wizard steps', () => {
    it('should show patient and reason step initially', () => {
      const { getAllByText } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getAllByText('Patient & reason').length).toBeGreaterThan(0);
    });

    it('keeps Back inactive on the first step and does not route away', () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      const backBtn = getByTestId('assessment-back');

      expect(backBtn.props.accessibilityState?.disabled ?? backBtn.props.disabled).toBe(true);
      fireEvent.press(backBtn);

      expect(defaultSessionMock.setAssessmentStep).not.toHaveBeenCalled();
      expect(mockBack).not.toHaveBeenCalled();
    });

    it('moves Back to the previous New Patient step without routing away', async () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
      });
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      const backBtn = getByTestId('assessment-back');

      expect(backBtn.props.accessibilityState?.disabled ?? backBtn.props.disabled).toBe(false);
      fireEvent.press(backBtn);

      await waitFor(() => {
        expect(defaultSessionMock.setAssessmentStep).toHaveBeenCalledWith(0);
      });
      expect(mockBack).not.toHaveBeenCalled();
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

      expect(getByText('Some required New Patient details are missing. Please review the highlighted fields.')).toBeTruthy();
      expect(getByText('Age or date of birth is required before continuing.')).toBeTruthy();
      expect(getByText('5 fields need attention')).toBeTruthy();
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

    it('sends mandatory first name and optional last name on the patient and reason step', async () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        inputs: {
          ...completePatientInputs,
        },
      });
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(savePatientReasonStepApi).toHaveBeenCalled();
      });
      expect(savePatientReasonStepApi.mock.calls[0][0].patient).toMatchObject({
        firstName: 'Jane',
        lastName: 'Doe',
        optionalName: 'Jane Doe',
      });
    });

    it('shows facility selection for normal users and keeps bed and permitted missing fields out of the New Patient form', async () => {
      const { getByTestId, queryByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      expect(getByTestId('assessment-facility-combobox')).toBeTruthy();
      await waitFor(() => {
        expect(mockSearchFacilitiesUseCase).toHaveBeenCalledWith({
          q: undefined,
          page: 1,
          limit: 25,
        });
      });
      expect(getByTestId('assessment-patient-first-name')).toBeTruthy();
      expect(getByTestId('assessment-patient-last-name')).toBeTruthy();
      expect(getByTestId('assessment-height')).toBeTruthy();
      expect(getByTestId('assessment-bmi')).toBeTruthy();
      expect(queryByTestId('assessment-age-group-adult')).toBeNull();
      expect(queryByTestId('assessment-bed-number')).toBeNull();
      expect(queryByTestId('assessment-permitted-weight')).toBeNull();
    });

    it('saves a non-admin selected facility on the patient and reason step', async () => {
      mockSearchFacilitiesUseCase.mockResolvedValueOnce(createFacilitiesResponse());
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        inputs: completePatientInputs,
      });
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      await waitFor(() => {
        expect(mockSearchFacilitiesUseCase).toHaveBeenCalled();
      });

      fireEvent(getByTestId('assessment-facility-combobox-input'), 'focus');
      await waitFor(() => {
        expect(getByTestId('assessment-facility-combobox-option-1-name').props.children)
          .toBe('Kiruddu National Referral Hospital');
      });
      fireEvent.press(getByTestId('assessment-facility-combobox-option-1'));
      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(savePatientReasonStepApi).toHaveBeenCalled();
      });
      expect(savePatientReasonStepApi.mock.calls[0][0]).toMatchObject({
        facilityId: 'facility-2',
      });
    });

    it('clears selected facility from the built-in select icon instead of a separate text button', async () => {
      mockUseAuthState = {
        activeFacility: {
          id: 'facility-1',
          facilityId: 'facility-1',
          name: 'Mulago National Referral Hospital',
          roles: ['PLATFORM_ADMIN'],
        },
        user: {
          id: 'admin-1',
          memberships: [
            {
              id: 'membership-platform',
              facilityId: 'facility-1',
              role: 'PLATFORM_ADMIN',
              status: 'APPROVED',
              facility: mockFacilities[0],
            },
          ],
        },
      };
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        inputs: completePatientInputs,
      });
      const { getByTestId, queryByText } = renderWithProviders(<AssessmentScreenAndroid />);
      await waitFor(() => {
        expect(mockSearchFacilitiesUseCase).toHaveBeenCalled();
      });

      expect(queryByText('Clear facility')).toBeNull();
      fireEvent.press(getByTestId('assessment-facility-combobox-clear'));

      expect(defaultSessionMock.setInputs).toHaveBeenCalledWith(expect.objectContaining({
        facilityId: '',
      }));
    });

    it('keeps first and last name fields synchronized with the stored display name', async () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.changeText(getByTestId('assessment-patient-first-name'), 'Grace');
      fireEvent.changeText(getByTestId('assessment-patient-last-name'), 'Hopper');

      await waitFor(() => {
        expect(defaultSessionMock.setInputs).toHaveBeenCalledWith(expect.objectContaining({
          firstName: 'Grace',
          optionalName: 'Grace',
        }));
        expect(defaultSessionMock.setInputs).toHaveBeenCalledWith(expect.objectContaining({
          lastName: 'Hopper',
          optionalName: 'Grace Hopper',
        }));
      });
    });

    it('updates derived age and pathway from the age component fields', async () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.changeText(getByTestId('assessment-age-days'), '3');

      await waitFor(() => {
        const call = defaultSessionMock.setInputs.mock.calls.find(([next]) => next.ageDaysPart === 3);
        expect(call?.[0]).toMatchObject({
          ageDays: 3,
          ageDaysPart: 3,
          patientPathway: 'NEONATE',
        });
        expect(call?.[0].ageYears).toBeCloseTo(3 / 365, 4);
      });
    });

    it('updates derived age and pathway from date of birth', async () => {
      const dateOfBirth = dateInputDaysAgo(3);
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.changeText(getByTestId('assessment-date-of-birth'), dateOfBirth);

      await waitFor(() => {
        const call = defaultSessionMock.setInputs.mock.calls.find(([next]) => next.dateOfBirth === dateOfBirth);
        expect(call?.[0]).toMatchObject({
          ageYearsPart: 0,
          ageMonthsPart: 0,
          ageDaysPart: 3,
          ageMonths: 0,
          ageDays: 3,
          patientPathway: 'NEONATE',
        });
        expect(call?.[0].ageYears).toBeCloseTo(3 / 365, 4);
      });
    });

    it('allows patient step save when only months are provided for age', async () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        inputs: {
          ...completePatientInputs,
          patientPathway: 'UNKNOWN',
          ageYears: null,
          ageMonths: 3,
          ageDays: null,
        },
      });
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(savePatientReasonStepApi).toHaveBeenCalled();
      });
      const payload = savePatientReasonStepApi.mock.calls[0][0];
      expect(payload.patient).toMatchObject({
        ageMonths: 3,
        patientPathway: 'INFANT',
      });
      expect(payload.patient.ageYears).toBeCloseTo(0.25, 4);
    });

    it('allows patient step save when date of birth provides the age', async () => {
      const dateOfBirth = dateInputDaysAgo(3);
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        inputs: {
          ...completePatientInputs,
          patientPathway: 'UNKNOWN',
          dateOfBirth,
          ageYears: null,
          ageMonths: null,
          ageDays: null,
          ageYearsPart: null,
          ageMonthsPart: null,
          ageDaysPart: null,
        },
      });
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(savePatientReasonStepApi).toHaveBeenCalled();
      });
      const payload = savePatientReasonStepApi.mock.calls[0][0];
      expect(payload.patient).toMatchObject({
        dateOfBirth,
        ageDays: 3,
        patientPathway: 'NEONATE',
      });
      expect(payload.patient.ageYears).toBeCloseTo(3 / 365, 4);
    });

    it('blocks patient step save when date of birth is invalid', () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        inputs: {
          ...completePatientInputs,
          dateOfBirth: '2026-99-99',
          ageYears: null,
          ageMonths: null,
          ageDays: null,
          ageYearsPart: null,
          ageMonthsPart: null,
          ageDaysPart: null,
        },
      });
      const { getByTestId, getByText } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-next'));

      expect(getByText('Date of birth must use YYYY-MM-DD and cannot be in the future.')).toBeTruthy();
      expect(savePatientReasonStepApi).not.toHaveBeenCalled();
    });

    it('keeps decimal body metric text while Android users are typing', async () => {
      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);
      const weightInput = getByTestId('assessment-weight');

      expect(weightInput.props.keyboardType).toBe('decimal-pad');
      fireEvent.changeText(weightInput, '70.');

      expect(defaultSessionMock.setInputs).not.toHaveBeenCalledWith(expect.objectContaining({
        actualWeightKg: null,
      }));

      fireEvent.changeText(getByTestId('assessment-weight'), '70.5');

      await waitFor(() => {
        expect(defaultSessionMock.setInputs).toHaveBeenCalledWith(expect.objectContaining({
          actualWeightKg: 70.5,
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

    it('captures oxygen and ABG values without support type, manual timestamp, FiO2, or ventilator settings on step two', () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
      });

      const { getByTestId, getByText, queryByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      expect(queryByTestId('assessment-oxygen-support')).toBeNull();
      expect(queryByTestId('assessment-measured-at')).toBeNull();
      expect(queryByTestId('assessment-fio2')).toBeNull();
      expect(queryByTestId('assessment-fio2-at-sample')).toBeNull();
      expect(getByText('Generate Vent Suggestions')).toBeTruthy();
      [
        'assessment-spo2',
        'assessment-respiratory-rate',
        'assessment-heart-rate',
        'assessment-ph',
        'assessment-pao2',
        'assessment-paco2',
        'assessment-hco3',
        'assessment-base-excess',
        'assessment-lactate',
        'assessment-spo2-at-sample',
      ].forEach((testId) => {
        expect(getByTestId(testId).props.keyboardType).toBe('decimal-pad');
      });
      expect(getByTestId('assessment-pao2').props.accessibilityState?.required ?? getByTestId('assessment-pao2').props.required).toBeFalsy();
      expect(getByTestId('assessment-paco2').props.accessibilityState?.required ?? getByTestId('assessment-paco2').props.required).toBeFalsy();
      expect(getByTestId('assessment-ph').props.accessibilityState?.required ?? getByTestId('assessment-ph').props.required).toBeFalsy();
      expect(queryByTestId('assessment-ventilator-mode')).toBeNull();
      expect(queryByTestId('assessment-tidal-volume')).toBeNull();
      expect(queryByTestId('assessment-peep')).toBeNull();
    });

    it('keeps decimal oxygen values while Android users are typing', async () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
      });

      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.changeText(getByTestId('assessment-spo2'), '92.');

      expect(defaultSessionMock.setInputs).not.toHaveBeenCalledWith(expect.objectContaining({
        spo2: null,
      }));

      fireEvent.changeText(getByTestId('assessment-spo2'), '92.5');

      await waitFor(() => {
        expect(defaultSessionMock.setInputs).toHaveBeenCalledWith(expect.objectContaining({
          spo2: 92.5,
        }));
      });
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

    it('warns on a saved-data conflict and can create a separate New Patient record', async () => {
      createNewPatientClientRecordId.mockReturnValueOnce('admission-fresh-client');
      savePatientReasonStepApi
        .mockRejectedValueOnce({
          code: 'CONFLICT',
          status: 409,
          meta: { conflictType: 'IDEMPOTENCY_KEY_REUSED' },
        })
        .mockResolvedValueOnce({
          step: 'patient_reason',
          admission: { id: 'admission-2', clientRecordId: 'admission-fresh-client' },
          readiness: { isReadyToSave: true, warnings: [], blockers: [], missingData: [] },
          syncStatus: 'synced',
        });
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        sessionId: 'admission-test-client',
        inputs: completePatientInputs,
      });

      const { getByTestId, getByText } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(getByTestId('assessment-conflict-warning')).toBeTruthy();
        expect(getByText('Possible matching saved data')).toBeTruthy();
      });
      expect(defaultSessionMock.setAssessmentStep).not.toHaveBeenCalledWith(1);

      fireEvent.press(getByTestId('assessment-conflict-continue'));

      await waitFor(() => {
        expect(savePatientReasonStepApi).toHaveBeenCalledTimes(2);
        expect(defaultSessionMock.startSession).toHaveBeenCalledWith('admission-fresh-client');
        expect(defaultSessionMock.setAssessmentStep).toHaveBeenCalledWith(1);
      });
      expect(savePatientReasonStepApi.mock.calls[1][0]).toMatchObject({
        clientRecordId: 'admission-fresh-client',
        idempotencyKey: 'admission-fresh-client:patient-reason',
      });
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
        expect(getNewPatientVentilatorRecommendationApi).toHaveBeenCalledWith(expect.objectContaining({
          input: expect.objectContaining({ condition: 'ARDS with hypoxaemia', spo2: 88, respiratoryRate: 28, heartRate: 110 }),
        }));
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

    it('recreates the backend admission before recommendation generation when a stale draft reaches step two', async () => {
      saveOxygenAbgVentilatorStepApi.mockRejectedValueOnce({
        code: 'ADMISSION_NOT_FOUND',
        status: 404,
        message: 'Admission not found',
      });
      const { admissionId: _admissionId, ...staleClinicalInputs } = completeClinicalInputs;
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 1,
        inputs: staleClinicalInputs,
      });

      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-next'));

      await waitFor(() => {
        expect(savePatientReasonStepApi).toHaveBeenCalledTimes(1);
        expect(saveOxygenAbgVentilatorStepApi).toHaveBeenCalledTimes(2);
        expect(saveOxygenAbgVentilatorStepApi.mock.calls[0][0]).toBe('admission-test-client');
        expect(saveOxygenAbgVentilatorStepApi.mock.calls[1][0]).toBe('admission-1');
        expect(getNewPatientVentilatorRecommendationApi).toHaveBeenCalled();
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

      const { getByTestId, getAllByText } = renderWithProviders(<AssessmentScreenAndroid />);

      expect(getByTestId('assessment-recommendation')).toBeTruthy();
      expect(getAllByText('Suggested ventilation recommendations').length).toBeGreaterThan(0);
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

    expect(() => getByText('SpO2 must be between 40 and 100.')).toThrow();
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
        expect(saveNewPatientReviewStepApi).toHaveBeenCalledWith('admission-1', expect.objectContaining({
          clinicianConfirmed: true,
        }));
      });
    });

    it('allows final save with clinician confirmation when ventilator suggestions are unavailable', async () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        assessmentCurrentStep: 2,
        inputs: {
          ...completeClinicalInputs,
          clinicianConfirmed: true,
          ventilatorMode: '',
          tidalVolumeMl: null,
          respiratoryRateSet: null,
          peep: null,
          ieRatio: '',
        },
        recommendationSummary: null,
      });

      const { getByTestId } = renderWithProviders(<AssessmentScreenAndroid />);

      fireEvent.press(getByTestId('assessment-generate'));

      await waitFor(() => {
        expect(saveNewPatientReviewStepApi).toHaveBeenCalledWith('admission-1', expect.objectContaining({
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
        expect(saveNewPatientReviewStepApi).toHaveBeenCalledWith('admission-1', expect.objectContaining({
          clinicianConfirmed: true,
        }));
        expect(defaultSessionMock.clearDraft).toHaveBeenCalled();
        expect(defaultSessionMock.resetSession).toHaveBeenCalled();
        expect(mockReplace).toHaveBeenCalledWith('/tracking/admission-1?admitted=1&detail=1');
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

    it('parses age component integers only', () => {
      expect(parseAdmissionIntegerInput('20')).toBe(20);
      expect(parseAdmissionIntegerInput('0.5')).toBeNull();
      expect(parseAdmissionIntegerInput('')).toBeNull();
    });

    it('derives decimal years from years, months, and days', () => {
      const first = updateAgeComponentInputs({}, 'ageYearsPart', 1);
      const second = updateAgeComponentInputs(first, 'ageMonthsPart', 2);
      const third = updateAgeComponentInputs(second, 'ageDaysPart', 3);
      expect(third).toMatchObject({
        ageYearsPart: 1,
        ageMonthsPart: 2,
        ageDaysPart: 3,
        ageMonths: 2,
        ageDays: 3,
        patientPathway: 'CHILD',
      });
      expect(third.ageYears).toBeCloseTo(1 + 2 / 12 + 3 / 365, 4);
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
