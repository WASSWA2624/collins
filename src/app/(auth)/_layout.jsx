import React, { useEffect, useMemo, useRef } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useAuth, useI18n, useShellBanners, useUiState } from '@hooks';
import { useAuthGuard } from '@navigation/guards';
import { AUTH } from '@config';
import { AuthFrame } from '@platform/layouts';
import { GlobalHeader, LoadingOverlay, NoticeSurface, ShellBanners } from '@platform/components';
import { ACTION_VARIANTS } from '@platform/components/navigation/GlobalHeader/types';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';

/**
 * Auth Group Layout
 * 
 * Layout wrapper for authentication routes (login, register, etc.).
 * 
 * Per app-router.mdc:
 * - Layouts use `_layout.jsx`, default exports, `<Slot />` for child routes
 * - Guard placement: guards in layouts, not screens
 * 
 * This layout redirects authenticated users away from auth routes (e.g., login when already logged in).
 * Per Step 7.14: Uses useAuthGuard hook with skipRedirect option to get auth state,
 * then handles redirect of authenticated users to home route.
 */
const AuthLayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const { authenticated } = useAuthGuard({ skipRedirect: true });
  const { isAuthenticated, logout, roles } = useAuth();
  const { isLoading } = useUiState();
  const banners = useShellBanners();

  const canAccessRegister = useMemo(() => {
    if (!isAuthenticated) return false;
    if (!AUTH.REGISTER_ROLES?.length) return false;
    return AUTH.REGISTER_ROLES.some((role) => roles.includes(role));
  }, [isAuthenticated, roles]);
  
  // Use ref to track if redirect has been performed to prevent multiple redirects
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    const isRegisterRoute = pathname === '/register';
    // Redirect authenticated users to home route
    if (authenticated && !hasRedirected.current) {
      if (isRegisterRoute && canAccessRegister) {
        hasRedirected.current = false;
        return;
      }
      hasRedirected.current = true;
      router.replace('/home');
    } else if (!authenticated) {
      // Reset redirect flag when unauthenticated
      hasRedirected.current = false;
    }
  }, [authenticated, canAccessRegister, pathname, router]);
  
  const bannerSlot = banners.length ? <ShellBanners banners={banners} testID="auth-shell-banners" /> : null;
  const overlaySlot = isLoading ? <LoadingOverlay visible testID="auth-loading-overlay" /> : null;
  const authHeaderActions = authenticated || isAuthenticated
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
    ];

  return (
    <AuthFrame
      testID="auth-route-layout"
      header={(
        <GlobalHeader
          title={t('app.name')}
          accessibilityLabel={t('navigation.header.title')}
          testID="auth-header"
          actions={authHeaderActions}
        />
      )}
      banner={bannerSlot}
      overlay={overlaySlot}
      notices={<NoticeSurface testID="auth-notice-surface" />}
      footer={(
        <GlobalFooter
          variant={FOOTER_VARIANTS.AUTH}
          testID="auth-footer"
        />
      )}
    >
      <Slot />
    </AuthFrame>
  );
};

export default AuthLayout;

