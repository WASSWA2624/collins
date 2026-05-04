/**
 * useImage Hook Tests
 * File: useImage.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const useImageModule = require('@platform/components/display/Image/useImage');
const useImage = useImageModule.default || useImageModule;

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

describe('useImage', () => {
  describe('Initialization', () => {
    it('should initialize with loading state', () => {
      const { result } = renderHook(() => useImage({ source: 'https://example.com/image.jpg' }));
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.hasError).toBe(false);
      expect(result.current.currentSource).toBe('https://example.com/image.jpg');
    });

    it('should initialize with provided source', () => {
      const source = 'https://example.com/image.jpg';
      const { result } = renderHook(() => useImage({ source }));
      
      expect(result.current.currentSource).toBe(source);
    });

    it('should handle undefined source', () => {
      const { result } = renderHook(() => useImage({ source: undefined }));
      
      expect(result.current.currentSource).toBeUndefined();
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Load Handler', () => {
    it('should set isLoading to false when handleLoad is called', () => {
      const { result } = renderHook(() => useImage({ source: 'https://example.com/image.jpg' }));
      
      act(() => {
        result.current.handleLoad();
      });
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasError).toBe(false);
    });

    it('should call onLoad callback when provided', () => {
      const mockOnLoad = jest.fn();
      const mockEvent = { target: { src: 'https://example.com/image.jpg' } };
      const { result } = renderHook(() => useImage({ source: 'https://example.com/image.jpg', onLoad: mockOnLoad }));
      
      act(() => {
        result.current.handleLoad(mockEvent);
      });
      
      expect(mockOnLoad).toHaveBeenCalledWith(mockEvent);
      expect(mockOnLoad).toHaveBeenCalledTimes(1);
    });

    it('should handle load without onLoad callback', () => {
      const { result } = renderHook(() => useImage({ source: 'https://example.com/image.jpg' }));
      
      act(() => {
        result.current.handleLoad();
      });
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasError).toBe(false);
    });

    it('should reset error state on successful load', () => {
      const { result } = renderHook(() => useImage({ source: 'https://example.com/image.jpg' }));
      
      // Simulate error first
      act(() => {
        result.current.handleError();
      });
      expect(result.current.hasError).toBe(true);
      
      // Then load successfully
      act(() => {
        result.current.handleLoad();
      });
      
      expect(result.current.hasError).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Error Handler', () => {
    it('should set hasError to true when handleError is called without fallback', () => {
      const { result } = renderHook(() => useImage({ source: 'https://example.com/image.jpg' }));
      
      act(() => {
        result.current.handleError();
      });
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasError).toBe(true);
    });

    it('should switch to fallback source when error occurs and fallback is provided', () => {
      const source = 'https://example.com/image.jpg';
      const fallback = 'https://example.com/fallback.jpg';
      const { result } = renderHook(() => useImage({ source, fallback }));
      
      act(() => {
        result.current.handleError();
      });
      
      expect(result.current.currentSource).toBe(fallback);
      expect(result.current.hasError).toBe(false);
      expect(result.current.isLoading).toBe(true); // Loading the fallback image
    });

    it('should not switch to fallback if current source is already fallback', () => {
      const fallback = 'https://example.com/fallback.jpg';
      const { result } = renderHook(() => useImage({ source: fallback, fallback }));
      
      act(() => {
        result.current.handleError();
      });
      
      expect(result.current.currentSource).toBe(fallback);
      expect(result.current.hasError).toBe(true);
    });

    it('should call onError callback when provided', () => {
      const mockOnError = jest.fn();
      const mockEvent = { target: { src: 'https://example.com/image.jpg' } };
      const { result } = renderHook(() => useImage({ source: 'https://example.com/image.jpg', onError: mockOnError }));
      
      act(() => {
        result.current.handleError(mockEvent);
      });
      
      expect(mockOnError).toHaveBeenCalledWith(mockEvent);
      expect(mockOnError).toHaveBeenCalledTimes(1);
    });

    it('should handle error without onError callback', () => {
      const { result } = renderHook(() => useImage({ source: 'https://example.com/image.jpg' }));
      
      act(() => {
        result.current.handleError();
      });
      
      expect(result.current.hasError).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set isLoading to false on error', () => {
      const { result } = renderHook(() => useImage({ source: 'https://example.com/image.jpg' }));
      
      expect(result.current.isLoading).toBe(true);
      
      act(() => {
        result.current.handleError();
      });
      
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Fallback Behavior', () => {
    it('should use fallback when primary source fails', () => {
      const source = 'https://example.com/image.jpg';
      const fallback = 'https://example.com/fallback.jpg';
      const { result } = renderHook(() => useImage({ source, fallback }));
      
      expect(result.current.currentSource).toBe(source);
      
      act(() => {
        result.current.handleError();
      });
      
      // State update might be async, so we check after act
      expect(result.current.currentSource).toBe(fallback);
      expect(result.current.isLoading).toBe(true); // Loading the fallback
    });

    it('should handle error on fallback source', () => {
      const source = 'https://example.com/image.jpg';
      const fallback = 'https://example.com/fallback.jpg';
      const { result } = renderHook(() => useImage({ source, fallback }));
      
      // First error - switch to fallback
      act(() => {
        result.current.handleError();
      });
      expect(result.current.currentSource).toBe(fallback);
      expect(result.current.hasError).toBe(false);
      expect(result.current.isLoading).toBe(true); // Loading the fallback
      
      // Second error on fallback - should set error
      act(() => {
        result.current.handleError();
      });
      expect(result.current.hasError).toBe(true);
      expect(result.current.isLoading).toBe(false); // No longer loading after error
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined source', () => {
      const { result } = renderHook(() => useImage({ source: undefined }));
      
      expect(result.current.currentSource).toBeUndefined();
      expect(result.current.isLoading).toBe(true);
    });

    it('should handle null source', () => {
      const { result } = renderHook(() => useImage({ source: null }));
      
      expect(result.current.currentSource).toBeNull();
      expect(result.current.isLoading).toBe(true);
    });

    it('should handle empty string source', () => {
      const { result } = renderHook(() => useImage({ source: '' }));
      
      expect(result.current.currentSource).toBe('');
      expect(result.current.isLoading).toBe(true);
    });

    it('should handle multiple load/error cycles', () => {
      const { result } = renderHook(() => useImage({ source: 'https://example.com/image.jpg' }));
      
      act(() => {
        result.current.handleLoad();
      });
      expect(result.current.isLoading).toBe(false);
      
      act(() => {
        result.current.handleError();
      });
      expect(result.current.hasError).toBe(true);
      
      act(() => {
        result.current.handleLoad();
      });
      expect(result.current.hasError).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Source Prop Changes', () => {
    it('should update currentSource when source prop changes', () => {
      const { result, rerender } = renderHook(
        ({ source }) => useImage({ source }),
        { initialProps: { source: 'https://example.com/image1.jpg' } }
      );
      
      expect(result.current.currentSource).toBe('https://example.com/image1.jpg');
      expect(result.current.isLoading).toBe(true);
      expect(result.current.hasError).toBe(false);
      
      act(() => {
        rerender({ source: 'https://example.com/image2.jpg' });
      });
      
      expect(result.current.currentSource).toBe('https://example.com/image2.jpg');
      expect(result.current.isLoading).toBe(true);
      expect(result.current.hasError).toBe(false);
    });

    it('should reset loading and error state when source changes', () => {
      const { result, rerender } = renderHook(
        ({ source }) => useImage({ source }),
        { initialProps: { source: 'https://example.com/image1.jpg' } }
      );
      
      // Simulate error
      act(() => {
        result.current.handleError();
      });
      expect(result.current.hasError).toBe(true);
      expect(result.current.isLoading).toBe(false);
      
      // Change source - should reset error state
      act(() => {
        rerender({ source: 'https://example.com/image2.jpg' });
      });
      
      expect(result.current.currentSource).toBe('https://example.com/image2.jpg');
      expect(result.current.isLoading).toBe(true);
      expect(result.current.hasError).toBe(false);
    });
  });

  describe('onError Callback with Fallback', () => {
    it('should call onError callback when fallback is used', () => {
      const mockOnError = jest.fn();
      const mockEvent = { target: { src: 'https://example.com/image.jpg' } };
      const source = 'https://example.com/image.jpg';
      const fallback = 'https://example.com/fallback.jpg';
      const { result } = renderHook(() => useImage({ source, fallback, onError: mockOnError }));
      
      act(() => {
        result.current.handleError(mockEvent);
      });
      
      expect(mockOnError).toHaveBeenCalledWith(mockEvent);
      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(result.current.currentSource).toBe(fallback);
    });

    it('should handle object source format with fallback', () => {
      const source = { uri: 'https://example.com/image.jpg' };
      const fallback = { uri: 'https://example.com/fallback.jpg' };
      const { result } = renderHook(() => useImage({ source, fallback }));
      
      expect(result.current.currentSource).toEqual(source);
      
      act(() => {
        result.current.handleError();
      });
      
      expect(result.current.currentSource).toEqual(fallback);
      expect(result.current.hasError).toBe(false);
      expect(result.current.isLoading).toBe(true);
    });

    it('should handle string source with object fallback', () => {
      const source = 'https://example.com/image.jpg';
      const fallback = { uri: 'https://example.com/fallback.jpg' };
      const { result } = renderHook(() => useImage({ source, fallback }));
      
      act(() => {
        result.current.handleError();
      });
      
      expect(result.current.currentSource).toEqual(fallback);
      expect(result.current.hasError).toBe(false);
      expect(result.current.isLoading).toBe(true);
    });

    it('should handle object source with string fallback', () => {
      const source = { uri: 'https://example.com/image.jpg' };
      const fallback = 'https://example.com/fallback.jpg';
      const { result } = renderHook(() => useImage({ source, fallback }));
      
      act(() => {
        result.current.handleError();
      });
      
      expect(result.current.currentSource).toBe(fallback);
      expect(result.current.hasError).toBe(false);
      expect(result.current.isLoading).toBe(true);
    });
  });
});

