/**
 * Recommendation Route Tests
 * File: recommendation.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

jest.mock('@platform/screens', () => {
  const React = require('react');
  return {
    RecommendationScreen: () =>
      React.createElement('div', { testID: 'recommendation-screen', 'data-testid': 'recommendation-screen' }, 'Mock RecommendationScreen'),
  };
});

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      ventilation: {
        currentSessionId: 'session-1',
        currentInputs: {},
        lastRecommendationSummary: { source: { confidenceTier: 'medium' } },
        isHydrating: false,
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

describe('app/(main)/session/recommendation.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render RecommendationScreen', () => {
    const RecommendationRoute = require('../../../app/(main)/session/recommendation').default;
    const { getByTestId } = renderWithProviders(<RecommendationRoute />);
    expect(getByTestId('recommendation-screen')).toBeDefined();
  });
});
