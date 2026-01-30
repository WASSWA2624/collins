/**
 * usePatientRouteLayout Hook
 * Shared logic for PatientRouteLayout (header actions, overlay, nav items)
 * File: usePatientRouteLayout.js
 */

import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useI18n, usePrimaryNavigation, useUiState } from '@hooks';
import { useAuthGuard } from '@navigation/guards';
import { ACTION_VARIANTS } from '@platform/components/navigation/GlobalHeader/types';
import { LoadingOverlay } from '@platform/components';

/**
 * Shared hook for PatientRouteLayout (all platforms)
 * @returns {Object} headerActions, overlaySlot, patientItems, isItemVisible
 */
const usePatientRouteLayout = () => {
  useAuthGuard();
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { isLoading } = useUiState();
  const { patientItems, isItemVisible } = usePrimaryNavigation();

  const headerActions = useMemo(
    () =>
      isAuthenticated
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
          ],
    [isAuthenticated, logout, router, t]
  );

  const overlaySlot = useMemo(
    () =>
      isLoading ? (
        <LoadingOverlay visible testID="patient-loading-overlay" />
      ) : null,
    [isLoading]
  );

  return { headerActions, overlaySlot, patientItems, isItemVisible };
};

export default usePatientRouteLayout;
