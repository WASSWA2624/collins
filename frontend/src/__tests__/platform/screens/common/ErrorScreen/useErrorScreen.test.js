/**
 * useErrorScreen Hook Tests
 * File: useErrorScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { useRouter } = require('expo-router');

// Custom renderHook implementation to avoid @testing-library/react-hooks dependency
const act = TestRenderer.act;
const renderHook = (hook, options = {}) => {
  const { initialProps } = options;
  const result = {};
  let renderer;
  let currentProps = initialProps;
  
  const HookHarness = () => {
    const hookResult = hook(currentProps);
    Object.assign(result, hookResult);
    return null;
  };
  
  act(() => {
    renderer = TestRenderer.create(React.createElement(HookHarness));
  });
  
  return {
    result: { current: result },
    rerender: (newProps) => {
      currentProps = newProps;
      act(() => {
        renderer.update(React.createElement(HookHarness));
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

const useErrorScreen = require('@platform/screens/common/ErrorScreen/useErrorScreen').default;

describe('useErrorScreen Hook', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue(mockRouter);
  });

  it('should return handleGoHome function', () => {
    const { result } = renderHook((props) => useErrorScreen(props));
    expect(result.current.handleGoHome).toBeDefined();
    expect(typeof result.current.handleGoHome).toBe('function');
  });

  it('should return handleRetry function', () => {
    const { result } = renderHook((props) => useErrorScreen(props));
    expect(result.current.handleRetry).toBeDefined();
    expect(typeof result.current.handleRetry).toBe('function');
  });

  it('should return hasRetry boolean', () => {
    const { result } = renderHook((props) => useErrorScreen(props));
    expect(result.current.hasRetry).toBeDefined();
    expect(typeof result.current.hasRetry).toBe('boolean');
  });

  it('should navigate to / when handleGoHome is called', () => {
    const { result } = renderHook((props) => useErrorScreen(props));
    
    act(() => {
      result.current.handleGoHome();
    });

    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('should call onRetry when handleRetry is called and onRetry is provided', () => {
    const mockOnRetry = jest.fn();
    const { result } = renderHook((props) => useErrorScreen(props), { initialProps: { onRetry: mockOnRetry } });
    
    act(() => {
      result.current.handleRetry();
    });

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should not throw when handleRetry is called without onRetry', () => {
    const { result } = renderHook((props) => useErrorScreen(props));
    
    expect(() => {
      act(() => {
        result.current.handleRetry();
      });
    }).not.toThrow();
  });

  it('should set hasRetry to true when onRetry is provided', () => {
    const mockOnRetry = jest.fn();
    const { result } = renderHook((props) => useErrorScreen(props), { initialProps: { onRetry: mockOnRetry } });
    expect(result.current.hasRetry).toBe(true);
  });

  it('should set hasRetry to false when onRetry is not provided', () => {
    const { result } = renderHook((props) => useErrorScreen(props));
    expect(result.current.hasRetry).toBe(false);
  });

  it('should memoize handleGoHome callback', () => {
    const { result, rerender } = renderHook((props) => useErrorScreen(props));
    const firstCallback = result.current.handleGoHome;
    
    rerender();
    const secondCallback = result.current.handleGoHome;
    
    expect(firstCallback).toBe(secondCallback);
  });

  it('should memoize handleRetry callback', () => {
    const mockOnRetry = jest.fn();
    const { result, rerender } = renderHook((props) => useErrorScreen(props), { initialProps: { onRetry: mockOnRetry } });
    const firstCallback = result.current.handleRetry;
    
    rerender({ onRetry: mockOnRetry });
    const secondCallback = result.current.handleRetry;
    
    expect(firstCallback).toBe(secondCallback);
  });
});

