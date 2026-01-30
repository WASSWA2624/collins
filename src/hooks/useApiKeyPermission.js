/**
 * useApiKeyPermission Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createApiKeyPermission,
  deleteApiKeyPermission,
  getApiKeyPermission,
  listApiKeyPermissions,
  updateApiKeyPermission,
} from '@features/api-key-permission';

const useApiKeyPermission = () => {
  const actions = useMemo(
    () => ({
      list: listApiKeyPermissions,
      get: getApiKeyPermission,
      create: createApiKeyPermission,
      update: updateApiKeyPermission,
      remove: deleteApiKeyPermission,
    }),
    []
  );
  return useCrud(actions);
};

export default useApiKeyPermission;
