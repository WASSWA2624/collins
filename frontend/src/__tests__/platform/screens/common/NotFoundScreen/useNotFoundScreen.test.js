/**
 * useNotFoundScreen Hook Tests
 * File: useNotFoundScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { useRouter } = require('expo-router');

// Custom renderHook implementation to avoid @testing-library/react-hooks dependency
const act = TestRenderer.act;
const renderHook = (hook, { initialProps } = {}) => {
  const result = {};
  let renderer;
  
  const HookHarness = ({ hookProps }) => {
    const hookResult = hook(hookProps);
    Object.assign(result, hookResult);
    return null;
  };
  
  act(() => {
    renderer = TestRenderer.create(React.createElement(HookHarness, { hookProps: initialProps }));
  });
  
  return {
    result: { current: result },
    rerender: (newProps) => {
      act(() => {
        renderer.update(React.createElement(HookHarness, { hookProps: newProps }));
      });
    },
    unmount: () => {
      act(() => {
        renderer.unmount();
      });
    },
  };
};

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const useNotFoundScreen = require('@platform/screens/common/NotFoundScreen/useNotFoundScreen').default;

describe('useNotFoundScreen Hook', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue(mockRouter);
  });

  it('should return handleGoHome function', () => {
    const { result } = renderHook(() => useNotFoundScreen());
    expect(result.current.handleGoHome).toBeDefined();
    expect(typeof result.current.handleGoHome).toBe('function');
  });

  it('should navigate to / when handleGoHome is called', () => {
    const { result } = renderHook(() => useNotFoundScreen());
    
    act(() => {
      result.current.handleGoHome();
    });

    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('should memoize handleGoHome callback', () => {
    const { result, rerender } = renderHook(() => useNotFoundScreen());
    const firstCallback = result.current.handleGoHome;
    
    rerender();
    const secondCallback = result.current.handleGoHome;
    
    // Callbacks should be the same reference (memoized)
    expect(firstCallback).toBe(secondCallback);
  });
});

