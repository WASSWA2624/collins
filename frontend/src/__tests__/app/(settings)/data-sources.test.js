/**
 * Data Sources Route Tests (P011 11.S.12)
 * Tests: src/app/(settings)/data-sources.jsx renders DataSourcesScreen
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
    DataSourcesScreen: () =>
      React.createElement('div', { testID: 'data-sources-screen', 'data-testid': 'data-sources-screen' }, 'Mock DataSourcesScreen'),
  };
});

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', density: 'comfortable', isLoading: false },
      ...initialState,
    },
  });

const renderWithProviders = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('app/(settings)/data-sources.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render DataSourcesScreen', () => {
    const DataSourcesRoute = require('../../../../app/(settings)/data-sources').default;
    const { getByTestId } = renderWithProviders(<DataSourcesRoute />);
    expect(getByTestId('data-sources-screen')).toBeDefined();
  });
});
