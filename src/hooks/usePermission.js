/**
 * usePermission Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createPermission,
  deletePermission,
  getPermission,
  listPermissions,
  updatePermission,
} from '@features/permission';

const usePermission = () => {
  const actions = useMemo(
    () => ({
      list: listPermissions,
      get: getPermission,
      create: createPermission,
      update: updatePermission,
      remove: deletePermission,
    }),
    []
  );
  return useCrud(actions);
};

export default usePermission;
