/**
 * useButton Hook Tests
 * File: useButton.test.js
 */
const React = require('react');
const { act, create } = require('react-test-renderer');
const useButtonModule = require('@platform/components/forms/Button/useButton');
const useButton = useButtonModule.default || useButtonModule;
const typesModule = require('@platform/components/forms/Button/types');
const { STATES } = typesModule.default || typesModule;

/**
 * Minimal renderHook helper (keeps us dependency-free)
 * @param {(props: any) => any} hook
 * @param {any} hookProps
 */
const renderHook = (hook, hookProps) => {
  const result = { current: null };

  const HookHarness = (props) => {
    result.current = hook(props.hookProps);
    return null;
  };

  let renderer;
  act(() => {
    renderer = create(<HookHarness hookProps={hookProps} />);
  });

  return {
    result,
    rerender: (nextProps) =>
      act(() => {
        renderer.update(<HookHarness hookProps={nextProps} />);
      }),
    unmount: () =>
      act(() => {
        renderer.unmount();
      }),
  };
};

describe('useButton', () => {
  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(useButton, {});
      
      expect(result.current.isPressed).toBe(false);
      expect(result.current.state).toBe(STATES.DEFAULT);
      expect(typeof result.current.handlePress).toBe('function');
      expect(typeof result.current.handlePressIn).toBe('function');
      expect(typeof result.current.handlePressOut).toBe('function');
    });

    it('should initialize with disabled state when disabled prop is true', () => {
      const { result } = renderHook(useButton, { disabled: true });
      
      expect(result.current.state).toBe(STATES.DISABLED);
    });

    it('should initialize with loading state when loading prop is true', () => {
      const { result } = renderHook(useButton, { loading: true });
      
      expect(result.current.state).toBe(STATES.LOADING);
    });
  });

  describe('Press Handlers', () => {
    it('should call onPress when handlePress is called', () => {
      const mockOnPress = jest.fn();
      const { result } = renderHook(useButton, { onPress: mockOnPress });
      
      act(() => {
        result.current.handlePress();
      });
      
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const mockOnPress = jest.fn();
      const { result } = renderHook(useButton, { onPress: mockOnPress, disabled: true });
      
      act(() => {
        result.current.handlePress();
      });
      
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should not call onPress when loading', () => {
      const mockOnPress = jest.fn();
      const { result } = renderHook(useButton, { onPress: mockOnPress, loading: true });
      
      act(() => {
        result.current.handlePress();
      });
      
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should pass event to onPress', () => {
      const mockOnPress = jest.fn();
      const mockEvent = { type: 'press' };
      const { result } = renderHook(useButton, { onPress: mockOnPress });
      
      act(() => {
        result.current.handlePress(mockEvent);
      });
      
      expect(mockOnPress).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('Press In/Out Handlers', () => {
    it('should set isPressed to true when handlePressIn is called', () => {
      const { result } = renderHook(useButton, {});
      
      act(() => {
        result.current.handlePressIn();
      });
      
      expect(result.current.isPressed).toBe(true);
      expect(result.current.state).toBe(STATES.ACTIVE);
    });

    it('should not set isPressed when disabled', () => {
      const { result } = renderHook(useButton, { disabled: true });
      
      act(() => {
        result.current.handlePressIn();
      });
      
      expect(result.current.isPressed).toBe(false);
      expect(result.current.state).toBe(STATES.DISABLED);
    });

    it('should not set isPressed when loading', () => {
      const { result } = renderHook(useButton, { loading: true });
      
      act(() => {
        result.current.handlePressIn();
      });
      
      expect(result.current.isPressed).toBe(false);
      expect(result.current.state).toBe(STATES.LOADING);
    });

    it('should set isPressed to false when handlePressOut is called', () => {
      const { result } = renderHook(useButton, {});
      
      act(() => {
        result.current.handlePressIn();
      });
      expect(result.current.isPressed).toBe(true);
      
      act(() => {
        result.current.handlePressOut();
      });
      
      expect(result.current.isPressed).toBe(false);
      expect(result.current.state).toBe(STATES.DEFAULT);
    });
  });

  describe('State Management', () => {
    it('should return LOADING state when loading is true', () => {
      const { result } = renderHook(useButton, { loading: true });
      
      expect(result.current.state).toBe(STATES.LOADING);
    });

    it('should return DISABLED state when disabled is true', () => {
      const { result } = renderHook(useButton, { disabled: true });
      
      expect(result.current.state).toBe(STATES.DISABLED);
    });

    it('should return ACTIVE state when isPressed is true', () => {
      const { result } = renderHook(useButton, {});
      
      act(() => {
        result.current.handlePressIn();
      });
      
      expect(result.current.state).toBe(STATES.ACTIVE);
    });

    it('should return DEFAULT state when not loading, disabled, or pressed', () => {
      const { result } = renderHook(useButton, {});
      
      expect(result.current.state).toBe(STATES.DEFAULT);
    });

    it('should prioritize loading over disabled', () => {
      const { result } = renderHook(useButton, { loading: true, disabled: true });
      
      expect(result.current.state).toBe(STATES.LOADING);
    });

    it('should prioritize loading over pressed', () => {
      const { result } = renderHook(useButton, { loading: true });
      
      act(() => {
        result.current.handlePressIn();
      });
      
      expect(result.current.state).toBe(STATES.LOADING);
    });

    it('should prioritize disabled over pressed', () => {
      const { result } = renderHook(useButton, { disabled: true });
      
      act(() => {
        result.current.handlePressIn();
      });
      
      expect(result.current.state).toBe(STATES.DISABLED);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined onPress', () => {
      const { result } = renderHook(useButton, { onPress: undefined });
      
      act(() => {
        result.current.handlePress();
      });
      
      // Should not throw
      expect(result.current.state).toBe(STATES.DEFAULT);
    });

    it('should handle null onPress', () => {
      const { result } = renderHook(useButton, { onPress: null });
      
      act(() => {
        result.current.handlePress();
      });
      
      // Should not throw
      expect(result.current.state).toBe(STATES.DEFAULT);
    });

    it('should handle multiple rapid press in/out', () => {
      const { result } = renderHook(useButton, {});
      
      act(() => {
        result.current.handlePressIn();
        result.current.handlePressOut();
        result.current.handlePressIn();
        result.current.handlePressOut();
      });
      
      expect(result.current.isPressed).toBe(false);
      expect(result.current.state).toBe(STATES.DEFAULT);
    });
  });
});

