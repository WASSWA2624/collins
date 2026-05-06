/**
 * CaseDetailScreen Component Tests (P011 11.S.6)
 * Tests: missing caseId path, not-found-in-dataset path, intended-use warning
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

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
          return Object.entries(params).reduce((s, [k, val]) => s.replace(`{{${k}}}`, String(val)), v);
        }
        return v || key;
      },
      locale: 'en',
    };
  },
}));

const CaseDetailScreenWeb = require('@platform/screens/ventilation/CaseDetailScreen/CaseDetailScreen.web').default;
const { CASE_DETAIL_TEST_IDS } = require('@platform/screens/ventilation/CaseDetailScreen/types');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      ventilation: { currentSessionId: null, isHydrating: false },
      ...initialState,
    },
  });

const renderWithProviders = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('CaseDetailScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows missing caseId message when caseId is missing (missing caseId path)', () => {
    const { getByTestId, getByText } = renderWithProviders(<CaseDetailScreenWeb caseId={undefined} />);
    expect(getByTestId(CASE_DETAIL_TEST_IDS.missingCaseId)).toBeDefined();
    expect(getByText('No case selected.')).toBeDefined();
  });

  it('shows not-found message when caseId is not in dataset (not-found-in-dataset path)', () => {
    const { getByTestId, getByText } = renderWithProviders(<CaseDetailScreenWeb caseId="NON_EXISTENT_CASE_ID" />);
    expect(getByTestId(CASE_DETAIL_TEST_IDS.notFound)).toBeDefined();
    expect(getByText('Case not found in dataset.')).toBeDefined();
  });

  it('shows intended-use warning and case content when case exists', () => {
    const { getByTestId } = renderWithProviders(<CaseDetailScreenWeb caseId="CASE_001" />);
    expect(getByTestId(CASE_DETAIL_TEST_IDS.screen)).toBeDefined();
    expect(getByTestId(CASE_DETAIL_TEST_IDS.intendedUseWarning)).toBeDefined();
    expect(getByTestId(CASE_DETAIL_TEST_IDS.summary)).toBeDefined();
    expect(getByTestId(CASE_DETAIL_TEST_IDS.patientProfile)).toBeDefined();
    expect(getByTestId(CASE_DETAIL_TEST_IDS.ventilatorSettings)).toBeDefined();
    expect(getByTestId(CASE_DETAIL_TEST_IDS.reviewStatus)).toBeDefined();
  });
});
