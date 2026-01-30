/**
 * useApiKeyPermissionListScreen Hook
 * Shared logic for ApiKeyPermissionListScreen across platforms.
 * File: useApiKeyPermissionListScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useI18n, useNetwork, useApiKeyPermission } from '@hooks';

const resolveErrorMessage = (t, errorCode, loadErrorKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(loadErrorKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(loadErrorKey) : resolved;
};

const useApiKeyPermissionListScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const {
    list,
    remove,
    data,
    isLoading,
    errorCode,
    reset,
  } = useApiKeyPermission();

  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'apiKeyPermission.list.loadError'),
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

  const handleItemPress = useCallback(
    (id) => {
      router.push(`/settings/pi-key-permissions/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (e) e.stopPropagation();
      if (confirm(t('common.confirmDelete'))) {
        await remove(id);
      }
    },
    [remove, t]
  );

  return {
    items,
    isLoading,
    hasError: !!errorCode,
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onItemPress: handleItemPress,
    onDelete: handleDelete,
  };
};

export default useApiKeyPermissionListScreen;
