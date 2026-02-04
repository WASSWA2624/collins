/**
 * Settings Route Tests (P011 11.S.10)
 * Tests: src/app/(settings)/settings.jsx renders SettingsScreen
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
    SettingsScreen: () =>
      React.createElement('div', { testID: 'settings-screen', 'data-testid': 'settings-screen' }, 'Mock SettingsScreen'),
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

describe('app/(settings)/settings.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render SettingsScreen', () => {
    const SettingsRoute = require('@app/(settings)/settings').default;
    const { getByTestId } = renderWithProviders(<SettingsRoute />);
    expect(getByTestId('settings-screen')).toBeDefined();
  });
});
