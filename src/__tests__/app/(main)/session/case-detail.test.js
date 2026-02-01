/**
 * Case Detail Route Tests (P011 11.S.6)
 * Tests: param parsing, missing caseId path, not-found-in-dataset path
 */
const React = require('react');
const { render, screen } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

const mockUseLocalSearchParams = jest.fn(() => ({}));
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('@platform/screens', () => {
  const React = require('react');
  return {
    CaseDetailScreen: (props) =>
      React.createElement('div', {
        'data-testid': 'case-detail-screen',
        'data-case-id': props.caseId ?? '',
      }, 'CaseDetailScreen'),
  };
});

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

describe('app/(main)/session/case/[case-id].jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({});
  });

  it('passes case-id param to CaseDetailScreen (param parsing)', () => {
    mockUseLocalSearchParams.mockReturnValue({ 'case-id': 'CASE_001' });
    const CaseDetailRoute = require('../../../../app/(main)/session/case/[case-id]').default;
    renderWithProviders(<CaseDetailRoute />);
    const el = screen.getByTestId('case-detail-screen');
    expect(el).toBeDefined();
    expect(el.props['data-case-id']).toBe('CASE_001');
  });

  it('passes undefined caseId when case-id is missing (missing caseId path)', () => {
    mockUseLocalSearchParams.mockReturnValue({});
    const CaseDetailRoute = require('../../../../app/(main)/session/case/[case-id]').default;
    renderWithProviders(<CaseDetailRoute />);
    const el = screen.getByTestId('case-detail-screen');
    expect(el).toBeDefined();
    expect(el.props['data-case-id']).toBe('');
  });

  it('renders CaseDetailScreen for not-found-in-dataset path (screen handles notFound)', () => {
    mockUseLocalSearchParams.mockReturnValue({ 'case-id': 'NON_EXISTENT_CASE_ID' });
    const CaseDetailRoute = require('../../../../app/(main)/session/case/[case-id]').default;
    renderWithProviders(<CaseDetailRoute />);
    const el = screen.getByTestId('case-detail-screen');
    expect(el).toBeDefined();
    expect(el.props['data-case-id']).toBe('NON_EXISTENT_CASE_ID');
  });
});
