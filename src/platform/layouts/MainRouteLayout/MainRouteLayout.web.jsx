/**
 * MainRouteLayout Component - Web
 * Minimal navigation skeleton for main workflow routes.
 * File: MainRouteLayout.web.jsx
 */
// 1. External dependencies
import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { Slot } from 'expo-router';
import breakpoints from '@theme/breakpoints';

// 2. Platform components
import {
  GlobalHeader,
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
  StyledAppNameFull,
  StyledAppNameShort,
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
  const { width } = useWindowDimensions();
  const isMobile = width < breakpoints.tablet;
  const { t, isLoading, items, isItemVisible } = useMainRouteLayout();
  const { sidebarCollapsed, sidebarWidth, collapsedWidth, toggleSidebar, resizerProps } =
    useMainRouteLayoutWebShell();
  const sidebarOnClose = isMobile ? toggleSidebar : undefined;

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

  const headerTitle = (
    <>
      <StyledAppNameShort>{t('app.shortName')}</StyledAppNameShort>
      <StyledAppNameFull>{t('app.name')}</StyledAppNameFull>
    </>
  );

  return (
    <AppFrame
      header={
        <GlobalHeader
          title={headerTitle}
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
            onClose={sidebarOnClose}
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
      footer={null}
      overlay={overlaySlot}
      notices={<NoticeSurface testID="main-notice-surface" />}
      sidebarWidth={sidebarWidth}
      sidebarCollapsed={sidebarCollapsed}
      collapsedWidth={collapsedWidth}
      accessibilityLabel={t('navigation.header.title')}
      testID="main-route-layout"
    >
      <StyledMain>
        <Slot />
      </StyledMain>
    </AppFrame>
  );
};

export default MainRouteLayoutWeb;
