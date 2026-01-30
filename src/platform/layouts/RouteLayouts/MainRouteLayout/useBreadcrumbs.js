/**
 * useBreadcrumbs Hook
 * Extracts breadcrumb items from current route path with navigation item integration
 * File: useBreadcrumbs.js
 */

import { useMemo } from 'react';
import { usePathname } from 'expo-router';
import { useI18n } from '@hooks';

/**
 * Recursively searches navigation items to find a matching route
 * @param {Array} items - Navigation items to search
 * @param {string} path - Path to match
 * @returns {Object|null} Matching navigation item or null
 */
const findNavigationItem = (items, path) => {
  if (!items || !Array.isArray(items)) return null;

  for (const item of items) {
    // Exact match
    if (item.href === path) {
      return item;
    }

    // Check if path starts with item href (nested route)
    if (item.href && path.startsWith(item.href + '/')) {
      // Check children for more specific match
      if (item.children && item.children.length > 0) {
        const childMatch = findNavigationItem(item.children, path);
        if (childMatch) return childMatch;
      }
      // Return parent if no child match
      return item;
    }

    // Recursively check children
    if (item.children && item.children.length > 0) {
      const childMatch = findNavigationItem(item.children, path);
      if (childMatch) return childMatch;
    }
  }

  return null;
};

/**
 * Formats a segment name into a readable label
 * @param {string} segment - Route segment
 * @param {Function} t - Translation function
 * @returns {string} Formatted label
 */
const formatSegmentLabel = (segment, t) => {
  // Try translation first
  const labelKey = `navigation.breadcrumbs.${segment}`;
  const translatedLabel = t(labelKey);
  if (translatedLabel !== labelKey) {
    return translatedLabel;
  }

  // Try common route name translations
  const commonKey = `navigation.routes.${segment}`;
  const commonTranslated = t(commonKey);
  if (commonTranslated !== commonKey) {
    return commonTranslated;
  }

  // Fallback: format segment (kebab-case to Title Case)
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generates breadcrumb items from pathname with navigation item integration
 * @param {Array} navigationItems - Navigation items from usePrimaryNavigation
 * @returns {Array} Breadcrumb items
 */
const useBreadcrumbs = (navigationItems = []) => {
  const pathname = usePathname();
  const { t } = useI18n();

  const breadcrumbItems = useMemo(() => {
    if (!pathname || pathname === '/') {
      // Don't show breadcrumbs on home page
      return [];
    }

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      return [];
    }

    const items = [];

    // Always include home
    items.push({ label: t('app.name'), href: '/', icon: '🏠' });

    // Build breadcrumbs from segments
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Try to find matching navigation item
      const navItem = findNavigationItem(navigationItems, currentPath);
      
      // Use navigation item label if found, otherwise format segment
      const label = navItem?.label || formatSegmentLabel(segment, t);
      const icon = navItem?.icon || null;

      items.push({
        label,
        href: isLast ? null : currentPath, // Last item is not clickable
        icon,
      });
    });

    return items;
  }, [pathname, navigationItems, t]);

  return breadcrumbItems;
};

export default useBreadcrumbs;
