/**
 * TopicDetailScreen Tests (P011 11.S.9)
 * Tests: loading, notFound, error, content render with collapsible sections
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
}));

jest.mock('@platform/screens/training/TopicDetailScreen/useTopicDetailScreen', () => jest.fn());

const TopicDetailScreenWeb = require('@platform/screens/training/TopicDetailScreen/TopicDetailScreen.web').default;
const TopicDetailScreenAndroid = require('@platform/screens/training/TopicDetailScreen/TopicDetailScreen.android').default;
const TopicDetailScreenIOS = require('@platform/screens/training/TopicDetailScreen/TopicDetailScreen.ios').default;
const useTopicDetailScreen = require('@platform/screens/training/TopicDetailScreen/useTopicDetailScreen').default;

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const TOPIC_DETAIL_TEST_IDS = {
  screen: 'topic-detail-screen',
  notFound: 'topic-detail-not-found',
  backButton: 'topic-detail-back',
  errorBanner: 'topic-detail-error-banner',
  title: 'topic-detail-title',
};

const defaultHookReturn = {
  topic: null,
  loadError: null,
  isLoading: false,
  notFound: false,
  sections: [],
  expandedSections: new Set(['main', 'checklist']),
  toggleSection: jest.fn(),
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

describe('TopicDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTopicDetailScreen.mockReturnValue(defaultHookReturn);
  });

  describe('loading state', () => {
    it('web: shows loading when isLoading', () => {
      useTopicDetailScreen.mockReturnValue({ ...defaultHookReturn, isLoading: true });
      const { getByTestId, getByText } = renderWithProviders(<TopicDetailScreenWeb topicId="p1" />);
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.screen)).toBeDefined();
      expect(getByText('Loading topic…')).toBeDefined();
    });

    it('android: shows loading when isLoading', () => {
      useTopicDetailScreen.mockReturnValue({ ...defaultHookReturn, isLoading: true });
      const { getByTestId, getByText } = renderWithProviders(<TopicDetailScreenAndroid topicId="p1" />);
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.screen)).toBeDefined();
      expect(getByText('Loading topic…')).toBeDefined();
    });

    it('ios: shows loading when isLoading', () => {
      useTopicDetailScreen.mockReturnValue({ ...defaultHookReturn, isLoading: true });
      const { getByTestId, getByText } = renderWithProviders(<TopicDetailScreenIOS topicId="p1" />);
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.screen)).toBeDefined();
      expect(getByText('Loading topic…')).toBeDefined();
    });
  });

  describe('notFound path', () => {
    it('web: shows notFound and back button when notFound', () => {
      useTopicDetailScreen.mockReturnValue({ ...defaultHookReturn, notFound: true });
      const { getByTestId, getByText } = renderWithProviders(<TopicDetailScreenWeb topicId="unknown" />);
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.notFound)).toBeDefined();
      expect(getByText('Topic not found.')).toBeDefined();
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.backButton)).toBeDefined();
    });

    it('android: shows notFound when notFound', () => {
      useTopicDetailScreen.mockReturnValue({ ...defaultHookReturn, notFound: true });
      const { getByTestId, getByText } = renderWithProviders(<TopicDetailScreenAndroid topicId="unknown" />);
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.notFound)).toBeDefined();
      expect(getByText('Topic not found.')).toBeDefined();
    });

    it('ios: shows notFound when notFound', () => {
      useTopicDetailScreen.mockReturnValue({ ...defaultHookReturn, notFound: true });
      const { getByTestId, getByText } = renderWithProviders(<TopicDetailScreenIOS topicId="unknown" />);
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.notFound)).toBeDefined();
      expect(getByText('Topic not found.')).toBeDefined();
    });
  });

  describe('error state', () => {
    it('web: shows error banner when loadError and topic exists', () => {
      useTopicDetailScreen.mockReturnValue({
        ...defaultHookReturn,
        topic: { id: 'p1', title: 'Intro', body: 'Content' },
        loadError: 'ERR',
      });
      const { getByTestId, getByText } = renderWithProviders(<TopicDetailScreenWeb topicId="p1" />);
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.errorBanner)).toBeDefined();
      expect(getByText('Unable to load topic')).toBeDefined();
    });

    it('android: shows error banner when loadError and topic exists', () => {
      useTopicDetailScreen.mockReturnValue({
        ...defaultHookReturn,
        topic: { id: 'p1', title: 'Intro', body: 'Content' },
        loadError: 'ERR',
      });
      const { getByTestId } = renderWithProviders(<TopicDetailScreenAndroid topicId="p1" />);
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.errorBanner)).toBeDefined();
    });
  });

  describe('content render', () => {
    it('web: shows title and back button when topic exists', () => {
      useTopicDetailScreen.mockReturnValue({
        ...defaultHookReturn,
        topic: { id: 'p1', title: 'Introduction', body: 'Body text' },
        sections: [{ key: 'main', title: null, content: 'Body text' }],
      });
      const { getByTestId, getByText } = renderWithProviders(<TopicDetailScreenWeb topicId="p1" />);
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.title)).toBeDefined();
      expect(getByText('Introduction')).toBeDefined();
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.backButton)).toBeDefined();
    });

    it('android: shows title when topic exists', () => {
      useTopicDetailScreen.mockReturnValue({
        ...defaultHookReturn,
        topic: { id: 'p1', title: 'Introduction', body: 'Body text' },
        sections: [{ key: 'main', title: null, content: 'Body text' }],
      });
      const { getByTestId, getByText } = renderWithProviders(<TopicDetailScreenAndroid topicId="p1" />);
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.title)).toBeDefined();
      expect(getByText('Introduction')).toBeDefined();
    });

    it('ios: shows title when topic exists', () => {
      useTopicDetailScreen.mockReturnValue({
        ...defaultHookReturn,
        topic: { id: 'p1', title: 'Introduction', body: 'Body text' },
        sections: [{ key: 'main', title: null, content: 'Body text' }],
      });
      const { getByTestId, getByText } = renderWithProviders(<TopicDetailScreenIOS topicId="p1" />);
      expect(getByTestId(TOPIC_DETAIL_TEST_IDS.title)).toBeDefined();
      expect(getByText('Introduction')).toBeDefined();
    });
  });
});
