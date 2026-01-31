/**
 * MainRouteLayout Component - Web
 * Minimal navigation skeleton for main workflow routes.
 * File: MainRouteLayout.web.jsx
 */
// 1. External dependencies
import React, { useMemo } from 'react';
import { Slot } from 'expo-router';

// 2. Platform components
import {
  GlobalHeader,
  GlobalFooter,
  Icon,
  LoadingOverlay,
  NoticeSurface,
  Sidebar,
} from '@platform/components';
import { ACTION_PLACEMENTS, ACTION_VARIANTS } from '@platform/components/navigation/GlobalHeader';

// 3. Hooks & utilities
import useMainRouteLayout from './useMainRouteLayout';
import useMainRouteLayoutWebShell from './useMainRouteLayoutWebShell';
import { getMenuIconGlyph } from '@config/sideMenu';

// 4. Styles
import { StyledMain, StyledSidebarResizeHandle } from './MainRouteLayout.web.styles';

// 5. Platform layouts
import AppFrame from '@platform/layouts/AppFrame';

const MainRouteLayoutWeb = () => {
  const { t, isLoading, items, isItemVisible } = useMainRouteLayout();
  const { sidebarCollapsed, sidebarWidth, collapsedWidth, toggleSidebar, resizerProps } =
    useMainRouteLayoutWebShell();

  const overlaySlot = useMemo(
    () => (isLoading ? <LoadingOverlay visible testID="main-loading-overlay" /> : null),
    [isLoading]
  );

  const headerActions = useMemo(() => {
    return [
      {
        id: 'toggle-menu',
        placement: ACTION_PLACEMENTS.SECONDARY,
        variant: ACTION_VARIANTS.GHOST,
        icon: <Icon glyph={getMenuIconGlyph('menu-outline')} size="md" decorative />,
        accessibilityLabel: t('common.toggleMenu'),
        onPress: toggleSidebar,
        testID: 'main-header-toggle-menu',
        isCircular: true,
      },
    ];
  }, [t, toggleSidebar]);

  return (
    <AppFrame
      header={
        <GlobalHeader
          title={t('navigation.mainNavigation')}
          accessibilityLabel={t('navigation.header.title')}
          testID="main-header"
          actions={headerActions}
        />
      }
      sidebar={
        <>
          <Sidebar
            accessibilityLabel={t('navigation.sidebar.title')}
            items={items}
            isItemVisible={isItemVisible}
            collapsed={sidebarCollapsed}
            footerSlot={null}
            testID="main-sidebar"
          />
          {!sidebarCollapsed ? (
            <StyledSidebarResizeHandle
              role="separator"
              aria-orientation="vertical"
              aria-label={t('navigation.sidebar.resize')}
              tabIndex={0}
              testID="main-sidebar-resizer"
              data-testid="main-sidebar-resizer"
              {...resizerProps}
            />
          ) : null}
        </>
      }
      footer={<GlobalFooter testID="main-footer" />}
      overlay={overlaySlot}
      notices={<NoticeSurface testID="main-notice-surface" />}
      sidebarWidth={sidebarWidth}
      sidebarCollapsed={sidebarCollapsed}
      collapsedWidth={collapsedWidth}
      accessibilityLabel={t('navigation.mainNavigation')}
      testID="main-route-layout"
    >
      <StyledMain>
        <Slot />
      </StyledMain>
    </AppFrame>
  );
};

export default MainRouteLayoutWeb;
