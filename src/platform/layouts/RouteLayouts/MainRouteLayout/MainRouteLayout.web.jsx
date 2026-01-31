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
  LoadingOverlay,
  NoticeSurface,
  Sidebar,
} from '@platform/components';

// 3. Hooks & utilities
import useMainRouteLayout from './useMainRouteLayout';

// 4. Styles
import { StyledMain } from './MainRouteLayout.web.styles';

// 5. Local platform layouts
import AppFrame from '../../AppFrame';

const MainRouteLayoutWeb = () => {
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
      sidebar={
        <Sidebar
          accessibilityLabel={t('navigation.sidebar.title')}
          items={items}
          isItemVisible={isItemVisible}
          collapsed={false}
          footerSlot={null}
          testID="main-sidebar"
        />
      }
      footer={null}
      overlay={overlaySlot}
      notices={<NoticeSurface testID="main-notice-surface" />}
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
