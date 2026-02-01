/**
 * Training Home Route Tests (P011 11.S.7)
 * Tests: src/app/(training)/index.jsx renders TrainingHomeScreen
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
    TrainingHomeScreen: () =>
      React.createElement('div', { testID: 'training-home-screen', 'data-testid': 'training-home-screen' }, 'Mock TrainingHomeScreen'),
  };
});

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      ...initialState,
    },
  });

const renderWithProviders = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('app/(training)/index.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render TrainingHomeScreen', () => {
    const TrainingHomeRoute = require('../../../../app/(training)/index').default;
    const { getByTestId } = renderWithProviders(<TrainingHomeRoute />);
    expect(getByTestId('training-home-screen')).toBeDefined();
  });
});
