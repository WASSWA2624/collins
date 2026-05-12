/**
 * Legacy disclaimer route migration tests.
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

jest.mock('expo-router', () => {
  const React = require('react');
  const { Text, View } = require('react-native');
  return {
    Redirect: ({ href }) =>
      React.createElement(View, { testID: 'redirect', href }, React.createElement(Text, null, 'Redirect')),
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

  it('redirects old disclaimer links to onboarding', () => {
    const DisclaimerRoute = require('../../../app/(settings)/disclaimer').default;
    const { getByTestId } = renderWithProviders(<DisclaimerRoute />);
    expect(getByTestId('redirect')).toBeDefined();
    expect(getByTestId('redirect').props.href).toBe('/onboarding');
  });
});
