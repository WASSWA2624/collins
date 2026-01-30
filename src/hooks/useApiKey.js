/**
 * useApiKey Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createApiKey, deleteApiKey, getApiKey, listApiKeys, updateApiKey } from '@features/api-key';

const useApiKey = () => {
  const actions = useMemo(
    () => ({
      list: listApiKeys,
      get: getApiKey,
      create: createApiKey,
      update: updateApiKey,
      remove: deleteApiKey,
    }),
    []
  );
  return useCrud(actions);
};

export default useApiKey;
