/**
 * useRole Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createRole, deleteRole, getRole, listRoles, updateRole } from '@features/role';

const useRole = () => {
  const actions = useMemo(
    () => ({
      list: listRoles,
      get: getRole,
      create: createRole,
      update: updateRole,
      remove: deleteRole,
    }),
    []
  );
  return useCrud(actions);
};

export default useRole;
