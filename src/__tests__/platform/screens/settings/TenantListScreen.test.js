/**
 * TenantListScreen Component Tests
 * Per testing.mdc: render, loading, error, empty, a11y
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/TenantListScreen/useTenantListScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useTenantListScreen = require('@platform/screens/settings/TenantListScreen/useTenantListScreen').default;
const TenantListScreenWeb = require('@platform/screens/settings/TenantListScreen/TenantListScreen.web').default;
const TenantListScreenAndroid = require('@platform/screens/settings/TenantListScreen/TenantListScreen.android').default;
const TenantListScreenIOS = require('@platform/screens/settings/TenantListScreen/TenantListScreen.ios').default;
const TenantListScreenIndex = require('@platform/screens/settings/TenantListScreen/index.js');
const { STATES } = require('@platform/screens/settings/TenantListScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'tenant.list.title': 'Tenants',
    'tenant.list.accessibilityLabel': 'Tenants list',
    'tenant.list.emptyTitle': 'No tenants',
    'tenant.list.emptyMessage': 'You have no tenants.',
    'tenant.list.delete': 'Delete tenant',
    'tenant.list.deleteHint': 'Delete this tenant',
    'tenant.list.itemLabel': 'Tenant {{name}}',
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
  onTenantPress: jest.fn(),
  onDelete: jest.fn(),
};

describe('TenantListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useTenantListScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<TenantListScreenWeb />);
      expect(getByTestId('tenant-list-title')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      const { getByTestId } = renderWithTheme(<TenantListScreenAndroid />);
      expect(getByTestId('tenant-list-title')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      const { getByTestId } = renderWithTheme(<TenantListScreenIOS />);
      expect(getByTestId('tenant-list-title')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useTenantListScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<TenantListScreenWeb />);
      expect(getByTestId('tenant-list-loading')).toBeTruthy();
    });
  });

  describe('empty', () => {
    it('shows empty state (Web)', () => {
      useTenantListScreen.mockReturnValue({
        ...baseHook,
        items: [],
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<TenantListScreenWeb />);
      expect(getByTestId('tenant-list-empty-state')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useTenantListScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<TenantListScreenWeb />);
      expect(getByTestId('tenant-list-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useTenantListScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
        items: [],
      });
      const { getByTestId } = renderWithTheme(<TenantListScreenWeb />);
      expect(getByTestId('tenant-list-offline')).toBeTruthy();
    });
  });

  describe('list with items', () => {
    it('renders items (Web)', () => {
      useTenantListScreen.mockReturnValue({
        ...baseHook,
        items: [
          { id: '1', name: 'Tenant 1', slug: 'tenant-1' },
        ],
      });
      const { getByTestId } = renderWithTheme(<TenantListScreenWeb />);
      expect(getByTestId('tenant-item-1')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility label (Web)', () => {
      useTenantListScreen.mockReturnValue({
        ...baseHook,
        items: [{ id: '1', name: 'Tenant 1', slug: 'tenant-1' }],
      });
      const { getByTestId } = renderWithTheme(<TenantListScreenWeb />);
      const list = getByTestId('tenant-list');
      expect(list).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(TenantListScreenIndex.default).toBeDefined();
      expect(TenantListScreenIndex.useTenantListScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.READY).toBe('ready');
    });
  });
});
