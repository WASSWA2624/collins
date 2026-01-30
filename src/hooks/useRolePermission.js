/**
 * useRolePermission Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createRolePermission,
  deleteRolePermission,
  getRolePermission,
  listRolePermissions,
  updateRolePermission,
} from '@features/role-permission';

const useRolePermission = () => {
  const actions = useMemo(
    () => ({
      list: listRolePermissions,
      get: getRolePermission,
      create: createRolePermission,
      update: updateRolePermission,
      remove: deleteRolePermission,
    }),
    []
  );
  return useCrud(actions);
};

export default useRolePermission;
