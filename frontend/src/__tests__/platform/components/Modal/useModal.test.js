/**
 * useModal Hook Tests
 * File: useModal.test.js
 */

import React from 'react';
import TestRenderer from 'react-test-renderer';
import useModal from '@platform/components/feedback/Modal/useModal';

const act = TestRenderer.act;

// Custom renderHook implementation to avoid @testing-library/react-hooks dependency
const renderHook = (hook, { initialProps } = {}) => {
  const result = {};
  let renderer;
  
  const HookHarness = ({ hookProps }) => {
    const hookResult = hook(hookProps);
    Object.assign(result, hookResult);
    return null;
  };
  
  act(() => {
    renderer = TestRenderer.create(<HookHarness hookProps={initialProps} />);
  });
  
  return {
    result: { current: result },
    rerender: (newProps) => {
      act(() => {
        renderer.update(<HookHarness hookProps={newProps} />);
      });
    },
    unmount: () => {
      act(() => {
        renderer.unmount();
      });
    },
  };
};

describe('useModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should return handleBackdropPress function', () => {
      const { result } = renderHook(useModal, { initialProps: { visible: true, onDismiss: jest.fn() } });
      
      expect(typeof result.current.handleBackdropPress).toBe('function');
    });
  });

  describe('Backdrop Press Handler', () => {
    it('should call onDismiss when handleBackdropPress is called and dismissOnBackdrop is true', () => {
      const mockOnDismiss = jest.fn();
      const { result } = renderHook(useModal, { initialProps: { visible: true, onDismiss: mockOnDismiss, dismissOnBackdrop: true } });
      
      act(() => {
        result.current.handleBackdropPress();
      });
      
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('should not call onDismiss when dismissOnBackdrop is false', () => {
      const mockOnDismiss = jest.fn();
      const { result } = renderHook(useModal, { initialProps: { visible: true, onDismiss: mockOnDismiss, dismissOnBackdrop: false } });
      
      act(() => {
        result.current.handleBackdropPress();
      });
      
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });

    it('should not call onDismiss when onDismiss is not provided', () => {
      const { result } = renderHook(useModal, { initialProps: { visible: true, dismissOnBackdrop: true } });
      
      act(() => {
        result.current.handleBackdropPress();
      });
      
      // Should not throw
      expect(result.current.handleBackdropPress).toBeDefined();
    });

    it('should default dismissOnBackdrop to true', () => {
      const mockOnDismiss = jest.fn();
      const { result } = renderHook(useModal, { initialProps: { visible: true, onDismiss: mockOnDismiss } });
      
      act(() => {
        result.current.handleBackdropPress();
      });
      
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  });

  // Note: Keyboard handling is now done at the component level (KeyboardAvoidingView for native, focus trap for web)
  // The hook no longer contains keyboard listener logic per platform-ui.mdc rules (no Platform.OS checks in hooks)

  describe('Edge Cases', () => {
    it('should handle undefined onDismiss', () => {
      const { result } = renderHook(useModal, { initialProps: { visible: true, onDismiss: undefined } });
      
      act(() => {
        result.current.handleBackdropPress();
      });
      
      // Should not throw
      expect(result.current.handleBackdropPress).toBeDefined();
    });

    it('should handle null onDismiss', () => {
      const { result } = renderHook(useModal, { initialProps: { visible: true, onDismiss: null } });
      
      act(() => {
        result.current.handleBackdropPress();
      });
      
      // Should not throw
      expect(result.current.handleBackdropPress).toBeDefined();
    });

    it('should handle multiple backdrop presses', () => {
      const mockOnDismiss = jest.fn();
      const { result } = renderHook(useModal, { initialProps: { visible: true, onDismiss: mockOnDismiss } });
      
      act(() => {
        result.current.handleBackdropPress();
        result.current.handleBackdropPress();
        result.current.handleBackdropPress();
      });
      
      expect(mockOnDismiss).toHaveBeenCalledTimes(3);
    });
  });
});

