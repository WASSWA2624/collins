/**
 * useDebounce Hook
 * Debounces a value by a specified delay (ms).
 * File: useDebounce.js
 */
import { useEffect, useState } from 'react';

const useDebounce = (value, delayMs) => {
  const delay = Number.isFinite(delayMs) && delayMs >= 0 ? delayMs : 0;
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;

