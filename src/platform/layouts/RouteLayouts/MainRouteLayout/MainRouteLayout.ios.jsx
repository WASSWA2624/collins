/**
 * MainRouteLayout Component - iOS
 * Reusable route layout for authenticated/main app routes on iOS
 * File: MainRouteLayout.ios.jsx
 */

import React from 'react';
import { Slot } from 'expo-router';
import { useI18n } from '@hooks';
import AppFrame from '../../AppFrame';
import {
  GlobalHeader,
  LanguageControls,
  NoticeSurface,
  TabBar,
  ThemeControls,
} from '@platform/components';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';
import useMainRouteLayoutNative from './useMainRouteLayoutNative';

/**
 * MainRouteLayout component for iOS
 */
const MainRouteLayoutIOS = () => {
  const { t } = useI18n();
  const { headerActions, overlaySlot, mainItems, isItemVisible } = useMainRouteLayoutNative();

  return (
    <AppFrame
      header={
        <GlobalHeader
          title={t('navigation.mainNavigation')}
          accessibilityLabel={t('navigation.header.title')}
          testID="main-header"
          actions={headerActions}
          utilitySlot={(
            <>
              <LanguageControls testID="main-language-controls" />
              <ThemeControls testID="main-theme-controls" />
            </>
          )}
        />
      }
      footer={
        <GlobalFooter
          variant={FOOTER_VARIANTS.MAIN}
          accessibilityLabel={t('navigation.footer.title')}
          testID="main-footer"
          quickActionsSlot={(
            <TabBar
              accessibilityLabel={t('navigation.tabBar.title')}
              items={mainItems}
              isTabVisible={isItemVisible}
              testID="main-tabbar"
            />
          )}
        />
      }
      overlay={overlaySlot}
      notices={<NoticeSurface testID="main-notice-surface" />}
      accessibilityLabel={t('navigation.mainNavigation')}
      testID="main-route-layout"
    >
      <Slot />
    </AppFrame>
  );
};

export default MainRouteLayoutIOS;

