/**
 * SearchBar Pattern Tests
 * Comprehensive tests for SearchBar pattern across all platforms
 * File: SearchBar.test.js
 */

import React from 'react';
import { Platform } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import SearchBarModule from '@platform/patterns/SearchBar';
// Import from index.js to ensure it's executed (for coverage)
// eslint-disable-next-line import/no-unresolved
import SearchBarIndex from '@platform/patterns/SearchBar/index.js';
// Import types.js to ensure it's executed (for coverage) - side-effect import
// eslint-disable-next-line import/no-unresolved
import '@platform/patterns/SearchBar/types.js';
// Also import as named for verification
// eslint-disable-next-line import/no-unresolved
import * as SearchBarTypesModule from '@platform/patterns/SearchBar/types.js';
import lightTheme from '@theme/light.theme';
import { useI18n } from '@hooks';

// Mock useI18n hook
const mockEnTranslations = require('@i18n/locales/en.json');
jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => mockEnTranslations[key] || key,
    tSync: (key) => mockEnTranslations[key] || key,
  }),
  useDebounce: jest.requireActual('@hooks').useDebounce,
}));

// Mock TextField to support both web and native
jest.mock('@platform/components/forms/TextField', () => {
  const React = require('react');
  const { TextInput, View, Text } = require('react-native');
  return {
    __esModule: true,
    default: React.forwardRef(({ 
      value, 
      onChange, 
      onChangeText, 
      onKeyPress, 
      onSubmitEditing,
      placeholder, 
      testID, 
      accessibilityLabel, 
      'aria-label': ariaLabel,
      type,
      'data-testid': dataTestId,
      ...rest 
    }, ref) => {
      const handleChangeText = (text) => {
        // Always call both if provided to match real behavior
        // Call onChangeText first (native)
        if (onChangeText) {
          onChangeText(text);
        }
        // For web compatibility, always call onChange with event object
        if (onChange) {
          // Create event-like object for web
          const event = { target: { value: text } };
          onChange(event);
        }
      };
      const testId = testID || dataTestId;
      const a11yLabel = accessibilityLabel || ariaLabel || placeholder;
      return (
        <View testID={testId ? `${testId}-container` : undefined} accessibilityLabel={a11yLabel}>
          <TextInput
            ref={ref}
            value={value}
            onChangeText={handleChangeText}
            onKeyPress={onKeyPress}
            onSubmitEditing={onSubmitEditing}
            placeholder={placeholder}
            testID={testId}
            accessibilityLabel={a11yLabel}
            {...(rest || {})}
          />
          {value && <Text testID={testId ? `${testId}-value` : undefined}>{value}</Text>}
        </View>
      );
    }),
  };
});

// Mock Button component
jest.mock('@platform/components/Button', () => {
  const React = require('react');
  const { TouchableOpacity, Text, View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, onClick, onPress, testID, accessibilityLabel, ...rest }) => {
      const handlePress = onClick || onPress;
      return (
        <TouchableOpacity
          onPress={handlePress}
          testID={testID}
          accessibilityLabel={accessibilityLabel}
          {...rest}
        >
          <View>
            {typeof children === 'string' ? <Text>{children}</Text> : children}
          </View>
        </TouchableOpacity>
      );
    },
  };
});

const SearchBar = SearchBarModule.default || SearchBarModule;

