/**
 * useTenantDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useTenantDetailScreen = require('@platform/screens/settings/TenantDetailScreen/useTenantDetailScreen').default;

const mockPush = jest.fn();
jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useTenant: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => ({ id: 'tid-1' }),
}));

const useTenant = require('@hooks').useTenant;

describe('useTenantDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTenant.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'tid-1', name: 'Test Tenant' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns tenant, handlers, and state', () => {
    const { result } = renderHook(() => useTenantDetailScreen());
    expect(result.current.tenant).toEqual({ id: 'tid-1', name: 'Test Tenant' });
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('calls get on mount with id', () => {
    renderHook(() => useTenantDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('tid-1');
  });

  it('onRetry calls fetchDetail', () => {
    const { result } = renderHook(() => useTenantDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('tid-1');
  });

  it('onBack pushes route to list', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useTenantDetailScreen());
    result.current.onBack();
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants');
  });

  it('exposes errorMessage when errorCode set', () => {
    useTenant.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'TENANT_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useTenantDetailScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onDelete calls remove then onBack', async () => {
    mockRemove.mockResolvedValue(undefined);
    mockPush.mockClear();
    const { result } = renderHook(() => useTenantDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('tid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants');
  });

  it('onDelete does not throw when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useTenantDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('tid-1');
  });

  it('handles null tenant when data is null', () => {
    useTenant.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useTenantDetailScreen());
    expect(result.current.tenant).toBeNull();
  });

  it('handles null tenant when data is array', () => {
    useTenant.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: [],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useTenantDetailScreen());
    expect(result.current.tenant).toBeNull();
  });
});
