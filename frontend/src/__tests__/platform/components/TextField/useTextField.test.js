/**
 * useTextField Hook Tests
 * File: useTextField.test.js
 */
const React = require('react');
const { act, create } = require('react-test-renderer');
const useTextFieldModule = require('@platform/components/forms/TextField/useTextField');
const useTextField = useTextFieldModule.default || useTextFieldModule;
const typesModule = require('@platform/components/forms/TextField/types');
const { VALIDATION_STATES } = typesModule.default || typesModule;

/**
 * Minimal renderHook helper (keeps us dependency-free)
 * Supports the subset we use in this repo: renderHook(fn) and renderHook(fn, { initialProps })
 */
const renderHook = (hook, hookPropsOrOptions = undefined) => {
  const result = { current: null };

  const isOptionsObject =
    hookPropsOrOptions &&
    typeof hookPropsOrOptions === 'object' &&
    Object.prototype.hasOwnProperty.call(hookPropsOrOptions, 'initialProps');

  const initialProps = isOptionsObject ? hookPropsOrOptions.initialProps : hookPropsOrOptions;

  const HookHarness = (props) => {
    result.current = hook(props.hookProps || {});
    return null;
  };

  let renderer;
  act(() => {
    renderer = create(<HookHarness hookProps={initialProps} />);
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

// Mock validator
jest.mock('@utils/validator', () => ({
  isValidEmail: jest.fn((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  isValidUrl: jest.fn((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }),
}));

// Mock i18n
jest.mock('@i18n', () => {
  const enTranslations = require('@i18n/locales/en.json');
  
  const getNestedValue = (obj, path) => {
    if (!obj || typeof obj !== 'object') return undefined;
    if (!path || typeof path !== 'string') return undefined;
    return path
      .split('.')
      .reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), obj);
  };

  const interpolate = (value, params) => {
    if (typeof value !== 'string') return '';
    if (!params || typeof params !== 'object') return value;
    let text = value;
    Object.keys(params).forEach((param) => {
      text = text.replaceAll(`{{${param}}}`, String(params[param]));
    });
    return text;
  };

  const tSync = (key, params = {}) => {
    const raw = getNestedValue(enTranslations, key) || key;
    return interpolate(String(raw), params);
  };

  return {
    createI18n: jest.fn(() => ({ tSync })),
    getDeviceLocale: jest.fn(() => 'en'),
    tSync,
  };
});

describe('useTextField', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('should initialize with default value', () => {
      const { result } = renderHook(useTextField, { value: 'initial' });
      
      expect(result.current.value).toBe('initial');
      expect(result.current.validationState).toBe(VALIDATION_STATES.DEFAULT);
      expect(result.current.errorMessage).toBe('');
      expect(result.current.isFocused).toBe(false);
      expect(result.current.characterCount).toBe(7);
    });

    it('should initialize with empty string when value is not provided', () => {
      const { result } = renderHook(useTextField, {});
      
      expect(result.current.value).toBe('');
      expect(result.current.characterCount).toBe(0);
    });

    it('should sync with external value changes', () => {
      const { result, rerender } = renderHook(
        (props) => useTextField({ value: props.value }),
        { initialProps: { value: 'initial' } }
      );
      
      expect(result.current.value).toBe('initial');
      
      rerender({ value: 'updated' });
      
      expect(result.current.value).toBe('updated');
    });
  });

  describe('Change Handler', () => {
    it('should update value when handleChange is called', () => {
      const mockOnChangeText = jest.fn();
      const { result } = renderHook(useTextField, { onChangeText: mockOnChangeText });
      
      act(() => {
        result.current.handleChange('new value');
      });
      
      expect(result.current.value).toBe('new value');
    });

    it('should call onChangeText after debounce', () => {
      const mockOnChangeText = jest.fn();
      const { result } = renderHook(useTextField, { onChangeText: mockOnChangeText, debounceMs: 300 });
      
      act(() => {
        result.current.handleChange('new value');
      });
      
      expect(mockOnChangeText).not.toHaveBeenCalled();
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(mockOnChangeText).toHaveBeenCalledWith('new value');
    });

    it('should call onChange (web) after debounce', () => {
      const mockOnChange = jest.fn();
      const { result } = renderHook(useTextField, { onChange: mockOnChange, debounceMs: 300 });
      
      act(() => {
        result.current.handleChange('new value');
      });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(mockOnChange).toHaveBeenCalledWith({ target: { value: 'new value' } });
    });

    it('should debounce multiple rapid changes', () => {
      const mockOnChangeText = jest.fn();
      const { result } = renderHook(useTextField, { onChangeText: mockOnChangeText, debounceMs: 300 });
      
      act(() => {
        result.current.handleChange('a');
        result.current.handleChange('ab');
        result.current.handleChange('abc');
      });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(mockOnChangeText).toHaveBeenCalledTimes(1);
      expect(mockOnChangeText).toHaveBeenCalledWith('abc');
    });
  });

  describe('Phone Number Formatting', () => {
    it('should format phone number when autoFormat is enabled and type is tel', () => {
      const mockOnChangeText = jest.fn();
      const { result } = renderHook(useTextField, { onChangeText: mockOnChangeText, type: 'tel', autoFormat: true });
      
      act(() => {
        result.current.handleChange('1234567890');
      });
      
      expect(result.current.value).toBe('(123) 456-7890');
    });

    it('should not format when autoFormat is disabled', () => {
      const mockOnChangeText = jest.fn();
      const { result } = renderHook(useTextField, { onChangeText: mockOnChangeText, type: 'tel', autoFormat: false });
      
      act(() => {
        result.current.handleChange('1234567890');
      });
      
      expect(result.current.value).toBe('1234567890');
    });

    it('should not format when type is not tel', () => {
      const mockOnChangeText = jest.fn();
      const { result } = renderHook(useTextField, { onChangeText: mockOnChangeText, type: 'text', autoFormat: true });
      
      act(() => {
        result.current.handleChange('1234567890');
      });
      
      expect(result.current.value).toBe('1234567890');
    });
  });

  describe('Validation', () => {
    it('should validate required field', () => {
      const { result } = renderHook(useTextField, { required: true });
      
      act(() => {
        result.current.handleChange('');
      });
      
      expect(result.current.validationState).toBe(VALIDATION_STATES.ERROR);
      expect(result.current.errorMessage).toBe('This field is required');
    });

    it('should validate email format', () => {
      const { result } = renderHook(useTextField, { type: 'email' });
      
      act(() => {
        result.current.handleChange('invalid-email');
      });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(result.current.validationState).toBe(VALIDATION_STATES.ERROR);
      expect(result.current.errorMessage).toBe('Invalid email format');
    });

    it('should validate URL format', () => {
      const { result } = renderHook(useTextField, { type: 'url' });
      
      act(() => {
        result.current.handleChange('not-a-url');
      });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(result.current.validationState).toBe(VALIDATION_STATES.ERROR);
      expect(result.current.errorMessage).toBe('Invalid URL format');
    });

    it('should validate maxLength', () => {
      const { result } = renderHook(useTextField, { maxLength: 5 });
      
      act(() => {
        result.current.handleChange('too long');
      });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(result.current.validationState).toBe(VALIDATION_STATES.ERROR);
      expect(result.current.errorMessage).toBe('Maximum length is 5 characters');
    });

    it('should use custom validation function', () => {
      const customValidate = jest.fn((value) => value.length >= 3);
      const { result } = renderHook(useTextField, { validate: customValidate });
      
      act(() => {
        result.current.handleChange('ab');
      });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(customValidate).toHaveBeenCalled();
      expect(result.current.validationState).toBe(VALIDATION_STATES.ERROR);
    });

    it('should use custom validation function returning object', () => {
      const customValidate = jest.fn((value) => ({ valid: value.length >= 3, error: 'Too short' }));
      const { result } = renderHook(useTextField, { validate: customValidate });
      
      act(() => {
        result.current.handleChange('ab');
      });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(result.current.validationState).toBe(VALIDATION_STATES.ERROR);
      expect(result.current.errorMessage).toBe('Too short');
    });

    it('should set success state for valid value', () => {
      const { result } = renderHook(useTextField, { type: 'email' });
      
      act(() => {
        result.current.handleChange('test@example.com');
      });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(result.current.validationState).toBe(VALIDATION_STATES.SUCCESS);
      expect(result.current.errorMessage).toBe('');
    });

    it('should validate on blur', () => {
      const { result } = renderHook(useTextField, { required: true });
      
      act(() => {
        result.current.handleChange('');
        result.current.handleBlur();
      });
      
      expect(result.current.validationState).toBe(VALIDATION_STATES.ERROR);
    });
  });

  describe('Focus Handlers', () => {
    it('should set isFocused to true when handleFocus is called', () => {
      const { result } = renderHook(useTextField, {});
      
      act(() => {
        result.current.handleFocus();
      });
      
      expect(result.current.isFocused).toBe(true);
    });

    it('should set isFocused to false when handleBlur is called', () => {
      const { result } = renderHook(useTextField, {});
      
      act(() => {
        result.current.handleFocus();
        result.current.handleBlur();
      });
      
      expect(result.current.isFocused).toBe(false);
    });
  });

  describe('Character Count', () => {
    it('should return correct character count', () => {
      const { result } = renderHook(useTextField, { value: 'hello' });
      
      expect(result.current.characterCount).toBe(5);
    });

    it('should return 0 for empty value', () => {
      const { result } = renderHook(useTextField, { value: '' });
      
      expect(result.current.characterCount).toBe(0);
    });

    it('should update character count when value changes', () => {
      const { result } = renderHook(useTextField, {});
      
      act(() => {
        result.current.handleChange('test');
      });
      
      expect(result.current.characterCount).toBe(4);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined value', () => {
      const { result } = renderHook(useTextField, { value: undefined });
      
      expect(result.current.value).toBe('');
    });

    it('should handle null value', () => {
      const { result } = renderHook(useTextField, { value: null });
      
      expect(result.current.value).toBe('');
    });

    it('should cleanup debounce timer on unmount', () => {
      const mockOnChangeText = jest.fn();
      const { result, unmount } = renderHook(useTextField, { onChangeText: mockOnChangeText, debounceMs: 300 });
      
      act(() => {
        result.current.handleChange('test');
      });
      
      unmount();
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      // Should not call onChangeText after unmount
      expect(mockOnChangeText).not.toHaveBeenCalled();
    });

    it('should handle non-required empty field', () => {
      const { result } = renderHook(useTextField, { required: false });
      
      act(() => {
        result.current.handleChange('');
      });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(result.current.validationState).toBe(VALIDATION_STATES.DEFAULT);
    });
  });
});

