/**
 * useTheme Hook
 * Store-backed theme resolver for UI logic.
 * File: useTheme.js
 */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from '@store/selectors';
import { getTheme } from '@theme';

const useTheme = () => {
  const themeMode = useSelector(selectTheme);

  // Stable reference as long as `themeMode` doesn't change.
  return useMemo(() => getTheme(themeMode), [themeMode]);
};

export default useTheme;

