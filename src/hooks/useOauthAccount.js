/**
 * useOauthAccount Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createOauthAccount,
  deleteOauthAccount,
  getOauthAccount,
  listOauthAccounts,
  updateOauthAccount,
} from '@features/oauth-account';

const useOauthAccount = () => {
  const actions = useMemo(
    () => ({
      list: listOauthAccounts,
      get: getOauthAccount,
      create: createOauthAccount,
      update: updateOauthAccount,
      remove: deleteOauthAccount,
    }),
    []
  );
  return useCrud(actions);
};

export default useOauthAccount;