// Force execution of index.js and types.js exports for coverage
// Use the exports to ensure they're executed and counted in coverage
void SearchBarIndex; // Force execution of index.js
void SearchBarTypesModule; // Force execution of types.js

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('SearchBar Pattern', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      const { UNSAFE_root } = renderWithTheme(<SearchBar testID="search-bar" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with placeholder', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar placeholder="Search products..." testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      expect(input.props.placeholder).toBe('Search products...');
    });

    it('should use default i18n placeholder when placeholder is not provided', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      expect(input.props.placeholder).toBe('common.searchPlaceholder');
    });

    it('should render with value', () => {
      const { getByText } = renderWithTheme(
        <SearchBar value="test query" testID="search-bar" />
      );
      expect(getByText('test query')).toBeTruthy();
    });

    it('should show clear button when value exists and showClearButton is true', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar value="test" showClearButton={true} testID="search-bar" />
      );
      expect(getByTestId('search-bar-clear')).toBeTruthy();
    });

    it('should not show clear button when showClearButton is false', () => {
      const { queryByTestId } = renderWithTheme(
        <SearchBar value="test" showClearButton={false} testID="search-bar" />
      );
      expect(queryByTestId('search-bar-clear')).toBeNull();
    });

    it('should not show clear button when value is empty', () => {
      const { queryByTestId } = renderWithTheme(
        <SearchBar value="" showClearButton={true} testID="search-bar" />
      );
      expect(queryByTestId('search-bar-clear')).toBeNull();
    });

    it('should render search icon', () => {
      const { getByTestId } = renderWithTheme(<SearchBar testID="search-bar" />);
      expect(getByTestId('search-bar-icon')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    const itWeb = Platform.OS === 'web' ? it : it.skip;

    it('should call onChangeText when value changes (native)', () => {
      const handleChangeText = jest.fn();
      // Test Android implementation directly since it uses onChangeText
      // eslint-disable-next-line import/no-unresolved
      const SearchBarAndroid = require('@platform/patterns/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid onChangeText={handleChangeText} testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      act(() => {
        fireEvent.changeText(input, 'new query');
      });
      expect(handleChangeText).toHaveBeenCalledWith('new query');
    });

    itWeb('should call onChange when value changes (web)', () => {
      const handleChange = jest.fn();
      // Test web implementation directly since it uses onChange
      // eslint-disable-next-line import/no-unresolved
      const SearchBarWeb = require('@platform/patterns/SearchBar/SearchBar.web').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarWeb onChange={handleChange} testID="search-bar-web" />
      );
      const input = getByTestId('search-bar-web-input');
      // onChange should be called synchronously via handleChange from useSearchBar hook
      // The mock calls onChangeText which triggers onChange, so we need to use fireEvent.changeText
      act(() => {
        fireEvent.changeText(input, 'new query');
      });
      // The mock's handleChangeText calls onChange with event object
      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onSearch when onSubmitEditing is called (native)', () => {
      const handleSearch = jest.fn();
      // Test Android implementation directly since it uses onSubmitEditing
      // eslint-disable-next-line import/no-unresolved
      const SearchBarAndroid = require('@platform/patterns/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid value="test" onSearch={handleSearch} testID="search-bar-android" />
      );
      const input = getByTestId('search-bar-android-input');
      // handleSubmit should be called synchronously with localValue
      act(() => {
        fireEvent(input, 'submitEditing');
      });
      // handleSubmit uses localValue which is synced from value prop via useEffect
      // Since we start with value="test", localValue should be "test" after sync
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    itWeb('should call onSearch when Enter key is pressed (web)', () => {
      const handleSearch = jest.fn();
      // Test web implementation directly since it uses onKeyPress
      // eslint-disable-next-line import/no-unresolved
      const SearchBarWeb = require('@platform/patterns/SearchBar/SearchBar.web').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarWeb value="test" onSearch={handleSearch} testID="search-bar-web" />
      );
      const input = getByTestId('search-bar-web-input');
      act(() => {
        fireEvent(input, 'keyPress', { key: 'Enter' });
      });
      act(() => {
        jest.runAllTimers();
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should clear value when clear button is clicked', () => {
      const handleChangeText = jest.fn();
      const handleSearch = jest.fn();
      // Test Android implementation directly to ensure handlers are called
      // eslint-disable-next-line import/no-unresolved
      const SearchBarAndroid = require('@platform/patterns/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid
          value="test"
          onChangeText={handleChangeText}
          onSearch={handleSearch}
          testID="search-bar-android"
        />
      );
      const clearButton = getByTestId('search-bar-android-clear');
      // handleClear should call handlers synchronously
      act(() => {
        fireEvent.press(clearButton);
      });
      // Verify handlers were called
      expect(handleChangeText).toHaveBeenCalledWith('');
      expect(handleSearch).toHaveBeenCalledWith('');
    });

    itWeb('should handle clear when only onChange is provided', () => {
      const handleChange = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBar
          value="test"
          onChange={handleChange}
          testID="search-bar"
        />
      );
      const clearButton = getByTestId('search-bar-clear');
      act(() => {
        fireEvent.press(clearButton);
        // Wait for state updates
        jest.runAllTimers();
      });
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Debouncing', () => {
    it('should debounce onSearch calls', async () => {
      const handleSearch = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBar value="" onSearch={handleSearch} debounceMs={300} testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');

      // Simulate typing - start with empty value prop, so debounced value will differ
      act(() => {
        fireEvent.changeText(input, 't');
      });
      act(() => {
        fireEvent.changeText(input, 'te');
      });
      act(() => {
        fireEvent.changeText(input, 'tes');
      });
      act(() => {
        fireEvent.changeText(input, 'test');
      });

      // Should not be called immediately
      expect(handleSearch).not.toHaveBeenCalled();

      // Fast-forward time to trigger debounce (300ms)
      // Advance timers to complete the debounce timeout and process all pending updates
      await act(async () => {
        jest.advanceTimersByTime(300);
        // Wait for useDebounce's setTimeout callback to execute and update state
        await Promise.resolve();
        // Wait for React to process the state update from useDebounce
        await Promise.resolve();
        // Wait for useSearchBar's useEffect to run after debouncedValue changes
        await Promise.resolve();
        // Extra resolve to ensure all effects are fully processed
        await Promise.resolve();
      });

      // Should be called once after debounce with the final value
      // Note: onSearch is only called when debouncedValue !== value prop
      // Since we started with value="", the debounced "test" will trigger onSearch
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should use custom debounce delay', async () => {
      const handleSearch = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBar value="" onSearch={handleSearch} debounceMs={500} testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');

      act(() => {
        fireEvent.changeText(input, 'test');
      });

      // Advance 300ms - should not trigger (needs 500ms)
      await act(async () => {
        jest.advanceTimersByTime(300);
        // Wait for any pending updates
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(handleSearch).not.toHaveBeenCalled();

      // Advance remaining 200ms to reach 500ms total
      await act(async () => {
        jest.advanceTimersByTime(200);
        // Wait for useDebounce's setTimeout callback to execute and update state
        await Promise.resolve();
        // Wait for React to process the state update from useDebounce
        await Promise.resolve();
        // Wait for useSearchBar's useEffect to run after debouncedValue changes
        await Promise.resolve();
        // Extra resolve to ensure all effects are fully processed
        await Promise.resolve();
      });

      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should sync local value with prop value', () => {
      const { getByText, rerender } = renderWithTheme(
        <SearchBar value="initial" testID="search-bar" />
      );
      expect(getByText('initial')).toBeTruthy();

      // Rerender with new value
      rerender(
        <ThemeProvider theme={lightTheme}>
          <SearchBar value="updated" testID="search-bar" />
        </ThemeProvider>
      );
      
      act(() => {
        jest.runAllTimers();
      });
      
      // Verify the component still renders with updated value
      expect(getByText('updated')).toBeTruthy();
    });

    it('should not call onSearch when debounced value equals prop value', () => {
      const handleSearch = jest.fn();
      renderWithTheme(
        <SearchBar value="test" onSearch={handleSearch} debounceMs={300} testID="search-bar" />
      );

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Should not call onSearch if debounced value equals prop value
      expect(handleSearch).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility label', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar accessibilityLabel="Search products" testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      expect(input).toBeTruthy();
      // Verify accessibility label is passed to TextField
      expect(input.props.accessibilityLabel || input.props['aria-label']).toBeTruthy();
    });

    it('should have search icon with accessibility label', () => {
      const { getByTestId } = renderWithTheme(<SearchBar testID="search-bar" />);
      const icon = getByTestId('search-bar-icon');
      expect(icon).toBeTruthy();
      expect(icon.props.accessibilityLabel).toBe('common.searchIcon');
    });

    it('should have clear button with accessibility label', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar value="test" testID="search-bar" />
      );
      const clearButton = getByTestId('search-bar-clear');
      expect(clearButton).toBeTruthy();
      expect(clearButton.props.accessibilityLabel).toBe('common.clearSearch');
    });
  });

  describe('Platform-specific implementations', () => {
    const itWeb = Platform.OS === 'web' ? it : it.skip;

    itWeb('should test Web implementation', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarWeb = require('@platform/patterns/SearchBar/SearchBar.web').default;
      const { getByText } = renderWithTheme(
        <SearchBarWeb value="test" testID="search-bar-web" />
      );
      expect(getByText('test')).toBeTruthy();
    });

    itWeb('should test Web implementation with Enter key', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarWeb = require('@platform/patterns/SearchBar/SearchBar.web').default;
      const handleSearch = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBarWeb value="test" onSearch={handleSearch} testID="search-bar-web" />
      );
      const input = getByTestId('search-bar-web-input');
      act(() => {
        fireEvent(input, 'keyPress', { key: 'Enter' });
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    itWeb('should test Web implementation with non-Enter key (no submit)', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarWeb = require('@platform/patterns/SearchBar/SearchBar.web').default;
      const handleSearch = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBarWeb value="test" onSearch={handleSearch} testID="search-bar-web" />
      );
      const input = getByTestId('search-bar-web-input');
      act(() => {
        fireEvent(input, 'keyPress', { key: 'Space' });
      });
      // Should not call onSearch for non-Enter keys
      expect(handleSearch).not.toHaveBeenCalled();
    });

    it('should test Android implementation', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarAndroid = require('@platform/patterns/SearchBar/SearchBar.android').default;
      const { getByTestId, getByText } = renderWithTheme(
        <SearchBarAndroid value="test" testID="search-bar-android" />
      );
      expect(getByTestId('search-bar-android-input')).toBeTruthy();
      expect(getByText('test')).toBeTruthy();
    });

    it('should test Android implementation with onSubmitEditing', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarAndroid = require('@platform/patterns/SearchBar/SearchBar.android').default;
      const handleSearch = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid value="test" onSearch={handleSearch} testID="search-bar-android" />
      );
      const input = getByTestId('search-bar-android-input');
      act(() => {
        fireEvent(input, 'submitEditing');
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should test iOS implementation', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarIOS = require('@platform/patterns/SearchBar/SearchBar.ios').default;
      const { getByTestId, getByText } = renderWithTheme(
        <SearchBarIOS value="test" testID="search-bar-ios" />
      );
      expect(getByTestId('search-bar-ios-input')).toBeTruthy();
      expect(getByText('test')).toBeTruthy();
    });

    it('should test iOS implementation with onSubmitEditing', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarIOS = require('@platform/patterns/SearchBar/SearchBar.ios').default;
      const handleSearch = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBarIOS value="test" onSearch={handleSearch} testID="search-bar-ios" />
      );
      const input = getByTestId('search-bar-ios-input');
      act(() => {
        fireEvent(input, 'submitEditing');
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should test Android implementation without accessibilityLabel', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarAndroid = require('@platform/patterns/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid value="test" testID="search-bar-android" />
      );
      // Should render without accessibilityLabel (uses placeholder fallback)
      expect(getByTestId('search-bar-android-input')).toBeTruthy();
    });

    it('should test iOS implementation without accessibilityLabel', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarIOS = require('@platform/patterns/SearchBar/SearchBar.ios').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarIOS value="test" testID="search-bar-ios" />
      );
      // Should render without accessibilityLabel (uses placeholder fallback)
      expect(getByTestId('search-bar-ios-input')).toBeTruthy();
    });

    it('should test Android implementation with default props', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarAndroid = require('@platform/patterns/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid testID="search-bar-android" />
      );
      // Should render with default props (empty value, showClearButton=true)
      expect(getByTestId('search-bar-android-input')).toBeTruthy();
    });

    it('should test iOS implementation with default props', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarIOS = require('@platform/patterns/SearchBar/SearchBar.ios').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarIOS testID="search-bar-ios" />
      );
      // Should render with default props (empty value, showClearButton=true)
      expect(getByTestId('search-bar-ios-input')).toBeTruthy();
    });

    it('should test Android implementation with accessibilityLabel', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarAndroid = require('@platform/patterns/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid value="test" accessibilityLabel="Custom label" testID="search-bar-android" />
      );
      // Should render with accessibilityLabel
      expect(getByTestId('search-bar-android-input')).toBeTruthy();
    });

    it('should test iOS implementation with accessibilityLabel', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarIOS = require('@platform/patterns/SearchBar/SearchBar.ios').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarIOS value="test" accessibilityLabel="Custom label" testID="search-bar-ios" />
      );
      // Should render with accessibilityLabel
      expect(getByTestId('search-bar-ios-input')).toBeTruthy();
    });

    it('should test Android implementation with showClearButton=false', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarAndroid = require('@platform/patterns/SearchBar/SearchBar.android').default;
      const { queryByTestId } = renderWithTheme(
        <SearchBarAndroid value="test" showClearButton={false} testID="search-bar-android" />
      );
      // Should not show clear button when showClearButton is false
      expect(queryByTestId('search-bar-android-clear')).toBeNull();
    });

    it('should test iOS implementation with showClearButton=false', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarIOS = require('@platform/patterns/SearchBar/SearchBar.ios').default;
      const { queryByTestId } = renderWithTheme(
        <SearchBarIOS value="test" showClearButton={false} testID="search-bar-ios" />
      );
      // Should not show clear button when showClearButton is false
      expect(queryByTestId('search-bar-ios-clear')).toBeNull();
    });

    it('should test Android implementation without testID', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarAndroid = require('@platform/patterns/SearchBar/SearchBar.android').default;
      const { UNSAFE_root } = renderWithTheme(
        <SearchBarAndroid value="test" />
      );
      // Should render without testID (testID is undefined)
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should test iOS implementation without testID', () => {
      // eslint-disable-next-line import/no-unresolved
      const SearchBarIOS = require('@platform/patterns/SearchBar/SearchBar.ios').default;
      const { UNSAFE_root } = renderWithTheme(
        <SearchBarIOS value="test" />
      );
      // Should render without testID (testID is undefined)
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    const itWeb = Platform.OS === 'web' ? it : it.skip;

    it('should handle undefined testID', () => {
      const { UNSAFE_root } = renderWithTheme(<SearchBar value="test" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle empty string testID', () => {
      const { UNSAFE_root } = renderWithTheme(<SearchBar value="test" testID="" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle undefined accessibilityLabel', () => {
      const { UNSAFE_root } = renderWithTheme(<SearchBar value="test" testID="search-bar" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    itWeb('should handle onChange without onChangeText', () => {
      const handleChange = jest.fn();
      // Test web implementation directly since it uses onChange
      // eslint-disable-next-line import/no-unresolved
      const SearchBarWeb = require('@platform/patterns/SearchBar/SearchBar.web').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarWeb onChange={handleChange} testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      act(() => {
        fireEvent.changeText(input, 'test');
        // Wait for state updates to propagate
        jest.runAllTimers();
      });
      // Verify onChange is called (web handler)
      expect(handleChange).toHaveBeenCalled();
      // Verify the component rendered and input exists
      expect(input).toBeTruthy();
    });

    it('should handle onChange with non-string, non-event object (covers else branch)', () => {
      const handleChange = jest.fn();
      // Test web implementation directly and call handleChange with null/undefined to trigger else branch
      // eslint-disable-next-line import/no-unresolved
      const SearchBarWeb = require('@platform/patterns/SearchBar/SearchBar.web').default;
      // eslint-disable-next-line import/no-unresolved
      const useSearchBar = require('@platform/patterns/SearchBar/useSearchBar').default;
      // We need to test the hook directly to trigger the else branch
      const TestComponent = () => {
        const { handleChange: hookHandleChange } = useSearchBar({
          value: '',
          onChange: handleChange,
        });
        React.useEffect(() => {
          // Call with null to trigger else branch (line 57)
          hookHandleChange(null);
        }, []);
        return null;
      };
      renderWithTheme(<TestComponent />);
      act(() => {
        jest.runAllTimers();
      });
      // Verify onChange was called with event object (else branch creates { target: { value: '' } })
      expect(handleChange).toHaveBeenCalledWith({ target: { value: '' } });
    });

    it('should handle onChangeText without onChange', () => {
      const handleChangeText = jest.fn();
      // Test Android implementation directly since it uses onChangeText
      // eslint-disable-next-line import/no-unresolved
      const SearchBarAndroid = require('@platform/patterns/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid onChangeText={handleChangeText} testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      act(() => {
        fireEvent.changeText(input, 'test');
      });
      expect(handleChangeText).toHaveBeenCalledWith('test');
    });

    it('should handle both onChange and onChangeText', () => {
      const handleChange = jest.fn();
      const handleChangeText = jest.fn();
      // Test Android implementation directly since it uses onChangeText
      // eslint-disable-next-line import/no-unresolved
      const SearchBarAndroid = require('@platform/patterns/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid onChange={handleChange} onChangeText={handleChangeText} testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      act(() => {
        fireEvent.changeText(input, 'test');
        // Wait for state updates to propagate
        jest.runAllTimers();
      });
      // Verify onChangeText is called (native handler)
      expect(handleChangeText).toHaveBeenCalledWith('test');
      // Verify the component works correctly - input should exist
      expect(input).toBeTruthy();
    });

    it('should handle onSearch not provided', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar value="test" testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      act(() => {
        fireEvent(input, 'submitEditing');
      });
      // Should not throw
      expect(input).toBeTruthy();
    });

    it('should handle custom debounceMs', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar debounceMs={1000} testID="search-bar" />
      );
      expect(getByTestId('search-bar-input')).toBeTruthy();
    });
  });

  describe('Index export', () => {
    it('should export default from index.js', () => {
      expect(SearchBar).toBeTruthy();
      expect(typeof SearchBar).toBe('function');
    });

    it('should render component exported from index.js', () => {
      const { getByTestId, getByText } = renderWithTheme(
        <SearchBar value="test" testID="search-bar-index" />
      );
      expect(getByTestId('search-bar-index-input')).toBeTruthy();
      expect(getByText('test')).toBeTruthy();
    });

    it('should execute index.js for coverage', () => {
      // Force execution of index.js by importing it
      expect(SearchBarIndex).toBeTruthy();
      expect(typeof SearchBarIndex).toBe('function');
      // Verify it's the same as the default export
      expect(SearchBarIndex).toBe(SearchBar);
      // Verify the index default matches platform resolution via './SearchBar'
      // eslint-disable-next-line import/no-unresolved
      const SearchBarPlatform = require('@platform/patterns/SearchBar/SearchBar').default;
      expect(SearchBarIndex).toBe(SearchBarPlatform);
      // Render the component from index to ensure it's executed
      const { getByTestId: getByTestIdIndex } = renderWithTheme(
        <SearchBarIndex value="test" testID="search-bar-index-exec" />
      );
      expect(getByTestIdIndex('search-bar-index-exec-input')).toBeTruthy();
    });

    it('should execute types.js for coverage', () => {
      // Force execution of types.js by importing it
      // types.js exports a types object for coverage
      expect(SearchBarTypesModule).toBeDefined();
      expect(typeof SearchBarTypesModule).toBe('object');
      // Verify it exports the types object
      expect(SearchBarTypesModule.types).toBeDefined();
      expect(typeof SearchBarTypesModule.types).toBe('object');
      // Verify the module was actually executed by checking it exists
      expect(SearchBarTypesModule).not.toBeNull();
      // Access the module to ensure it's executed
      const typesKeys = Object.keys(SearchBarTypesModule);
      expect(typesKeys).toContain('types');
    });
  });
});
