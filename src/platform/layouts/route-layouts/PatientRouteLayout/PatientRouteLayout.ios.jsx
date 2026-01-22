/**
 * PatientRouteLayout Component - iOS
 * Reusable route layout for patient-facing routes on iOS
 * File: PatientRouteLayout.ios.jsx
 */
import React from 'react';
import { Slot, useRouter } from 'expo-router';
import { useAuth, useI18n, usePrimaryNavigation, useShellBanners, useUiState } from '@hooks';
import { useAuthGuard } from '@navigation/guards';
import { PatientFrame } from '@platform/layouts';
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
 * PatientRouteLayout component for iOS
 */
const PatientRouteLayoutIOS = () => {
  useAuthGuard();
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { isLoading } = useUiState();
  const { patientItems, isItemVisible } = usePrimaryNavigation();
  const banners = useShellBanners();
  const bannerSlot = banners.length ? <ShellBanners banners={banners} testID="patient-shell-banners" /> : null;
  const overlaySlot = isLoading ? <LoadingOverlay visible testID="patient-loading-overlay" /> : null;
  const headerActions = isAuthenticated
    ? [
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
      {
        id: 'register',
        label: t('auth.register.button'),
        accessibilityLabel: t('auth.register.button'),
        onPress: () => router.push('/register'),
        variant: ACTION_VARIANTS.GHOST,
      },
    ];

  return (
    <PatientFrame
      header={(
        <GlobalHeader
          title={t('navigation.patientNavigation')}
          accessibilityLabel={t('navigation.header.title')}
          testID="patient-header"
          actions={headerActions}
          utilitySlot={(
            <>
              <LanguageControls testID="patient-language-controls" />
              <ThemeControls testID="patient-theme-controls" />
            </>
          )}
        />
      )}
      footer={(
        <GlobalFooter
          variant={FOOTER_VARIANTS.PATIENT}
          accessibilityLabel={t('navigation.footer.title')}
          testID="patient-footer"
          quickActionsSlot={(
            <TabBar
              accessibilityLabel={t('navigation.tabBar.title')}
              items={patientItems}
              isTabVisible={isItemVisible}
              testID="patient-tabbar"
            />
          )}
        />
      )}
      banner={bannerSlot}
      overlay={overlaySlot}
      notices={<NoticeSurface testID="patient-notice-surface" />}
      accessibilityLabel={t('navigation.patientNavigation')}
      testID="patient-route-layout"
    >
      <Slot />
    </PatientFrame>
  );
};

export default PatientRouteLayoutIOS;
