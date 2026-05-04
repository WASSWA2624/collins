/**
 * TopicListScreen Tests (P011 11.S.8)
 * Tests: loading, empty, error, list render
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn(), replace: jest.fn() }) }));

jest.mock('@hooks', () => ({
  useI18n: () => {
    const mockEn = require('@i18n/locales/en.json');
    return {
      t: (key, params) => {
        const keys = key.split('.');
        let v = mockEn;
        for (const k of keys) {
          v = v?.[k];
          if (v === undefined) return key;
        }
        if (typeof v === 'string' && params) {
          return Object.entries(params).reduce((s, [k, val]) => s.replace(`{{${k}}}`, String(val)), v);
        }
        return v || key;
      },
      locale: 'en',
    };
  },
  useTrainingContent: jest.fn(),
}));

jest.mock('@platform/screens/training/TopicListScreen/useTopicListScreen', () => jest.fn());

const TopicListScreenWeb = require('@platform/screens/training/TopicListScreen/TopicListScreen.web').default;
const TopicListScreenAndroid = require('@platform/screens/training/TopicListScreen/TopicListScreen.android').default;
const TopicListScreenIOS = require('@platform/screens/training/TopicListScreen/TopicListScreen.ios').default;
const useTopicListScreen = require('@platform/screens/training/TopicListScreen/useTopicListScreen').default;

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const TOPIC_LIST_TEST_IDS = {
  screen: 'topic-list-screen',
  empty: 'topic-list-empty',
  errorBanner: 'topic-list-error-banner',
  list: 'topic-list',
};

const defaultHookReturn = {
  topics: [],
  loadError: null,
  isLoading: false,
  isEmpty: true,
  searchQuery: '',
  setSearchQuery: jest.fn(),
};

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

describe('TopicListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTopicListScreen.mockReturnValue(defaultHookReturn);
  });

  describe('loading state', () => {
    it('web: shows loading text when isLoading', () => {
      useTopicListScreen.mockReturnValue({ ...defaultHookReturn, isLoading: true });
      const { getByTestId, getByText } = renderWithProviders(<TopicListScreenWeb />);
      expect(getByTestId(TOPIC_LIST_TEST_IDS.screen)).toBeDefined();
      expect(getByText('Loading topics…')).toBeDefined();
    });

    it('android: shows loading when isLoading', () => {
      useTopicListScreen.mockReturnValue({ ...defaultHookReturn, isLoading: true });
      const { getByTestId, getByText } = renderWithProviders(<TopicListScreenAndroid />);
      expect(getByTestId(TOPIC_LIST_TEST_IDS.screen)).toBeDefined();
      expect(getByText('Loading topics…')).toBeDefined();
    });

    it('ios: shows loading when isLoading', () => {
      useTopicListScreen.mockReturnValue({ ...defaultHookReturn, isLoading: true });
      const { getByTestId, getByText } = renderWithProviders(<TopicListScreenIOS />);
      expect(getByTestId(TOPIC_LIST_TEST_IDS.screen)).toBeDefined();
      expect(getByText('Loading topics…')).toBeDefined();
    });
  });

  describe('empty state', () => {
    it('web: shows empty message when isEmpty', () => {
      const { getByTestId, getByText } = renderWithProviders(<TopicListScreenWeb />);
      expect(getByTestId(TOPIC_LIST_TEST_IDS.empty)).toBeDefined();
      expect(getByText('No topics found.')).toBeDefined();
    });

    it('android: shows empty when isEmpty', () => {
      const { getByTestId, getByText } = renderWithProviders(<TopicListScreenAndroid />);
      expect(getByTestId(TOPIC_LIST_TEST_IDS.empty)).toBeDefined();
      expect(getByText('No topics found.')).toBeDefined();
    });

    it('ios: shows empty when isEmpty', () => {
      const { getByTestId, getByText } = renderWithProviders(<TopicListScreenIOS />);
      expect(getByTestId(TOPIC_LIST_TEST_IDS.empty)).toBeDefined();
      expect(getByText('No topics found.')).toBeDefined();
    });
  });

  describe('error state', () => {
    it('web: shows error banner when loadError', () => {
      useTopicListScreen.mockReturnValue({ ...defaultHookReturn, loadError: 'ERR' });
      const { getByTestId, getByText } = renderWithProviders(<TopicListScreenWeb />);
      expect(getByTestId(TOPIC_LIST_TEST_IDS.errorBanner)).toBeDefined();
      expect(getByText('Unable to load topics')).toBeDefined();
    });

    it('android: shows error banner when loadError', () => {
      useTopicListScreen.mockReturnValue({ ...defaultHookReturn, loadError: 'ERR' });
      const { getByTestId } = renderWithProviders(<TopicListScreenAndroid />);
      expect(getByTestId(TOPIC_LIST_TEST_IDS.errorBanner)).toBeDefined();
    });

    it('ios: shows error banner when loadError', () => {
      useTopicListScreen.mockReturnValue({ ...defaultHookReturn, loadError: 'ERR' });
      const { getByTestId } = renderWithProviders(<TopicListScreenIOS />);
      expect(getByTestId(TOPIC_LIST_TEST_IDS.errorBanner)).toBeDefined();
    });
  });

  describe('list render', () => {
    it('web: shows list when topics exist', () => {
      useTopicListScreen.mockReturnValue({
        ...defaultHookReturn,
        isEmpty: false,
        topics: [{ type: 'protocol', id: 'p1', title: 'Intro' }],
      });
      const { getByTestId } = renderWithProviders(<TopicListScreenWeb />);
      expect(getByTestId(TOPIC_LIST_TEST_IDS.list)).toBeDefined();
    });

    it('android: shows list when topics exist', () => {
      useTopicListScreen.mockReturnValue({
        ...defaultHookReturn,
        isEmpty: false,
        topics: [{ type: 'protocol', id: 'p1', title: 'Intro' }],
      });
      const { getByTestId } = renderWithProviders(<TopicListScreenAndroid />);
      expect(getByTestId(TOPIC_LIST_TEST_IDS.list)).toBeDefined();
    });

    it('ios: shows list when topics exist', () => {
      useTopicListScreen.mockReturnValue({
        ...defaultHookReturn,
        isEmpty: false,
        topics: [{ type: 'protocol', id: 'p1', title: 'Intro' }],
      });
      const { getByTestId } = renderWithProviders(<TopicListScreenIOS />);
      expect(getByTestId(TOPIC_LIST_TEST_IDS.list)).toBeDefined();
    });
  });
});
