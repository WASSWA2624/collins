/**
 * Topic List Route Tests (P011 11.S.8)
 * Tests: src/app/(training)/topics.jsx renders TopicListScreen
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
    TopicListScreen: () =>
      React.createElement('div', { testID: 'topic-list-screen', 'data-testid': 'topic-list-screen' }, 'Mock TopicListScreen'),
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

describe('app/(training)/topics.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render TopicListScreen', () => {
    const TopicListRoute = require('../../../../app/(training)/topics').default;
    const { getByTestId } = renderWithProviders(<TopicListRoute />);
    expect(getByTestId('topic-list-screen')).toBeDefined();
  });
});
