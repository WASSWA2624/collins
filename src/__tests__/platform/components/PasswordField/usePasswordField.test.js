/**
 * usePasswordField Hook Tests
 * File: usePasswordField.test.js
 */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import usePasswordField from '@platform/components/forms/PasswordField/usePasswordField';
import { PASSWORD_STRENGTH } from '@platform/components/forms/PasswordField/types';
import rootReducer from '@store/rootReducer';
import lightTheme from '@theme/light.theme';

const act = TestRenderer.act;

const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

// Custom renderHook implementation to avoid @testing-library/react-hooks dependency
// Based on useImage.test.js pattern, adapted for Redux Provider
const renderHook = (hook, { initialProps } = {}) => {
  const result = {}; // Object that will be mutated
  let renderer;
  const store = createMockStore({
    ui: { theme: 'light', locale: 'en', isLoading: false },
  });
  
  const HookHarness = ({ hookProps }) => {
    const hookResult = hook(hookProps);
    // Mutate result object directly (Object.assign pattern from useImage test)
    Object.assign(result, hookResult);
    return null;
  };
  
  act(() => {
    renderer = TestRenderer.create(
      React.createElement(
        Provider,
        { store },
        React.createElement(HookHarness, { hookProps: initialProps })
      )
    );
  });
  
  return {
    result: { current: result }, // Return result as { current: result }
    rerender: (newProps) => {
      act(() => {
        renderer.update(
          React.createElement(
            Provider,
            { store },
            React.createElement(HookHarness, { hookProps: newProps })
          )
        );
      });
    },
    unmount: () => {
      act(() => {
        renderer.unmount();
      });
    },
  };
};

