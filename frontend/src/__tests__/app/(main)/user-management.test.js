const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

jest.mock('@platform/screens', () => {
  const React = require('react');
  return {
    UserManagementScreen: () =>
      React.createElement(
        'div',
        { testID: 'user-management-screen', 'data-testid': 'user-management-screen' },
        'Mock UserManagementScreen'
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

describe('app/(main)/user-management.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders UserManagementScreen', () => {
    const UserManagementRoute = require('../../../app/(main)/user-management').default;
    const { getByTestId } = renderWithProviders(<UserManagementRoute />);
    expect(getByTestId('user-management-screen')).toBeDefined();
  });
});
