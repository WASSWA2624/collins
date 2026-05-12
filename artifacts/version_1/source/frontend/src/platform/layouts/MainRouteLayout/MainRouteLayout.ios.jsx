/**
 * MainRouteLayout Component - iOS
 * Minimal navigation skeleton for main workflow routes.
 * File: MainRouteLayout.ios.jsx
 */
// 1. External dependencies
import React, { useCallback, useMemo } from 'react';
import { Modal } from 'react-native';
import { Slot, useRouter } from 'expo-router';

// 2. Platform components
import {
  AppLogo,
  GlobalHeader,
  Icon,
  LoadingOverlay,
  NoticeSurface,
  Sidebar,
  TabBar,
  UserAccountMenu,
} from '@platform/components';
import { getMenuIconGlyph } from '@config/sideMenu';

// 3. Hooks & utilities
import useMainRouteLayout from './useMainRouteLayout';
import useMainRouteLayoutMobileShell from './useMainRouteLayoutMobileShell';

// 4. Styles
import {
  StyledContent,
  StyledDrawerBackdrop,
  StyledDrawerContainer,
  StyledDrawerRoot,
  StyledHeaderAppName,
  StyledHeaderBrand,
  StyledHeaderLeading,
  StyledHeaderLogo,
  StyledMenuToggleButton,
} from './MainRouteLayout.ios.styles';

// 5. Platform layouts
import AppFrame from '@platform/layouts/AppFrame';

const MainRouteLayoutIOS = () => {
  const router = useRouter();
  const { t, isLoading, items, tabItems, isItemVisible } = useMainRouteLayout();
  const { sidebarOpen, toggleSidebar, closeSidebar } = useMainRouteLayoutMobileShell();

  const overlaySlot = useMemo(
    () => (isLoading ? <LoadingOverlay visible testID="main-loading-overlay" /> : null),
    [isLoading]
  );

  const handleItemPress = useCallback(
    (item) => {
      const href = item?.href ?? item?.path ?? null;
      if (href) {
        router.push(href);
      }
      closeSidebar();
    },
    [closeSidebar, router]
  );

  const headerLeadingSlot = useMemo(
    () => (
      <StyledHeaderLeading>
        <StyledMenuToggleButton
          onPress={toggleSidebar}
          accessibilityRole="button"
          accessibilityLabel={t('common.toggleMenu')}
          testID="main-header-toggle-menu"
        >
          <Icon glyph={getMenuIconGlyph('menu-outline')} size="md" decorative />
        </StyledMenuToggleButton>
        <StyledHeaderBrand accessibilityLabel={t('app.shortName')}>
          <StyledHeaderLogo>
            <AppLogo size="md" />
          </StyledHeaderLogo>
          <StyledHeaderAppName numberOfLines={1}>{t('app.name')}</StyledHeaderAppName>
        </StyledHeaderBrand>
      </StyledHeaderLeading>
    ),
    [t, toggleSidebar]
  );

  return (
    <AppFrame
      header={
        <GlobalHeader
          title={null}
          leadingSlot={headerLeadingSlot}
          accessibilityLabel={t('navigation.header.title')}
          testID="main-header"
          actions={[]}
          utilitySlot={<UserAccountMenu testID="main-account-menu" />}
        />
      }
      footer={
        <TabBar
          accessibilityLabel={t('navigation.tabBar.title')}
          items={tabItems}
          isTabVisible={isItemVisible}
          testID="main-tabbar"
        />
      }
      overlay={overlaySlot}
      notices={<NoticeSurface testID="main-notice-surface" />}
      accessibilityLabel={t('navigation.header.title')}
      testID="main-route-layout"
    >
      <Modal
        visible={sidebarOpen}
        transparent
        animationType="slide"
        onRequestClose={closeSidebar}
        statusBarTranslucent
      >
        <StyledDrawerRoot>
          <StyledDrawerContainer>
            <Sidebar
              accessibilityLabel={t('navigation.sidebar.title')}
              items={items}
              isItemVisible={isItemVisible}
              onItemPress={handleItemPress}
              onClose={closeSidebar}
              collapsed={false}
              testID="main-sidebar"
            />
          </StyledDrawerContainer>
          <StyledDrawerBackdrop onPress={closeSidebar} accessibilityLabel={t('common.toggleMenu')} />
        </StyledDrawerRoot>
      </Modal>
      <StyledContent>
        <Slot />
      </StyledContent>
    </AppFrame>
  );
};

export default MainRouteLayoutIOS;
