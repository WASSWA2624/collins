/**
 * HistoryScreen Component Tests
 * File: HistoryScreen.test.js (P011 11.S.5)
 * Tests: empty state, corrupted persistence recovery messaging, delete confirmation path
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default;

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

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
  useVentilationSession: jest.fn(),
}));

const HistoryScreenWeb = require('@platform/screens/ventilation/HistoryScreen/HistoryScreen.web').default;
const HistoryScreenAndroid = require('@platform/screens/ventilation/HistoryScreen/HistoryScreen.android').default;
const HistoryScreenIOS = require('@platform/screens/ventilation/HistoryScreen/HistoryScreen.ios').default;
const { useVentilationSession } = require('@hooks');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const HISTORY_TEST_IDS = {
  screen: 'history-screen',
  empty: 'history-empty',
  corruptBanner: 'history-corrupt-banner',
  errorBanner: 'history-error-banner',
  list: 'history-list',
  delete: 'history-delete',
  deleteConfirm: 'history-delete-confirm',
  deleteConfirmCancel: 'history-delete-confirm-cancel',
};

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
      ventilation: {
        sessionHistory: null,
        historyErrorCode: null,
        isHistoryLoading: false,
        ...initialState.ventilation,
      },
      ...initialState,
    },
  });

const renderWithProviders = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('HistoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useVentilationSession.mockReturnValue({
      sessionHistory: [],
      historyErrorCode: null,
      isHistoryLoading: false,
      loadHistory: jest.fn(),
      deleteFromHistory: jest.fn(),
      loadHistoryEntryIntoSession: jest.fn(),
    });
  });

  describe('empty state (no history)', () => {
    it('web: shows empty message when list is empty', () => {
      useVentilationSession.mockReturnValue({
        sessionHistory: [],
        historyErrorCode: null,
        isHistoryLoading: false,
        loadHistory: jest.fn(),
        deleteFromHistory: jest.fn(),
        loadHistoryEntryIntoSession: jest.fn(),
      });
      const { getByTestId, getByText } = renderWithProviders(<HistoryScreenWeb />);
      expect(getByTestId(HISTORY_TEST_IDS.empty)).toBeDefined();
      expect(getByText('No saved sessions yet.')).toBeDefined();
    });

    it('android: shows empty message when list is empty', () => {
      const { getByTestId, getByText } = renderWithProviders(<HistoryScreenAndroid />);
      expect(getByTestId(HISTORY_TEST_IDS.empty)).toBeDefined();
      expect(getByText('No saved sessions yet.')).toBeDefined();
    });

    it('ios: shows empty message when list is empty', () => {
      const { getByTestId, getByText } = renderWithProviders(<HistoryScreenIOS />);
      expect(getByTestId(HISTORY_TEST_IDS.empty)).toBeDefined();
      expect(getByText('No saved sessions yet.')).toBeDefined();
    });
  });

  describe('corrupted persistence recovery messaging', () => {
    it('web: shows corrupt recovery banner when historyErrorCode is VENTILATION_SESSION_HISTORY_CORRUPT', () => {
      useVentilationSession.mockReturnValue({
        sessionHistory: [],
        historyErrorCode: 'VENTILATION_SESSION_HISTORY_CORRUPT',
        isHistoryLoading: false,
        loadHistory: jest.fn(),
        deleteFromHistory: jest.fn(),
        loadHistoryEntryIntoSession: jest.fn(),
      });
      const { getByTestId, getByText } = renderWithProviders(<HistoryScreenWeb />);
      expect(getByTestId(HISTORY_TEST_IDS.corruptBanner)).toBeDefined();
      expect(
        getByText('Session history was reset due to a storage issue. You can start new sessions.')
      ).toBeDefined();
    });

    it('android: shows corrupt recovery banner', () => {
      useVentilationSession.mockReturnValue({
        sessionHistory: [],
        historyErrorCode: 'VENTILATION_SESSION_HISTORY_CORRUPT',
        isHistoryLoading: false,
        loadHistory: jest.fn(),
        deleteFromHistory: jest.fn(),
        loadHistoryEntryIntoSession: jest.fn(),
      });
      const { getByTestId } = renderWithProviders(<HistoryScreenAndroid />);
      expect(getByTestId(HISTORY_TEST_IDS.corruptBanner)).toBeDefined();
    });

    it('ios: shows corrupt recovery banner', () => {
      useVentilationSession.mockReturnValue({
        sessionHistory: [],
        historyErrorCode: 'VENTILATION_SESSION_HISTORY_CORRUPT',
        isHistoryLoading: false,
        loadHistory: jest.fn(),
        deleteFromHistory: jest.fn(),
        loadHistoryEntryIntoSession: jest.fn(),
      });
      const { getByTestId } = renderWithProviders(<HistoryScreenIOS />);
      expect(getByTestId(HISTORY_TEST_IDS.corruptBanner)).toBeDefined();
    });
  });

  describe('delete confirmation path', () => {
    const mockDeleteFromHistory = jest.fn();
    const mockLoadHistory = jest.fn();
    const sessionId = 'session-1';
    const oneEntry = {
      sessionId,
      inputs: { condition: 'ARDS' },
      recommendationSummary: { source: { confidenceTier: 'medium' } },
      updatedAt: Date.now(),
    };

    beforeEach(() => {
      mockDeleteFromHistory.mockClear();
      mockLoadHistory.mockClear();
    });

    it('web: pressing delete shows confirm modal; pressing confirm calls deleteFromHistory', () => {
      useVentilationSession.mockReturnValue({
        sessionHistory: [oneEntry],
        historyErrorCode: null,
        isHistoryLoading: false,
        loadHistory: mockLoadHistory,
        deleteFromHistory: mockDeleteFromHistory,
        loadHistoryEntryIntoSession: jest.fn(),
      });
      const { getByTestId, getByText, getAllByTestId } = renderWithProviders(<HistoryScreenWeb />);
      const deleteButtons = getAllByTestId(HISTORY_TEST_IDS.delete);
      expect(deleteButtons.length).toBeGreaterThan(0);
      fireEvent.press(deleteButtons[0]);
      expect(getByTestId(HISTORY_TEST_IDS.deleteConfirm)).toBeDefined();
      const confirmBtn = getByText('Delete');
      fireEvent.press(confirmBtn);
      expect(mockDeleteFromHistory).toHaveBeenCalledWith(sessionId);
    });

    it('web: delete confirm modal shows title and cancel/confirm buttons after pressing delete', () => {
      useVentilationSession.mockReturnValue({
        sessionHistory: [oneEntry],
        historyErrorCode: null,
        isHistoryLoading: false,
        loadHistory: mockLoadHistory,
        deleteFromHistory: mockDeleteFromHistory,
        loadHistoryEntryIntoSession: jest.fn(),
      });
      const { getByTestId, getByText, getAllByTestId } = renderWithProviders(<HistoryScreenWeb />);
      fireEvent.press(getAllByTestId(HISTORY_TEST_IDS.delete)[0]);
      expect(getByTestId(HISTORY_TEST_IDS.deleteConfirm)).toBeDefined();
      expect(getByText('Delete session?')).toBeDefined();
      expect(getByTestId(HISTORY_TEST_IDS.deleteConfirmCancel)).toBeDefined();
      expect(getByText('Cancel')).toBeDefined();
      expect(getByText('Delete')).toBeDefined();
    });

    it('android: delete confirm modal visible after pressing delete', () => {
      useVentilationSession.mockReturnValue({
        sessionHistory: [oneEntry],
        historyErrorCode: null,
        isHistoryLoading: false,
        loadHistory: mockLoadHistory,
        deleteFromHistory: mockDeleteFromHistory,
        loadHistoryEntryIntoSession: jest.fn(),
      });
      const { getByTestId, getAllByTestId } = renderWithProviders(<HistoryScreenAndroid />);
      const deleteBtn = getAllByTestId(HISTORY_TEST_IDS.delete)[0];
      if (deleteBtn) {
        fireEvent.press(deleteBtn);
        expect(getByTestId(HISTORY_TEST_IDS.deleteConfirm)).toBeDefined();
      }
    });

    it('ios: delete confirm modal visible after pressing delete', () => {
      useVentilationSession.mockReturnValue({
        sessionHistory: [oneEntry],
        historyErrorCode: null,
        isHistoryLoading: false,
        loadHistory: mockLoadHistory,
        deleteFromHistory: mockDeleteFromHistory,
        loadHistoryEntryIntoSession: jest.fn(),
      });
      const { getByTestId, getAllByTestId } = renderWithProviders(<HistoryScreenIOS />);
      const deleteBtn = getAllByTestId(HISTORY_TEST_IDS.delete)[0];
      if (deleteBtn) {
        fireEvent.press(deleteBtn);
        expect(getByTestId(HISTORY_TEST_IDS.deleteConfirm)).toBeDefined();
      }
    });
  });
});
