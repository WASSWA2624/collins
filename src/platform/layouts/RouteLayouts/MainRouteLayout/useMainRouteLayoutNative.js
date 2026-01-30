/**
 * useMainRouteLayoutNative Hook
 * Shared logic for MainRouteLayout Android and iOS (header actions, overlay, nav items)
 * File: useMainRouteLayoutNative.js
 */

import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useI18n, usePrimaryNavigation, useUiState } from '@hooks';
import { useAuthGuard } from '@navigation/guards';
import { AUTH } from '@config';
import { ACTION_VARIANTS } from '@platform/components/navigation/GlobalHeader/types';
import { LoadingOverlay } from '@platform/components';

/**
 * Shared hook for MainRouteLayout native (Android/iOS)
 * @returns {Object} headerActions, overlaySlot, mainItems, isItemVisible
 */
const useMainRouteLayoutNative = () => {
  useAuthGuard();
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, logout, roles } = useAuth();
  const { isLoading } = useUiState();
  const { mainItems, isItemVisible } = usePrimaryNavigation();

  const canAccessRegister = useMemo(
    () =>
      isAuthenticated &&
      AUTH.REGISTER_ROLES?.length > 0 &&
      AUTH.REGISTER_ROLES.some((role) => roles.includes(role)),
    [isAuthenticated, roles]
  );

  const headerActions = useMemo(
    () =>
      isAuthenticated
        ? [
            ...(canAccessRegister
              ? [
                  {
                    id: 'register',
                    label: t('auth.register.button'),
                    accessibilityLabel: t('auth.register.button'),
                    onPress: () => router.push('/register'),
                    variant: ACTION_VARIANTS.GHOST,
                  },
                ]
              : []),
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
          ],
    [isAuthenticated, canAccessRegister, logout, router, t]
  );

  const overlaySlot = useMemo(
    () =>
      isLoading ? (
        <LoadingOverlay visible testID="main-loading-overlay" />
      ) : null,
    [isLoading]
  );

  return { headerActions, overlaySlot, mainItems, isItemVisible };
};

export default useMainRouteLayoutNative;
