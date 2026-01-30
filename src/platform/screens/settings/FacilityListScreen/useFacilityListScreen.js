/**
 * useFacilityListScreen Hook
 * Shared logic for FacilityListScreen across platforms.
 * File: useFacilityListScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useI18n, useNetwork, useFacility } from '@hooks';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  // Use facility-specific message for connection/generic errors so the UI is clearer
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t('facility.list.loadError');
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('facility.list.loadError') : resolved;
};

const useFacilityListScreen = () => {
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
  } = useFacility();

  // listFacilities returns normalized array; API may return { items: [] }. Support both.
  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
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

  const handleFacilityPress = useCallback(
    (id) => {
      router.push(`/settings/facilities/${id}`);
    },
    [router]
  );

  const handleAdd = useCallback(() => {
    router.push('/settings/facilities/create');
  }, [router]);

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
    onFacilityPress: handleFacilityPress,
    onDelete: handleDelete,
    onAdd: handleAdd,
  };
};

export default useFacilityListScreen;
