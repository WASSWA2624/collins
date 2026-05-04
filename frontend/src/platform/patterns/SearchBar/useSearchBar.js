/**
 * useSearchBar Hook
 * Shared logic for SearchBar pattern across all platforms
 * File: useSearchBar.js
 */

import { useState, useEffect } from 'react';
import { useDebounce } from '@hooks';

/**
 * Hook for SearchBar component logic
 * @param {Object} params - Hook parameters
 * @param {string} params.value - Initial search value
 * @param {Function} params.onChange - Change handler (web)
 * @param {Function} params.onChangeText - Change handler (native)
 * @param {Function} params.onSearch - Search handler (called on debounced value change)
 * @param {number} params.debounceMs - Debounce delay in milliseconds
 * @returns {Object} SearchBar state and handlers
 */
const useSearchBar = ({
  value = '',
  onChange,
  onChangeText,
  onSearch,
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, debounceMs);
  const hasValue = localValue.length > 0;

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Trigger onSearch when debounced value changes
  // Call onSearch when debounced value changes and differs from initial prop value
  useEffect(() => {
    if (onSearch && debouncedValue !== undefined && debouncedValue !== value) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch, value]);

  const handleChange = (e) => {
    const newValue = e?.target?.value ?? e ?? '';
    setLocalValue(newValue);
    // Always call onChange if provided (web)
    if (onChange) {
      // If e is already an event object with target, pass it through
      // Otherwise, if it's a string, pass the string directly (test expectation)
      // Otherwise, create an event object
      if (e && typeof e === 'object' && 'target' in e) {
        onChange(e);
      } else if (typeof e === 'string') {
        onChange(e);
      } else {
        onChange({ target: { value: newValue } });
      }
    }
    // Always call onChangeText if provided (native)
    if (onChangeText && typeof newValue === 'string') {
      onChangeText(newValue);
    }
  };

  const handleChangeText = (newValue) => {
    setLocalValue(newValue);
    if (onChangeText) {
      onChangeText(newValue);
    }
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };

  const handleClear = () => {
    setLocalValue('');
    if (onChange) {
      onChange({ target: { value: '' } });
    }
    if (onChangeText) {
      onChangeText('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSubmit = (currentValue = localValue) => {
    if (onSearch) {
      onSearch(currentValue);
    }
  };

  return {
    localValue,
    hasValue,
    handleChange,
    handleChangeText,
    handleClear,
    handleSubmit,
  };
};

export default useSearchBar;

