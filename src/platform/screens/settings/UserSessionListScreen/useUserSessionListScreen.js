/**
 * useUserSessionListScreen Hook
 * Shared logic for UserSessionListScreen across platforms.
 * File: useUserSessionListScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useI18n, useNetwork, useUserSession } from '@hooks';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const useUserSessionListScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const {
    list,
    revoke,
    data,
    isLoading,
    errorCode,
    reset,
  } = useUserSession();

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode),
    [t, errorCode]
  );

  const fetchList = useCallback(() => {
    reset();
    list({ page: 1, limit: 20 });
  }, [list, reset]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleRetry = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const handleSessionPress = useCallback(
    (id) => {
      router.push(`/settings/user-sessions/${id}`);
    },
    [router]
  );

  const handleRevoke = useCallback(
    async (id, e) => {
      if (e?.stopPropagation) e.stopPropagation();
      try {
        await revoke(id);
        fetchList();
      } catch {
        /* error handled by hook */
      }
    },
    [revoke, fetchList]
  );

  return {
    items,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onSessionPress: handleSessionPress,
    onRevoke: handleRevoke,
  };
};

export default useUserSessionListScreen;
