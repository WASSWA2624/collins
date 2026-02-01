/**
 * Assessment Route Tests
 * File: assessment.test.js
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
    AssessmentScreen: () => React.createElement('div', { testID: 'assessment-screen', 'data-testid': 'assessment-screen' }, 'Mock AssessmentScreen'),
  };
});

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      ventilation: { currentSessionId: null, currentInputs: null, isHydrating: false },
      ...initialState,
    },
  });

const renderWithProviders = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('app/(main)/assessment.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render AssessmentScreen', () => {
    const AssessmentRoute = require('../../../app/(main)/assessment').default;
    const { getByTestId } = renderWithProviders(<AssessmentRoute />);
    expect(getByTestId('assessment-screen')).toBeDefined();
  });
});
