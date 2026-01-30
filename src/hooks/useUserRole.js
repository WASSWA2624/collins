/**
 * useUserRole Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createUserRole, deleteUserRole, getUserRole, listUserRoles, updateUserRole } from '@features/user-role';

const useUserRole = () => {
  const actions = useMemo(
    () => ({
      list: listUserRoles,
      get: getUserRole,
      create: createUserRole,
      update: updateUserRole,
      remove: deleteUserRole,
    }),
    []
  );
  return useCrud(actions);
};

export default useUserRole;
