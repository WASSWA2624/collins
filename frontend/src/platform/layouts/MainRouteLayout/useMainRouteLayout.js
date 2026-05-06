/**
 * useMainRouteLayout
 * Shared logic for MainRouteLayout (items + visibility + loading)
 * File: useMainRouteLayout.js
 */
import { useMemo } from 'react';
import { useI18n, useNavigationVisibility, useUiState } from '@hooks';
import { MAIN_NAV_ITEMS, MOBILE_TAB_ITEMS } from '@config/sideMenu';

const mapNavigationItem = (item, t) => ({
  ...item,
  href: item.path,
  label: t(`navigation.items.main.${item.id}`),
  icon: item.icon,
});

export default function useMainRouteLayout() {
  const { t } = useI18n();
  const { isLoading } = useUiState();
  const { isItemVisible } = useNavigationVisibility();

  const items = useMemo(
    () => MAIN_NAV_ITEMS.map((item) => mapNavigationItem(item, t)),
    [t]
  );

  const tabItems = useMemo(
    () => MOBILE_TAB_ITEMS.map((item) => mapNavigationItem(item, t)),
    [t]
  );

  return {
    t,
    isLoading,
    items,
    tabItems,
    isItemVisible,
  };
}
