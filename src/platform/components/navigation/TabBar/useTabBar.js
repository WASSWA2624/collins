/**
 * useTabBar Hook
 * Shared logic for TabBar component
 * File: useTabBar.js
 */
import { useMemo } from 'react';
import { usePathname } from 'expo-router';

/**
 * TabBar hook
 * @param {Object} options - Hook options
 * @param {Array} options.items - Tab items
 * @param {string} options.pathname - Current pathname
 * @param {Function} options.onTabPress - Tab press handler
 * @param {Function} options.isTabVisible - Function to check tab visibility (optional)
 * @returns {Object} TabBar state and handlers
 */
const useTabBar = ({
  items = [],
  pathname,
  onTabPress,
  isTabVisible,
} = {}) => {
  const currentPathname = usePathname();
  const activePathname = pathname || currentPathname;

  const isTabActive = (item) => {
    if (!item.href) return false;
    // Root tab should remain active for nested paths (e.g. "/" active for "/settings")
    if (item.href === '/') return String(activePathname || '').startsWith('/');
    return activePathname === item.href || activePathname.startsWith(item.href + '/');
  };

  const defaultIsTabVisible = (item) => {
    // If custom visibility function provided, use it
    if (isTabVisible) {
      return isTabVisible(item);
    }
    // Default: all tabs visible
    return true;
  };

  const handleTabPress = (item) => {
    if (onTabPress) {
      onTabPress(item);
    } else if (item.onPress) {
      item.onPress(item);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(defaultIsTabVisible);
  }, [items, isTabVisible]);

  return {
    pathname: activePathname,
    filteredItems,
    isTabActive,
    handleTabPress,
  };
};

export default useTabBar;

