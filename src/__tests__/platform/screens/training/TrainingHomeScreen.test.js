/**
 * TrainingHomeScreen Tests (P011 11.S.7)
 * Tests: loading, empty, error, content render
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush, replace: jest.fn() }) }));

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
jest.mock('@hooks/useTrainingContent', () => jest.fn());

const TrainingHomeScreenWeb = require('@platform/screens/training/TrainingHomeScreen/TrainingHomeScreen.web').default;
const TrainingHomeScreenAndroid = require('@platform/screens/training/TrainingHomeScreen/TrainingHomeScreen.android').default;
const TrainingHomeScreenIOS = require('@platform/screens/training/TrainingHomeScreen/TrainingHomeScreen.ios').default;
const useTrainingContent = require('@hooks/useTrainingContent').default;

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const TRAINING_HOME_TEST_IDS = {
  screen: 'training-home-screen',
  empty: 'training-home-empty',
  errorBanner: 'training-home-error-banner',
  browseAll: 'training-home-browse-all',
};

const defaultHookReturn = {
  popularTopics: [],
  quickChecklists: [],
  loadError: null,
  isLoading: false,
  isEmpty: true,
  searchQuery: '',
  setSearchQuery: jest.fn(),
  searchResults: [],
  search: jest.fn(),
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

describe('TrainingHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTrainingContent.mockReturnValue(defaultHookReturn);
  });

  describe('loading state', () => {
    it('web: shows loading text when isLoading', () => {
      useTrainingContent.mockReturnValue({ ...defaultHookReturn, isLoading: true });
      const { getByTestId, getByText } = renderWithProviders(<TrainingHomeScreenWeb />);
      expect(getByTestId(TRAINING_HOME_TEST_IDS.screen)).toBeDefined();
      expect(getByText('Loading training…')).toBeDefined();
    });

    it('android: shows loading text when isLoading', () => {
      useTrainingContent.mockReturnValue({ ...defaultHookReturn, isLoading: true });
      const { getByTestId, getByText } = renderWithProviders(<TrainingHomeScreenAndroid />);
      expect(getByTestId(TRAINING_HOME_TEST_IDS.screen)).toBeDefined();
      expect(getByText('Loading training…')).toBeDefined();
    });

    it('ios: shows loading text when isLoading', () => {
      useTrainingContent.mockReturnValue({ ...defaultHookReturn, isLoading: true });
      const { getByTestId, getByText } = renderWithProviders(<TrainingHomeScreenIOS />);
      expect(getByTestId(TRAINING_HOME_TEST_IDS.screen)).toBeDefined();
      expect(getByText('Loading training…')).toBeDefined();
    });
  });

  describe('empty state', () => {
    it('web: shows empty message when isEmpty', () => {
      const { getByTestId, getByText } = renderWithProviders(<TrainingHomeScreenWeb />);
      expect(getByTestId(TRAINING_HOME_TEST_IDS.empty)).toBeDefined();
      expect(getByText('No training content available')).toBeDefined();
    });

    it('android: shows empty message when isEmpty', () => {
      const { getByTestId, getByText } = renderWithProviders(<TrainingHomeScreenAndroid />);
      expect(getByTestId(TRAINING_HOME_TEST_IDS.empty)).toBeDefined();
      expect(getByText('No training content available')).toBeDefined();
    });

    it('ios: shows empty message when isEmpty', () => {
      const { getByTestId, getByText } = renderWithProviders(<TrainingHomeScreenIOS />);
      expect(getByTestId(TRAINING_HOME_TEST_IDS.empty)).toBeDefined();
      expect(getByText('No training content available')).toBeDefined();
    });
  });

  describe('error state', () => {
    it('web: shows error banner when loadError', () => {
      useTrainingContent.mockReturnValue({ ...defaultHookReturn, loadError: 'TRAINING_LOAD_ERROR' });
      const { getByTestId, getByText } = renderWithProviders(<TrainingHomeScreenWeb />);
      expect(getByTestId(TRAINING_HOME_TEST_IDS.errorBanner)).toBeDefined();
      expect(getByText('Unable to load training content')).toBeDefined();
    });

    it('android: shows error banner when loadError', () => {
      useTrainingContent.mockReturnValue({ ...defaultHookReturn, loadError: 'TRAINING_LOAD_ERROR' });
      const { getByTestId } = renderWithProviders(<TrainingHomeScreenAndroid />);
      expect(getByTestId(TRAINING_HOME_TEST_IDS.errorBanner)).toBeDefined();
    });

    it('ios: shows error banner when loadError', () => {
      useTrainingContent.mockReturnValue({ ...defaultHookReturn, loadError: 'TRAINING_LOAD_ERROR' });
      const { getByTestId } = renderWithProviders(<TrainingHomeScreenIOS />);
      expect(getByTestId(TRAINING_HOME_TEST_IDS.errorBanner)).toBeDefined();
    });
  });

  describe('content render', () => {
    it('web: shows browse all button when not empty', () => {
      useTrainingContent.mockReturnValue({
        ...defaultHookReturn,
        isEmpty: false,
        popularTopics: [{ type: 'protocol', id: 'p1', title: 'Intro' }],
      });
      const { getByTestId } = renderWithProviders(<TrainingHomeScreenWeb />);
      expect(getByTestId(TRAINING_HOME_TEST_IDS.browseAll)).toBeDefined();
    });

    it('android: shows browse all when not empty', () => {
      useTrainingContent.mockReturnValue({
        ...defaultHookReturn,
        isEmpty: false,
        popularTopics: [{ type: 'protocol', id: 'p1', title: 'Intro' }],
      });
      const { getByTestId } = renderWithProviders(<TrainingHomeScreenAndroid />);
      expect(getByTestId(TRAINING_HOME_TEST_IDS.browseAll)).toBeDefined();
    });

    it('ios: shows browse all when not empty', () => {
      useTrainingContent.mockReturnValue({
        ...defaultHookReturn,
        isEmpty: false,
        popularTopics: [{ type: 'protocol', id: 'p1', title: 'Intro' }],
      });
      const { getByTestId } = renderWithProviders(<TrainingHomeScreenIOS />);
      expect(getByTestId(TRAINING_HOME_TEST_IDS.browseAll)).toBeDefined();
    });
  });
});
