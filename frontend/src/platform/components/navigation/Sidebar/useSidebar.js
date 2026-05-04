/**
 * useSidebar Hook
 * Shared logic for Sidebar component
 * File: useSidebar.js
 */
import { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { SIDE_MENU_ITEMS } from '@config/sideMenu';

/**
 * Sidebar hook
 * @param {Object} options - Hook options
 * @param {Array} options.items - Navigation items
 * @param {string} options.pathname - Current pathname
 * @param {Function} options.onItemPress - Item press handler
 * @param {Function} options.isItemVisible - Function to check item visibility (optional)
 * @returns {Object} Sidebar state and handlers
 */
const useSidebar = ({
  items = [],
  pathname,
  onItemPress,
  isItemVisible,
} = {}) => {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState({});
  const currentPathname = usePathname();
  const activePathname = pathname || currentPathname;

  const isItemActive = (item) => {
    if (!item.href) return false;
    return activePathname === item.href || activePathname.startsWith(item.href + '/');
  };

  const defaultIsItemVisible = (item) => {
    // If custom visibility function provided, use it
    if (isItemVisible) {
      return isItemVisible(item);
    }
    // Default: all items visible
    return true;
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleItemPress = (item) => {
    if (onItemPress) {
      onItemPress(item);
      return;
    }
    if (item?.href) {
      router.push(item.href);
      return;
    }
    if (item?.onPress) {
      item.onPress(item);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(defaultIsItemVisible);
  }, [items, isItemVisible]);

  return {
    pathname: activePathname,
    expandedSections,
    filteredItems,
    isItemActive,
    toggleSection,
    handleItemPress,
  };
};

export default useSidebar;

/** Sidebar items for native (labels resolved via t('navigation.items.main.<id>') in component). */
export const sidebarMenu = SIDE_MENU_ITEMS.map((it) => ({
  id: it.id,
  icon: it.icon,
  href: it.path || it.href,
}));