describe('usePasswordField', () => {
  describe('Password Strength Calculation', () => {
    it('should return weak strength for empty password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: '' } }
      );
      
      expect(result.current.passwordStrength.strength).toBe(PASSWORD_STRENGTH.WEAK);
      expect(result.current.passwordStrength.label).toBe('');
      expect(result.current.passwordStrength.color).toBe('');
    });

    it('should return weak strength for short password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'short' } }
      );
      
      expect(result.current.passwordStrength.strength).toBe(PASSWORD_STRENGTH.WEAK);
      expect(result.current.passwordStrength.label).toBe('Weak');
    });

    it('should return fair strength for 8+ character password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'password' } }
      );
      
      expect(result.current.passwordStrength.strength).toBe(PASSWORD_STRENGTH.FAIR);
      expect(result.current.passwordStrength.label).toBe('Fair');
    });

    it('should return good strength for 12+ character password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'password1234' } }
      );
      
      expect(result.current.passwordStrength.strength).toBe(PASSWORD_STRENGTH.GOOD);
      expect(result.current.passwordStrength.label).toBe('Good');
    });

    it('should return strong strength for password with mixed case', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'Password1234' } }
      );
      
      expect(result.current.passwordStrength.strength).toBeGreaterThanOrEqual(PASSWORD_STRENGTH.STRONG);
      expect(result.current.passwordStrength.label).toBe('Strong');
    });

    it('should return very strong strength for complex password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'ComplexP@ssw0rd123' } }
      );
      
      expect(result.current.passwordStrength.strength).toBe(PASSWORD_STRENGTH.VERY_STRONG);
      expect(result.current.passwordStrength.label).toBe('Very Strong');
    });

    it('should calculate strength based on length (8+ chars)', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: '12345678' } }
      );
      
      expect(result.current.passwordStrength.strength).toBeGreaterThanOrEqual(PASSWORD_STRENGTH.FAIR);
    });

    it('should calculate strength based on length (12+ chars)', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: '123456789012' } }
      );
      
      expect(result.current.passwordStrength.strength).toBeGreaterThanOrEqual(PASSWORD_STRENGTH.GOOD);
    });

    it('should calculate strength based on mixed case', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'Password123' } }
      );
      
      // Should have mixed case bonus
      expect(result.current.passwordStrength.strength).toBeGreaterThanOrEqual(PASSWORD_STRENGTH.GOOD);
    });

    it('should calculate strength based on numbers', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'password123' } }
      );
      
      // Should have number bonus
      expect(result.current.passwordStrength.strength).toBeGreaterThanOrEqual(PASSWORD_STRENGTH.GOOD);
    });

    it('should calculate strength based on special characters', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'password@123' } }
      );
      
      // Should have special character bonus
      expect(result.current.passwordStrength.strength).toBeGreaterThanOrEqual(PASSWORD_STRENGTH.STRONG);
    });

    it('should cap strength at VERY_STRONG', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'VeryComplexP@ssw0rd123!@#$' } }
      );
      
      expect(result.current.passwordStrength.strength).toBe(PASSWORD_STRENGTH.VERY_STRONG);
      expect(result.current.passwordStrength.strength).toBeLessThanOrEqual(PASSWORD_STRENGTH.VERY_STRONG);
    });
  });

  describe('Strength Labels', () => {
    it('should return correct label for weak password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'weak' } }
      );
      
      expect(result.current.passwordStrength.label).toBe('Weak');
    });

    it('should return correct label for fair password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'password' } }
      );
      
      expect(result.current.passwordStrength.label).toBe('Fair');
    });

    it('should return correct label for good password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'password1234' } }
      );
      
      expect(result.current.passwordStrength.label).toBe('Good');
    });

    it('should return correct label for strong password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'Password123' } }
      );
      
      expect(result.current.passwordStrength.label).toBe('Strong');
    });

    it('should return correct label for very strong password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'ComplexP@ssw0rd123' } }
      );
      
      expect(result.current.passwordStrength.label).toBe('Very Strong');
    });
  });

  describe('Strength Colors', () => {
    it('should return correct color for weak password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'weak' } }
      );
      
      expect(result.current.passwordStrength.color).toBe(lightTheme.colors.error);
    });

    it('should return correct color for fair password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'password' } }
      );
      
      expect(result.current.passwordStrength.color).toBe(lightTheme.colors.warning);
    });

    it('should return correct color for good password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'password1234' } }
      );
      
      expect(result.current.passwordStrength.color).toBe(lightTheme.colors.warning);
    });

    it('should return correct color for strong password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'Password123' } }
      );
      
      expect(result.current.passwordStrength.color).toBe(lightTheme.colors.success);
    });

    it('should return correct color for very strong password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'ComplexP@ssw0rd123' } }
      );
      
      expect(result.current.passwordStrength.color).toBe(lightTheme.colors.success);
    });
  });

  describe('Memoization', () => {
    it('should memoize password strength calculation', () => {
      const { result, rerender } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'password123' } }
      );

      const firstStrength = result.current.passwordStrength.strength;

      rerender({ password: 'password123' }); // Same password

      expect(result.current.passwordStrength.strength).toBe(firstStrength);
    });

    it('should recalculate when password changes', () => {
      const { result, rerender } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'weak' } }
      );

      const weakStrength = result.current.passwordStrength.strength;

      rerender({ password: 'ComplexP@ssw0rd123' }); // Different password

      expect(result.current.passwordStrength.strength).not.toBe(weakStrength);
      expect(result.current.passwordStrength.strength).toBeGreaterThan(weakStrength);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: null } }
      );
      
      expect(result.current.passwordStrength.strength).toBe(PASSWORD_STRENGTH.WEAK);
      expect(result.current.passwordStrength.label).toBe('');
    });

    it('should handle undefined password', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: undefined } }
      );
      
      expect(result.current.passwordStrength.strength).toBe(PASSWORD_STRENGTH.WEAK);
      expect(result.current.passwordStrength.label).toBe('');
    });

    it('should handle very long password', () => {
      const longPassword = 'a'.repeat(100);
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: longPassword } }
      );
      
      // Should still calculate strength correctly
      expect(result.current.passwordStrength.strength).toBeGreaterThanOrEqual(PASSWORD_STRENGTH.FAIR);
    });

    it('should handle password with only numbers', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: '123456789012' } }
      );
      
      expect(result.current.passwordStrength.strength).toBeGreaterThanOrEqual(PASSWORD_STRENGTH.GOOD);
    });

    it('should handle password with only letters', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: 'abcdefghijkl' } }
      );
      
      expect(result.current.passwordStrength.strength).toBeGreaterThanOrEqual(PASSWORD_STRENGTH.GOOD);
    });

    it('should handle password with only special characters', () => {
      const { result } = renderHook(
        ({ password }) => usePasswordField({ password }),
        { initialProps: { password: '!@#$%^&*()_+' } }
      );
      
      expect(result.current.passwordStrength.strength).toBeGreaterThanOrEqual(PASSWORD_STRENGTH.FAIR);
    });
  });
});
