/**
 * TenantDetailScreen Component Tests
 * Per testing.mdc: render, loading, error, empty (not found), a11y
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/TenantDetailScreen/useTenantDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useTenantDetailScreen = require('@platform/screens/settings/TenantDetailScreen/useTenantDetailScreen').default;
const TenantDetailScreenWeb = require('@platform/screens/settings/TenantDetailScreen/TenantDetailScreen.web').default;
const TenantDetailScreenAndroid = require('@platform/screens/settings/TenantDetailScreen/TenantDetailScreen.android').default;
const TenantDetailScreenIOS = require('@platform/screens/settings/TenantDetailScreen/TenantDetailScreen.ios').default;
const TenantDetailScreenIndex = require('@platform/screens/settings/TenantDetailScreen/index.js');
const { STATES } = require('@platform/screens/settings/TenantDetailScreen/types.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (c) => render(<ThemeProvider theme={lightTheme}>{c}</ThemeProvider>);

const mockT = (key) => {
  const m = {
    'tenant.detail.title': 'Tenant Details',
    'tenant.detail.idLabel': 'Tenant ID',
    'tenant.detail.nameLabel': 'Name',
    'tenant.detail.slugLabel': 'Slug',
    'tenant.detail.activeLabel': 'Active',
    'tenant.detail.createdLabel': 'Created',
    'tenant.detail.updatedLabel': 'Updated',
    'tenant.detail.errorTitle': 'Failed to load tenant',
    'tenant.detail.notFoundTitle': 'Tenant not found',
    'tenant.detail.notFoundMessage': 'This tenant may have been deleted.',
    'tenant.detail.backHint': 'Return to tenants list',
    'tenant.detail.delete': 'Delete tenant',
    'tenant.detail.deleteHint': 'Delete this tenant',
    'common.loading': 'Loading',
    'common.retry': 'Retry',
    'common.back': 'Back',
    'common.remove': 'Remove',
    'common.on': 'On',
    'common.off': 'Off',
  };
  return m[key] || key;
};

const baseHook = {
  id: 't1',
  tenant: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onDelete: jest.fn(),
};

describe('TenantDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useTenantDetailScreen.mockReturnValue({ ...baseHook });
  });

  describe('render', () => {
    it('renders without error (Web)', () => {
      const { getByTestId } = renderWithTheme(<TenantDetailScreenWeb />);
      expect(getByTestId('tenant-detail-not-found')).toBeTruthy();
    });

    it('renders without error (Android)', () => {
      useTenantDetailScreen.mockReturnValue({ ...baseHook, tenant: null });
      const { getByTestId } = renderWithTheme(<TenantDetailScreenAndroid />);
      expect(getByTestId('tenant-detail-not-found')).toBeTruthy();
    });

    it('renders without error (iOS)', () => {
      useTenantDetailScreen.mockReturnValue({ ...baseHook, tenant: null });
      const { getByTestId } = renderWithTheme(<TenantDetailScreenIOS />);
      expect(getByTestId('tenant-detail-not-found')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('shows loading state (Web)', () => {
      useTenantDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
      const { getByTestId } = renderWithTheme(<TenantDetailScreenWeb />);
      expect(getByTestId('tenant-detail-loading')).toBeTruthy();
    });
  });

  describe('error', () => {
    it('shows error state (Web)', () => {
      useTenantDetailScreen.mockReturnValue({
        ...baseHook,
        hasError: true,
        errorMessage: 'Something went wrong',
      });
      const { getByTestId } = renderWithTheme(<TenantDetailScreenWeb />);
      expect(getByTestId('tenant-detail-error')).toBeTruthy();
    });
  });

  describe('offline', () => {
    it('shows offline state (Web)', () => {
      useTenantDetailScreen.mockReturnValue({
        ...baseHook,
        isLoading: false,
        hasError: false,
        isOffline: true,
      });
      const { getByTestId } = renderWithTheme(<TenantDetailScreenWeb />);
      expect(getByTestId('tenant-detail-offline')).toBeTruthy();
    });
  });

  describe('not found', () => {
    it('shows not found state (Web)', () => {
      useTenantDetailScreen.mockReturnValue({
        ...baseHook,
        tenant: null,
        isLoading: false,
        hasError: false,
        isOffline: false,
      });
      const { getByTestId } = renderWithTheme(<TenantDetailScreenWeb />);
      expect(getByTestId('tenant-detail-not-found')).toBeTruthy();
    });
  });

  describe('with tenant data', () => {
    it('renders tenant details (Web)', () => {
      useTenantDetailScreen.mockReturnValue({
        ...baseHook,
        tenant: {
          id: 't1',
          name: 'Test Tenant',
          slug: 'test-tenant',
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
      });
      const { getByTestId } = renderWithTheme(<TenantDetailScreenWeb />);
      expect(getByTestId('tenant-detail-title')).toBeTruthy();
      expect(getByTestId('tenant-detail-id')).toBeTruthy();
      expect(getByTestId('tenant-detail-name')).toBeTruthy();
      expect(getByTestId('tenant-detail-slug')).toBeTruthy();
      expect(getByTestId('tenant-detail-active')).toBeTruthy();
      expect(getByTestId('tenant-detail-created')).toBeTruthy();
      expect(getByTestId('tenant-detail-updated')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has accessibility labels (Web)', () => {
      useTenantDetailScreen.mockReturnValue({
        ...baseHook,
        tenant: {
          id: 't1',
          name: 'Test Tenant',
          slug: 'test-tenant',
          is_active: true,
        },
      });
      const { getByTestId } = renderWithTheme(<TenantDetailScreenWeb />);
      expect(getByTestId('tenant-detail-back')).toBeTruthy();
      expect(getByTestId('tenant-detail-delete')).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('exports component and hook from index', () => {
      expect(TenantDetailScreenIndex.default).toBeDefined();
      expect(TenantDetailScreenIndex.useTenantDetailScreen).toBeDefined();
    });
    it('exports STATES', () => {
      expect(STATES).toBeDefined();
      expect(STATES.READY).toBe('ready');
    });
  });
});
