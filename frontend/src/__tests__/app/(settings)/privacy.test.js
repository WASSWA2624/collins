/**
 * Privacy Route Tests (P011 11.S.13)
 * Tests: src/app/(settings)/privacy.jsx renders PrivacyScreen
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
    PrivacyScreen: () =>
      React.createElement('div', { testID: 'privacy-screen', 'data-testid': 'privacy-screen' }, 'Mock PrivacyScreen'),
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

describe('app/(settings)/privacy.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render PrivacyScreen', () => {
    const PrivacyRoute = require('../../../../app/(settings)/privacy').default;
    const { getByTestId } = renderWithProviders(<PrivacyRoute />);
    expect(getByTestId('privacy-screen')).toBeDefined();
  });
});
