/**
 * About Route Tests (P011 11.S.14)
 * Tests: src/app/(settings)/about.jsx renders AboutScreen
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
    AboutScreen: () =>
      React.createElement('div', { testID: 'about-screen', 'data-testid': 'about-screen' }, 'Mock AboutScreen'),
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

describe('app/(settings)/about.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render AboutScreen', () => {
    const AboutRoute = require('../../../../app/(settings)/about').default;
    const { getByTestId } = renderWithProviders(<AboutRoute />);
    expect(getByTestId('about-screen')).toBeDefined();
  });
});
