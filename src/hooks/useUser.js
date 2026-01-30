/**
 * useUser Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createUser, deleteUser, getUser, listUsers, updateUser } from '@features/user';

const useUser = () => {
  const actions = useMemo(
    () => ({
      list: listUsers,
      get: getUser,
      create: createUser,
      update: updateUser,
      remove: deleteUser,
    }),
    []
  );
  return useCrud(actions);
};

export default useUser;
