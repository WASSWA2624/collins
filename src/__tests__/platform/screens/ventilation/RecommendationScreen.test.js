/**
 * RecommendationScreen Component Tests
 * File: RecommendationScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
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

const RecommendationScreenWeb = require('@platform/screens/ventilation/RecommendationScreen/RecommendationScreen.web').default;
const RecommendationScreenAndroid = require('@platform/screens/ventilation/RecommendationScreen/RecommendationScreen.android').default;
const RecommendationScreenIOS = require('@platform/screens/ventilation/RecommendationScreen/RecommendationScreen.ios').default;
const { useVentilationSession } = require('@hooks');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const mockRecommendation = {
  source: { caseIds: ['CASE_001'], primaryCaseId: 'CASE_001', confidenceTier: 'medium' },
  safety: {
    intendedUseWarning: 'Research/prototype dataset. Not clinically validated.',
    validationRequirement: 'For real-world use: populate from audited sources.',
  },
  units: { tidalVolume: 'mL', fio2: 'fraction', peep: 'cmH2O', ieRatio: 'string' },
  initialVentilatorSettings: {
    source: 'recommendations.initialSettings',
    settings: {
      mode: 'ACV',
      tidalVolume: 450,
      respiratoryRate: 16,
      fio2: 0.6,
      peep: 8,
      ieRatio: '1:2',
    },
  },
  monitoringPoints: ['plateau pressure', 'oxygenation'],
  riskFactors: ['moderate ARDS'],
  complicationHistory: [],
  matched: [{ caseId: 'CASE_001', score: 0.9, completeness: 0.8, confidenceTier: 'medium' }],
  caseEvidence: [{ caseId: 'CASE_001', reviewStatus: 'unvalidated', evidenceNotes: null, citations: [] }],
};

const defaultSessionMock = {
  recommendationSummary: mockRecommendation,
  inputs: { condition: 'ARDS', spo2: 85, respiratoryRate: 28, heartRate: 110 },
  isHydrating: false,
  errorCode: null,
  sessionId: 'session-1',
};

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      ventilation: { currentSessionId: 'session-1', currentInputs: {}, lastRecommendationSummary: mockRecommendation, isHydrating: false },
      ...initialState,
    },
  });

const renderWithProviders = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('RecommendationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useVentilationSession.mockReturnValue(defaultSessionMock);
  });

  describe('Platform rendering', () => {
    it('should render on Android', () => {
      const { getByTestId } = renderWithProviders(<RecommendationScreenAndroid />);
      expect(getByTestId('recommendation-screen')).toBeTruthy();
    });

    it('should render on iOS', () => {
      const { getByTestId } = renderWithProviders(<RecommendationScreenIOS />);
      expect(getByTestId('recommendation-screen')).toBeTruthy();
    });

    it('should render on Web', () => {
      const { getByTestId } = renderWithProviders(<RecommendationScreenWeb />);
      expect(getByTestId('recommendation-screen')).toBeTruthy();
    });
  });

  describe('With recommendation data', () => {
    it('should show recommended settings section', () => {
      const { getByTestId } = renderWithProviders(<RecommendationScreenWeb />);
      expect(getByTestId('recommendation-settings')).toBeTruthy();
    });

    it('should show intended use warning', () => {
      const { getByTestId } = renderWithProviders(<RecommendationScreenWeb />);
      expect(getByTestId('recommendation-warning')).toBeTruthy();
    });

    it('should show Start monitoring button', () => {
      const { getByTestId } = renderWithProviders(<RecommendationScreenWeb />);
      expect(getByTestId('recommendation-start-monitoring')).toBeTruthy();
    });

    it('should show confidence section', () => {
      const { getByTestId } = renderWithProviders(<RecommendationScreenWeb />);
      expect(getByTestId('recommendation-confidence')).toBeTruthy();
    });

    it('should show monitoring section when data present', () => {
      const { getByTestId } = renderWithProviders(<RecommendationScreenWeb />);
      expect(getByTestId('recommendation-monitoring')).toBeTruthy();
    });

    it('should show risks section when data present', () => {
      const { getByTestId } = renderWithProviders(<RecommendationScreenWeb />);
      expect(getByTestId('recommendation-risks')).toBeTruthy();
    });

    it('should show matched cases section when data present', () => {
      const { getByTestId } = renderWithProviders(<RecommendationScreenWeb />);
      expect(getByTestId('recommendation-matched-cases')).toBeTruthy();
    });

    it('should show evidence section when data present', () => {
      const { getByTestId } = renderWithProviders(<RecommendationScreenWeb />);
      expect(getByTestId('recommendation-evidence')).toBeTruthy();
    });

    it('should have accessible screen label', () => {
      const { getByLabelText } = renderWithProviders(<RecommendationScreenWeb />);
      expect(getByLabelText('Recommendation screen')).toBeTruthy();
    });

    it('should navigate to case detail when case link clicked (web)', () => {
      const { getByTestId } = renderWithProviders(<RecommendationScreenWeb />);
      const caseLink = getByTestId('recommendation-case-CASE_001');
      caseLink.click?.();
      expect(mockPush).toHaveBeenCalledWith('/session/case/CASE_001');
    });
  });

  describe('Empty state', () => {
    it('should show empty message when no recommendation', () => {
      useVentilationSession.mockReturnValue({
        ...defaultSessionMock,
        recommendationSummary: null,
        inputs: null,
      });
      const { getByText } = renderWithProviders(<RecommendationScreenWeb />);
      expect(getByText(/No recommendation available/)).toBeTruthy();
    });
  });

  describe('Loading state', () => {
    it('should show loading when hydrating', () => {
      useVentilationSession.mockReturnValue({ ...defaultSessionMock, isHydrating: true });
      const { getByText } = renderWithProviders(<RecommendationScreenWeb />);
      expect(getByText(/Loading/)).toBeTruthy();
    });
  });
});
