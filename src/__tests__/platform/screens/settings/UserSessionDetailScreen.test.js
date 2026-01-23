/**
 * UserSessionDetailScreen Component Tests
 * Per testing.mdc: render, loading, error, empty (not found), a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/UserSessionDetailScreen/useUserSessionDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserSessionDetailScreen = require('@platform/screens/settings/UserSessionDetailScreen/useUserSessionDetailScreen').default;
const UserSessionDetailScreenWeb = require('@platform/screens/settings/UserSessionDetailScreen/UserSessionDetailScreen.web').default;
const UserSessionDetailScreenAndroid = require('@platform/screens/settings/UserSessionDetailScreen/UserSessionDetailScreen.android').default;
const UserSessionDetailScreenIOS = require('@platform/screens/settings/UserSessionDetailScreen/UserSessionDetailScreen.ios').default;
const UserSessionDetailScreenIndex = require('@platform/screens/settings/UserSessionDetailScreen/index.js');
const { STATES } = require('@platform/screens/settings/UserSessionDetailScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'userSession.detail.title': 'Session Details',
    'userSession.detail.idLabel': 'Session ID',
    'userSession.detail.emailLabel': 'User',
    'userSession.detail.createdLabel': 'Created',
    'userSession.detail.expiresLabel': 'Expires',
    'userSession.detail.revokedLabel': 'Revoked',
    'userSession.detail.errorTitle': 'Failed to load session',
    'userSession.detail.notFoundTitle': 'Session not found',
    'userSession.detail.notFoundMessage': 'This session may have been revoked or expired.',
    'userSession.detail.backHint': 'Return to sessions list',
    'userSession.detail.revoke': 'Revoke session',
    'userSession.detail.revokeHint': 'Revoke this session',
    'common.loading': 'Loading',
    'common.retry': 'Retry',
    'common.back': 'Back',
    'common.remove': 'Remove',
  };
  return m[key] || key;
};

const baseHook = {
  id: 's1',
  session: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onRevoke: jest.fn(),
};

describe('UserSessionDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useUserSessionDetailScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);
      expect(getByTestId('user-session-detail-not-found')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      useUserSessionDetailScreen.mockReturnValue({ ...baseHook, session: null });
      const { getByTestId } = renderWithTheme(<UserSessionDetailScreenAndroid />);
      expect(getByTestId('user-session-detail-not-found')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      useUserSessionDetailScreen.mockReturnValue({ ...baseHook, session: null });
      const { getByTestId } = renderWithTheme(<UserSessionDetailScreenIOS />);
      expect(getByTestId('user-session-detail-not-found')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useUserSessionDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);
      expect(getByTestId('user-session-detail-loading')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useUserSessionDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Network error',
      });
      const { getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);
      expect(getByTestId('user-session-detail-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useUserSessionDetailScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);
      expect(getByTestId('user-session-detail-offline')).toBeTruthy();
    });
  });

  describe('session ready', () => {
    it('renders session details (Web)', () => {
      useUserSessionDetailScreen.mockReturnValue({
        ...baseHook,
        session: {
          id: 's1',
          user: { email: 'u@x.com' },
          created_at: '2025-01-01T00:00:00Z',
          expires_at: '2025-02-01T00:00:00Z',
          revoked_at: null,
        },
      });
      const { getByTestId } = renderWithTheme(<UserSessionDetailScreenWeb />);
      expect(getByTestId('user-session-detail-title')).toBeTruthy();
      expect(getByTestId('user-session-detail-id')).toBeTruthy();
      expect(getByTestId('user-session-detail-revoke')).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(UserSessionDetailScreenIndex.default).toBeDefined();
      expect(UserSessionDetailScreenIndex.useUserSessionDetailScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.READY).toBe('ready');
    });
  });
});
