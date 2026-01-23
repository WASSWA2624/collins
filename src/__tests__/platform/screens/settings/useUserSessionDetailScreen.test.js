/**
 * useUserSessionDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useUserSessionDetailScreen = require('@platform/screens/settings/UserSessionDetailScreen/useUserSessionDetailScreen').default;

const mockPush = jest.fn();
const mockGet = jest.fn();
const mockRevoke = jest.fn();
const mockReset = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useUserSession: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: jest.fn(() => ({ id: 'session-1' })),
}));

const useUserSession = require('@hooks').useUserSession;
const useLocalSearchParams = require('expo-router').useLocalSearchParams;

describe('useUserSessionDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLocalSearchParams.mockReturnValue({ id: 'session-1' });
    useUserSession.mockReturnValue({
      get: mockGet,
      revoke: mockRevoke,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns session, handlers, and state', () => {
    const { result } = renderHook(() => useUserSessionDetailScreen());
    expect(result.current.id).toBe('session-1');
    expect(result.current.session).toBeNull();
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onRevoke).toBe('function');
  });

  it('calls get(id) on mount', () => {
    renderHook(() => useUserSessionDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('session-1');
  });

  it('does not call get when id missing', () => {
    useLocalSearchParams.mockReturnValue({});
    mockGet.mockClear();
    mockReset.mockClear();
    renderHook(() => useUserSessionDetailScreen());
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('onRetry calls fetchDetail', () => {
    mockReset.mockClear();
    mockGet.mockClear();
    const { result } = renderHook(() => useUserSessionDetailScreen());
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('session-1');
  });

  it('onBack pushes /settings/user-sessions', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useUserSessionDetailScreen());
    result.current.onBack();
    expect(mockPush).toHaveBeenCalledWith('/settings/user-sessions');
  });

  it('onRevoke calls revoke then onBack', async () => {
    mockRevoke.mockResolvedValue(undefined);
    mockPush.mockClear();
    const { result } = renderHook(() => useUserSessionDetailScreen());
    await act(async () => {
      await result.current.onRevoke();
    });
    expect(mockRevoke).toHaveBeenCalledWith('session-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/user-sessions');
  });

  it('exposes errorMessage when errorCode set', () => {
    useUserSession.mockReturnValue({
      get: mockGet,
      revoke: mockRevoke,
      data: null,
      isLoading: false,
      errorCode: 'SESSION_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useUserSessionDetailScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onRevoke does nothing when id missing', async () => {
    useLocalSearchParams.mockReturnValue({});
    mockRevoke.mockClear();
    mockPush.mockClear();
    const { result } = renderHook(() => useUserSessionDetailScreen());
    await act(async () => {
      await result.current.onRevoke();
    });
    expect(mockRevoke).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
