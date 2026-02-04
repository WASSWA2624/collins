/**
 * useNavigationVisibility Hook
 * Visibility for nav items (used with items from config/sideMenu).
 * File: useNavigationVisibility.js
 */
import { useCallback } from 'react';

/**
 * @returns {Object} isItemVisible(item) - true when item is truthy (sidebar/tab bar always show nav items)
 */
const useNavigationVisibility = () => {
  const isItemVisible = useCallback((item) => Boolean(item), []);
  return { isItemVisible };
};

export default useNavigationVisibility;
