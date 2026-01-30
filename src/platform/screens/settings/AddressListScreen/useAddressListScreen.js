/**
 * useAddressListScreen Hook
 * Shared logic for AddressListScreen across platforms.
 * File: useAddressListScreen.js
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useI18n, useNetwork, useAddress } from '@hooks';

const resolveErrorMessage = (t, errorCode, loadErrorKey) => {
  if (!errorCode) return null;
  if (errorCode === 'UNKNOWN_ERROR' || errorCode === 'NETWORK_ERROR') {
    return t(loadErrorKey);
  }
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t(loadErrorKey) : resolved;
};

const useAddressListScreen = () => {
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
  } = useAddress();

  const items = useMemo(
    () => (Array.isArray(data) ? data : (data?.items ?? [])),
    [data]
  );
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'address.list.loadError'),
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

  const handleAddressPress = useCallback(
    (id) => {
      router.push(`/settings/addresses/${id}`);
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
    onAddressPress: handleAddressPress,
    onDelete: handleDelete,
  };
};

export default useAddressListScreen;
