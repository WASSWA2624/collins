/**
 * useMainRouteLayout
 * Shared logic for MainRouteLayout (items + visibility + loading)
 * File: useMainRouteLayout.js
 */
import { useMemo } from 'react';
import { useI18n, useNavigationVisibility, useUiState } from '@hooks';
import { MAIN_NAV_ITEMS } from '@config/sideMenu';

export default function useMainRouteLayout() {
  const { t } = useI18n();
  const { isLoading } = useUiState();
  const { isItemVisible } = useNavigationVisibility();

  const items = useMemo(
    () =>
      MAIN_NAV_ITEMS.map((it) => ({
        ...it,
        href: it.path,
        label: t(`navigation.items.main.${it.id}`),
        icon: it.icon,
      })),
    [t]
  );

  return {
    t,
    isLoading,
    items,
    isItemVisible,
  };
}
