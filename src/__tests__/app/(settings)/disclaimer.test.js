/**
 * Disclaimer Route Tests (P011 11.S.11)
 * Tests: src/app/(settings)/disclaimer.jsx renders DisclaimerScreen
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
    DisclaimerScreen: () =>
      React.createElement('div', { testID: 'disclaimer-screen', 'data-testid': 'disclaimer-screen' }, 'Mock DisclaimerScreen'),
  };
});

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', density: 'comfortable', isLoading: false, disclaimerAcknowledged: false },
      ...initialState,
    },
  });

const renderWithProviders = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('app/(settings)/disclaimer.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render DisclaimerScreen', () => {
    const DisclaimerRoute = require('../../../../app/(settings)/disclaimer').default;
    const { getByTestId } = renderWithProviders(<DisclaimerRoute />);
    expect(getByTestId('disclaimer-screen')).toBeDefined();
  });
});
