/**
 * MainRouteLayout Component - Web
 * Reusable route layout for authenticated/main app routes on Web
 * File: MainRouteLayout.web.jsx
 *
 * Per component-structure.mdc: Reusable layout components belong in platform/layouts/
 * Per app-router.mdc: Route layouts handle authentication guards
 * Per project-structure.mdc: One file = one responsibility; composition over inheritance
 */

import React, { useMemo } from 'react';
import { Slot } from 'expo-router';
import { useAuthGuard } from '@navigation/guards';
import AppFrame from '../../AppFrame';
import {
  GlobalHeader,
  Icon,
  NoticeSurface,
  Sidebar,
} from '@platform/components';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';
import { useHeaderActions } from './useMainLayoutMemo';
import useMainRouteLayoutWeb from './useMainRouteLayoutWeb';
import Brand from './Brand';
import HamburgerIcon from './HamburgerIcon';
import HeaderUtility from './HeaderUtility';
import MobileSidebar from './MobileSidebar';
import {
  StyledHeaderRevealButton,
  StyledSidebarResizeHandle,
  StyledSidebarWrapper,
} from './MainRouteLayout.web.styles';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH } from './types';

const MainRouteLayoutWeb = () => {
  useAuthGuard();
  const layout = useMainRouteLayoutWeb();
  const {
    t,
    mainItems,
    isItemVisible,
    overlaySlot,
    resolvedSidebarWidth,
    isSidebarCollapsed,
    isMobile,
    isHeaderHidden,
    isMobileSidebarOpen,
    authHeaderActions,
    handleToggleSidebar,
    handleShowHeader,
    handleResizeStart,
    handleResizeKeyDown,
    handleMobileOverlayKeyDown,
    closeButtonRef,
    mobileSidebarRef,
  } = layout;

  const hamburgerIcon = useMemo(() => <HamburgerIcon />, []);
  const headerActions = useHeaderActions(
    authHeaderActions,
    hamburgerIcon,
    handleToggleSidebar,
    t
  );
  const brandTitle = useMemo(
    () => (
      <Brand
        appName={t('app.name')}
        appShortName={t('app.shortName')}
      />
    ),
    [t]
  );

  const headerSlot = isHeaderHidden ? null : (
    <GlobalHeader
      title={brandTitle}
      accessibilityLabel={t('navigation.header.title')}
      testID="main-header"
      actions={headerActions}
      utilitySlot={<HeaderUtility {...layout} />}
    />
  );

  const sidebarSlot = (
    <StyledSidebarWrapper>
      <Sidebar
        accessibilityLabel={t('navigation.sidebar.title')}
        items={mainItems}
        isItemVisible={isItemVisible}
        collapsed={isSidebarCollapsed}
        footerSlot={null}
        testID="main-sidebar"
      />
      {!isMobile && !isSidebarCollapsed ? (
        <StyledSidebarResizeHandle
          role="slider"
          aria-orientation="vertical"
          aria-label={t('navigation.sidebar.resize')}
          aria-valuemin={SIDEBAR_MIN_WIDTH}
          aria-valuemax={SIDEBAR_MAX_WIDTH}
          aria-valuenow={resolvedSidebarWidth}
          tabIndex={0}
          onMouseDown={handleResizeStart}
          onKeyDown={handleResizeKeyDown}
        />
      ) : null}
    </StyledSidebarWrapper>
  );

  return (
    <>
      <AppFrame
        sidebar={sidebarSlot}
        header={headerSlot}
        footer={
          <GlobalFooter
            variant={FOOTER_VARIANTS.MAIN}
            accessibilityLabel={t('navigation.footer.title')}
            testID="main-footer"
          />
        }
        overlay={overlaySlot}
        notices={<NoticeSurface testID="main-notice-surface" />}
        sidebarCollapsed={isSidebarCollapsed}
        sidebarWidth={resolvedSidebarWidth}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
        accessibilityLabel={t('navigation.mainNavigation')}
        testID="main-route-layout"
      >
        <Slot />
      </AppFrame>
      {isHeaderHidden ? (
        <StyledHeaderRevealButton
          variant="outline"
          size="small"
          onPress={handleShowHeader}
          accessibilityLabel={t('navigation.header.showHeader')}
          testID="main-header-reveal"
        >
          <Icon glyph="˅" decorative accessibilityLabel={t('navigation.header.showHeader')} />
        </StyledHeaderRevealButton>
      ) : null}
      {isMobile ? (
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={layout.handleCloseMobileSidebar}
          onKeyDown={handleMobileOverlayKeyDown}
          sidebarLabel={t('navigation.sidebar.title')}
          closeLabel={t('common.close')}
          mainItems={mainItems}
          isItemVisible={isItemVisible}
          closeButtonRef={closeButtonRef}
          panelRef={mobileSidebarRef}
        />
      ) : null}
    </>
  );
};

export default MainRouteLayoutWeb;
