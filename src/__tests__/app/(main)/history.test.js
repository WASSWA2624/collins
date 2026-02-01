/**
 * History Route Tests
 * File: history.test.js - tests src/app/(main)/history.jsx (P011 11.S.5)
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
    HistoryScreen: () =>
      React.createElement('div', { testID: 'history-screen', 'data-testid': 'history-screen' }, 'Mock HistoryScreen'),
  };
});

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      ventilation: { sessionHistory: null, historyErrorCode: null, isHistoryLoading: false },
      ...initialState,
    },
  });

const renderWithProviders = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('app/(main)/history.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render HistoryScreen', () => {
    const HistoryRoute = require('../../../../app/(main)/history').default;
    const { getByTestId } = renderWithProviders(<HistoryRoute />);
    expect(getByTestId('history-screen')).toBeDefined();
  });
});
