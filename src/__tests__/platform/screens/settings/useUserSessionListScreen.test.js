/**
 * useUserSessionListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useUserSessionListScreen = require('@platform/screens/settings/UserSessionListScreen/useUserSessionListScreen').default;

const mockPush = jest.fn();
jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useUserSession: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const useUserSession = require('@hooks').useUserSession;

describe('useUserSessionListScreen', () => {
  const mockList = jest.fn();
  const mockRevoke = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useUserSession.mockReturnValue({
      list: mockList,
      revoke: mockRevoke,
      data: { items: [], pagination: {} },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns items, handlers, and state', () => {
    const { result } = renderHook(() => useUserSessionListScreen());
    expect(result.current.items).toEqual([]);
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onSessionPress).toBe('function');
    expect(typeof result.current.onRevoke).toBe('function');
  });

  it('calls list on mount', () => {
    renderHook(() => useUserSessionListScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onRetry calls fetchList', () => {
    const { result } = renderHook(() => useUserSessionListScreen());
    mockReset.mockClear();
    mockList.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onSessionPress pushes route with id', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useUserSessionListScreen());
    result.current.onSessionPress('sid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/user-sessions/sid-1');
  });

  it('exposes errorMessage when errorCode set', () => {
    useUserSession.mockReturnValue({
      list: mockList,
      revoke: mockRevoke,
      data: { items: [] },
      isLoading: false,
      errorCode: 'SESSION_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useUserSessionListScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onRevoke calls revoke then fetchList', async () => {
    mockRevoke.mockResolvedValue(undefined);
    mockReset.mockClear();
    mockList.mockClear();
    const { result } = renderHook(() => useUserSessionListScreen());
    await act(async () => {
      await result.current.onRevoke('sid-1');
    });
    expect(mockRevoke).toHaveBeenCalledWith('sid-1');
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onRevoke calls stopPropagation when event provided', async () => {
    const stopPropagation = jest.fn();
    mockRevoke.mockResolvedValue(undefined);
    const { result } = renderHook(() => useUserSessionListScreen());
    await act(async () => {
      await result.current.onRevoke('sid-1', { stopPropagation });
    });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('onRevoke does not throw or refetch when revoke rejects', async () => {
    mockRevoke.mockRejectedValue(new Error('revoke failed'));
    const { result } = renderHook(() => useUserSessionListScreen());
    mockList.mockClear();
    await act(async () => {
      await result.current.onRevoke('sid-1');
    });
    expect(mockRevoke).toHaveBeenCalledWith('sid-1');
    expect(mockList).not.toHaveBeenCalled();
  });
});
