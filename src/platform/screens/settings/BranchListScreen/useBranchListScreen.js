/**
 * useBranchListScreen Hook
 * Shared logic for BranchListScreen across platforms.
 * File: useBranchListScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useI18n, useNetwork, useBranch } from '@hooks';

const resolveErrorMessage = (t, errorCode, loadErrorKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(loadErrorKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(loadErrorKey) : resolved;
};

const useBranchListScreen = () => {
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
  } = useBranch();

  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'branch.list.loadError'),
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

  const handleBranchPress = useCallback(
    (id) => {
      router.push(`/settings/branches/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id, e) => {
      if (e?.stopPropagation) e.stopPropagation();
      try {
        await remove(id);
        fetchList();
      } catch {
        /* error handled by hook */
      }
    },
    [remove, fetchList]
  );

  return {
    items,
    isLoading,
    hasError: Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onBranchPress: handleBranchPress,
    onDelete: handleDelete,
  };
};

export default useBranchListScreen;
