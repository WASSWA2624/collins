/**
 * MainRouteLayout Component - Android
 * Reusable route layout for authenticated/main app routes on Android
 * File: MainRouteLayout.android.jsx
 * 
 * Per component-structure.mdc: Reusable layout components belong in platform/layouts/
 * Per app-router.mdc: Route layouts handle authentication guards
 * 
 * This component combines:
 * - Auth guard (routing logic)
 * - MainLayout (UI component)
 * - Navigation components (Header, TabBar)
 * - Slot rendering (child routes)
 */

import React from 'react';
import { Slot, useRouter } from 'expo-router';
import { useAuth, useI18n, usePrimaryNavigation, useShellBanners, useUiState } from '@hooks';
import { useAuthGuard } from '@navigation/guards';
import { AUTH } from '@config';
import { AppFrame } from '@platform/layouts';
import {
  GlobalHeader,
  LanguageControls,
  LoadingOverlay,
  NoticeSurface,
  ShellBanners,
  TabBar,
  ThemeControls,
} from '@platform/components';
import { ACTION_VARIANTS } from '@platform/components/navigation/GlobalHeader/types';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';

/**
 * MainRouteLayout component for Android
 * @param {Object} props - MainRouteLayout props
 */
const MainRouteLayoutAndroid = () => {
  // Call auth guard at the top of component per app-router.mdc
  // Hook automatically redirects unauthenticated users to /login
  useAuthGuard();
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, logout, roles } = useAuth();
  const { isLoading } = useUiState();
  const { mainItems, isItemVisible } = usePrimaryNavigation();
  const banners = useShellBanners();
  const bannerSlot = banners.length ? <ShellBanners banners={banners} testID="main-shell-banners" /> : null;
  const overlaySlot = isLoading ? <LoadingOverlay visible testID="main-loading-overlay" /> : null;
  const canAccessRegister = isAuthenticated
    && AUTH.REGISTER_ROLES?.length
    && AUTH.REGISTER_ROLES.some((role) => roles.includes(role));

  const headerActions = isAuthenticated
    ? [
      ...(canAccessRegister ? [{
        id: 'register',
        label: t('auth.register.button'),
        accessibilityLabel: t('auth.register.button'),
        onPress: () => router.push('/register'),
        variant: ACTION_VARIANTS.GHOST,
      }] : []),
      {
        id: 'logout',
        label: t('navigation.header.logout'),
        accessibilityLabel: t('navigation.header.logout'),
        onPress: logout,
        variant: ACTION_VARIANTS.GHOST,
      },
    ]
    : [
      {
        id: 'login',
        label: t('auth.login.button'),
        accessibilityLabel: t('auth.login.button'),
        onPress: () => router.push('/login'),
        variant: ACTION_VARIANTS.PRIMARY,
      },
    ];
  
  // Use platform MainLayout component with Header, TabBar, and Slot
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
      banner={bannerSlot}
      overlay={overlaySlot}
      notices={<NoticeSurface testID="main-notice-surface" />}
      accessibilityLabel={t('navigation.mainNavigation')}
      testID="main-route-layout"
    >
      <Slot />
    </AppFrame>
  );
};

export default MainRouteLayoutAndroid;

