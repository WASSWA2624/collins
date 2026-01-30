/**
 * useMainLayoutMemo Hook
 * Memoization utilities for MainRouteLayout to reduce unnecessary re-renders
 * File: useMainLayoutMemo.js
 */

import { useMemo } from 'react';
import { ACTION_PLACEMENTS, ACTION_VARIANTS } from '@platform/components/navigation/GlobalHeader/types';

/**
 * Memoizes header actions array
 * @param {Array} authHeaderActions - Authentication header actions
 * @param {Object} hamburgerIcon - Hamburger icon component
 * @param {Function} handleToggleSidebar - Toggle sidebar handler
 * @param {Function} t - Translation function
 * @returns {Array} Memoized header actions
 */
export const useHeaderActions = (authHeaderActions, hamburgerIcon, handleToggleSidebar, t) => {
  return useMemo(
    () => [
      {
        id: 'toggle-sidebar',
        label: null,
        icon: hamburgerIcon,
        onPress: handleToggleSidebar,
        placement: ACTION_PLACEMENTS.SECONDARY,
        variant: ACTION_VARIANTS.GHOST,
        accessibilityLabel: t('common.toggleMenu'),
        isCircular: false,
      },
      ...authHeaderActions,
    ],
    [hamburgerIcon, authHeaderActions, handleToggleSidebar, t]
  );
};

/**
 * Memoizes notification items with unread count
 * @param {Array} notificationItems - Raw notification items
 * @returns {Object} Memoized notification items and unread count
 */
export const useNotificationData = (notificationItems) => {
  const unreadCount = useMemo(
    () => notificationItems.filter((item) => item.unread).length,
    [notificationItems]
  );

  const memoizedItems = useMemo(() => notificationItems, [notificationItems]);

  return { notificationItems: memoizedItems, unreadCount };
};

/**
 * Memoizes filtered navigation items
 * @param {Array} mainItems - All navigation items
 * @param {Function} isItemVisible - Visibility check function
 * @returns {Array} Filtered and memoized navigation items
 */
export const useFilteredNavigationItems = (mainItems, isItemVisible) => {
  return useMemo(
    () => mainItems.filter((item) => isItemVisible(item)),
    [mainItems, isItemVisible]
  );
};

/**
 * Memoizes header customization items
 * @param {Function} t - Translation function
 * @returns {Array} Memoized header customization items
 */
export const useHeaderCustomizationItems = (t) => {
  return useMemo(
    () => [
      { id: 'notifications', label: t('navigation.header.actions.notifications') },
      { id: 'network', label: t('navigation.header.actions.network') },
      { id: 'database', label: t('navigation.header.actions.database') },
      { id: 'fullscreen', label: t('navigation.header.actions.fullscreen') },
    ],
    [t]
  );
};
