/**
 * UserSessionListScreen Component Tests
 * Per testing.mdc: render, loading, error, empty, a11y
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/UserSessionListScreen/useUserSessionListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserSessionListScreen = require('@platform/screens/settings/UserSessionListScreen/useUserSessionListScreen').default;
const UserSessionListScreenWeb = require('@platform/screens/settings/UserSessionListScreen/UserSessionListScreen.web').default;
const UserSessionListScreenAndroid = require('@platform/screens/settings/UserSessionListScreen/UserSessionListScreen.android').default;
const UserSessionListScreenIOS = require('@platform/screens/settings/UserSessionListScreen/UserSessionListScreen.ios').default;
const UserSessionListScreenIndex = require('@platform/screens/settings/UserSessionListScreen/index.js');
const { STATES } = require('@platform/screens/settings/UserSessionListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'userSession.list.title': 'User Sessions',
    'userSession.list.accessibilityLabel': 'User sessions list',
    'userSession.list.emptyTitle': 'No sessions',
    'userSession.list.emptyMessage': 'You have no active sessions.',
    'userSession.list.revoke': 'Revoke session',
    'userSession.list.revokeHint': 'Revoke this session',
    'userSession.list.itemLabel': 'Session for {{email}}',
    'common.remove': 'Remove',
    'listScaffold.loading': 'Loading',
    'listScaffold.empty': 'Empty',
    'listScaffold.error': 'Error',
    'listScaffold.offline': 'Offline',
    'common.retry': 'Retry',
  };
  return m[key] || key;
};

const baseHook = {
  items: [],
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onSessionPress: jest.fn(),
  onRevoke: jest.fn(),
};

describe('UserSessionListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useUserSessionListScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<UserSessionListScreenWeb />);
      expect(getByTestId('user-session-list-title')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<UserSessionListScreenAndroid />);
      expect(getByTestId('user-session-list-title')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<UserSessionListScreenIOS />);
      expect(getByTestId('user-session-list-title')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useUserSessionListScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<UserSessionListScreenWeb />);
      expect(getByTestId('user-session-list-loading')).toBeTruthy();
    });
  });

  describe('empty', () => {
    it('shows empty state (Web)', () => {
      useUserSessionListScreen.mockReturnValue({
        ...baseHook,
        items: [],
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<UserSessionListScreenWeb />);
      expect(getByTestId('user-session-list-empty-state')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useUserSessionListScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<UserSessionListScreenWeb />);
      expect(getByTestId('user-session-list-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useUserSessionListScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
        items: [],
      });
      const { getByTestId } = renderWithTheme(<UserSessionListScreenWeb />);
      expect(getByTestId('user-session-list-offline')).toBeTruthy();
    });
  });

  describe('list with items', () => {
    it('renders items (Web)', () => {
      useUserSessionListScreen.mockReturnValue({
        ...baseHook,
        items: [
          { id: '1', user: { email: 'a@b.com' }, created_at: '2025-01-01T00:00:00Z' },
        ],
      });
      const { getByTestId } = renderWithTheme(<UserSessionListScreenWeb />);
      expect(getByTestId('user-session-item-1')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility label (Web)', () => {
      useUserSessionListScreen.mockReturnValue({
        ...baseHook,
        items: [{ id: '1', user: { email: 'a@b.com' }, created_at: '2025-01-01T00:00:00Z' }],
      });
      const { getByTestId } = renderWithTheme(<UserSessionListScreenWeb />);
      const list = getByTestId('user-session-list');
      expect(list).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(UserSessionListScreenIndex.default).toBeDefined();
      expect(UserSessionListScreenIndex.useUserSessionListScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.READY).toBe('ready');
    });
  });
});
