/**
 * MainRouteLayout Component - iOS
 * Minimal navigation skeleton for main workflow routes.
 * File: MainRouteLayout.ios.jsx
 */
// 1. External dependencies
import React, { useMemo } from 'react';
import { Slot } from 'expo-router';

// 2. Platform components
import {
  GlobalHeader,
  LoadingOverlay,
  NoticeSurface,
  TabBar,
} from '@platform/components';

// 3. Hooks & utilities
import useMainRouteLayout from './useMainRouteLayout';

// 4. Styles
import { StyledContent } from './MainRouteLayout.ios.styles';

// 5. Platform layouts
import AppFrame from '@platform/layouts/AppFrame';

const MainRouteLayoutIOS = () => {
  const { t, isLoading, items, isItemVisible } = useMainRouteLayout();

  const overlaySlot = useMemo(
    () => (isLoading ? <LoadingOverlay visible testID="main-loading-overlay" /> : null),
    [isLoading]
  );

  return (
    <AppFrame
      header={
        <GlobalHeader
          title={t('navigation.mainNavigation')}
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
      <StyledContent>
        <Slot />
      </StyledContent>
    </AppFrame>
  );
};

export default MainRouteLayoutIOS;

