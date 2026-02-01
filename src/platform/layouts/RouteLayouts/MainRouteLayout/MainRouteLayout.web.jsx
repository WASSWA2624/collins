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

// 3. Hooks & utilities
import useMainRouteLayout from './useMainRouteLayout';
import useMainRouteLayoutWebShell from './useMainRouteLayoutWebShell';
import { getMenuIconGlyph } from '@config/sideMenu';

// 4. Styles
import {
  StyledHeaderAppName,
  StyledHeaderBrand,
  StyledHeaderLeading,
  StyledHeaderLogo,
  StyledMain,
  StyledMenuToggleButton,
  StyledSidebarBackdrop,
  StyledSidebarResizeHandle,
} from './MainRouteLayout.web.styles';

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

  const headerLeadingSlot = useMemo(
    () => (
      <StyledHeaderLeading>
        <StyledMenuToggleButton
          type="button"
          onClick={toggleSidebar}
          aria-label={t('common.toggleMenu')}
          data-testid="main-header-toggle-menu"
        >
          <Icon glyph={getMenuIconGlyph('menu-outline')} size="md" decorative />
        </StyledMenuToggleButton>
        <StyledHeaderBrand href="/" onClick={(e) => e.preventDefault()}>
          <StyledHeaderLogo aria-hidden="true">
            <Icon glyph={getMenuIconGlyph('medkit-outline')} size="md" decorative />
          </StyledHeaderLogo>
          <StyledHeaderAppName>{t('app.name')}</StyledHeaderAppName>
        </StyledHeaderBrand>
      </StyledHeaderLeading>
    ),
    [t, toggleSidebar]
  );

  return (
    <AppFrame
      header={
        <GlobalHeader
          title={t('navigation.mainNavigation')}
          leadingSlot={headerLeadingSlot}
          accessibilityLabel={t('navigation.header.title')}
          testID="main-header"
          actions={[]}
        />
      }
      sidebarBackdrop={
        !sidebarCollapsed ? (
          <StyledSidebarBackdrop
            onClick={toggleSidebar}
            onKeyDown={(e) => e.key === 'Escape' && toggleSidebar()}
            role="button"
            tabIndex={0}
            aria-label={t('common.toggleMenu')}
          />
        ) : null
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
