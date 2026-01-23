/**
 * useTenantListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useTenantListScreen = require('@platform/screens/settings/TenantListScreen/useTenantListScreen').default;

const mockPush = jest.fn();
jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useTenant: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const useTenant = require('@hooks').useTenant;

describe('useTenantListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTenant.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [], pagination: {} },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns items, handlers, and state', () => {
    const { result } = renderHook(() => useTenantListScreen());
    expect(result.current.items).toEqual([]);
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onTenantPress).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('calls list on mount', () => {
    renderHook(() => useTenantListScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onRetry calls fetchList', () => {
    const { result } = renderHook(() => useTenantListScreen());
    mockReset.mockClear();
    mockList.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onTenantPress pushes route with id', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useTenantListScreen());
    result.current.onTenantPress('tid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants/tid-1');
  });

  it('exposes errorMessage when errorCode set', () => {
    useTenant.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: 'TENANT_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useTenantListScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onDelete calls remove then fetchList', async () => {
    mockRemove.mockResolvedValue(undefined);
    mockReset.mockClear();
    mockList.mockClear();
    const { result } = renderHook(() => useTenantListScreen());
    await act(async () => {
      await result.current.onDelete('tid-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('tid-1');
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onDelete calls stopPropagation when event provided', async () => {
    const stopPropagation = jest.fn();
    mockRemove.mockResolvedValue(undefined);
    const { result } = renderHook(() => useTenantListScreen());
    await act(async () => {
      await result.current.onDelete('tid-1', { stopPropagation });
    });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('onDelete does not throw or refetch when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useTenantListScreen());
    mockList.mockClear();
    await act(async () => {
      await result.current.onDelete('tid-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('tid-1');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('handles items from data', () => {
    useTenant.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [{ id: 't1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useTenantListScreen());
    expect(result.current.items).toEqual([{ id: 't1', name: 'Tenant 1' }]);
  });

  it('handles empty items array', () => {
    useTenant.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useTenantListScreen());
    expect(result.current.items).toEqual([]);
  });
});
