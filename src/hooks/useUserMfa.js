/**
 * useUserMfa Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createUserMfa,
  deleteUserMfa,
  disableUserMfa,
  enableUserMfa,
  getUserMfa,
  listUserMfas,
  updateUserMfa,
  verifyUserMfa,
} from '@features/user-mfa';

const useUserMfa = () => {
  const actions = useMemo(
    () => ({
      list: listUserMfas,
      get: getUserMfa,
      create: createUserMfa,
      update: updateUserMfa,
      remove: deleteUserMfa,
      verify: verifyUserMfa,
      enable: enableUserMfa,
      disable: disableUserMfa,
    }),
    []
  );
  return useCrud(actions);
};

export default useUserMfa;
