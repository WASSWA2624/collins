/**
 * Dashboard Route Tests
 * File: dashboard.test.js
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
    DashboardScreen: () =>
      React.createElement(
        'div',
        { testID: 'dashboard-screen', 'data-testid': 'dashboard-screen' },
        'Mock DashboardScreen'
      ),
  };
});

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      auth: { isAuthenticated: true, user: null },
      ...initialState,
    },
  });

const renderWithProviders = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('app/(main)/dashboard.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders DashboardScreen', () => {
    const DashboardRoute = require('../../../app/(main)/dashboard').default;
    const { getByTestId } = renderWithProviders(<DashboardRoute />);
    expect(getByTestId('dashboard-screen')).toBeDefined();
  });
});
