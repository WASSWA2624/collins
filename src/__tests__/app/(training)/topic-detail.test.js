/**
 * Topic Detail Route Tests (P011 11.S.9)
 * Tests: param parsing, missing topic-id, passes topicId to TopicDetailScreen
 */
const React = require('react');
const { render, screen } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

const mockUseLocalSearchParams = jest.fn(() => ({}));
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('@platform/screens', () => {
  const React = require('react');
  return {
    TopicDetailScreen: (props) =>
      React.createElement('div', {
        'data-testid': 'topic-detail-screen',
        'data-topic-id': props.topicId ?? '',
      }, 'TopicDetailScreen'),
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

describe('app/(training)/topic/[topic-id].jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({});
  });

  it('passes topic-id param to TopicDetailScreen (param parsing)', () => {
    mockUseLocalSearchParams.mockReturnValue({ 'topic-id': 'protocol.intro' });
    const TopicDetailRoute = require('../../../../app/(training)/topic/[topic-id]').default;
    renderWithProviders(<TopicDetailRoute />);
    const el = screen.getByTestId('topic-detail-screen');
    expect(el).toBeDefined();
    expect(el.props['data-topic-id']).toBe('protocol.intro');
  });

  it('passes undefined topicId when topic-id is missing (missing topic-id path)', () => {
    mockUseLocalSearchParams.mockReturnValue({});
    const TopicDetailRoute = require('../../../../app/(training)/topic/[topic-id]').default;
    renderWithProviders(<TopicDetailRoute />);
    const el = screen.getByTestId('topic-detail-screen');
    expect(el).toBeDefined();
    expect(el.props['data-topic-id']).toBe('');
  });
});
