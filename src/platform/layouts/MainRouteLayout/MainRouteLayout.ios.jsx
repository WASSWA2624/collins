/**
 * MainRouteLayout Component - iOS
 * Minimal navigation skeleton for main workflow routes.
 * File: MainRouteLayout.ios.jsx
 */
// 1. External dependencies
import React, { useCallback, useMemo } from 'react';
import { Modal, Pressable } from 'react-native';
import { Slot, useRouter } from 'expo-router';

// 2. Platform components
import {
  GlobalHeader,
  Icon,
  LoadingOverlay,
  NoticeSurface,
  Sidebar,
  TabBar,
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
  StyledHeaderLeading,
} from './MainRouteLayout.ios.styles';

// 5. Platform layouts
import AppFrame from '@platform/layouts/AppFrame';
import { ACTION_PLACEMENTS, ACTION_VARIANTS } from '@platform/components/navigation/GlobalHeader';

const MainRouteLayoutIOS = () => {
  const router = useRouter();
  const { t, isLoading, items, isItemVisible } = useMainRouteLayout();
  const { sidebarOpen, toggleSidebar, closeSidebar } = useMainRouteLayoutMobileShell();

  const overlaySlot = useMemo(
    () => (isLoading ? <LoadingOverlay visible testID="main-loading-overlay" /> : null),
    [isLoading]
  );

  const handleItemPress = useCallback(
    (item) => {
      closeSidebar();
      const href = item?.href ?? item?.path ?? null;
      if (href) router.push(href);
    },
    [closeSidebar, router]
  );

  const headerLeadingSlot = useMemo(
    () => (
      <StyledHeaderLeading>
        <Pressable
          onPress={toggleSidebar}
          style={{ padding: 8 }}
          accessibilityRole="button"
          accessibilityLabel={t('common.toggleMenu')}
          testID="main-header-toggle-menu"
        >
          <Icon glyph={getMenuIconGlyph('menu-outline')} size="md" decorative />
        </Pressable>
        <Pressable
          onPress={() => {}}
          style={{ padding: 4 }}
          accessibilityRole="image"
          accessibilityLabel={t('app.shortName')}
        >
          <Icon glyph={getMenuIconGlyph('medkit-outline')} size="md" decorative />
        </Pressable>
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
      footer={
        <TabBar
          accessibilityLabel={t('navigation.tabBar.title')}
          items={items}
          isTabVisible={isItemVisible}
          testID="main-tabbar"
        />
      }
      overlay={overlaySlot}
      notices={<NoticeSurface testID="main-notice-surface" />}
      accessibilityLabel={t('navigation.mainNavigation')}
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
