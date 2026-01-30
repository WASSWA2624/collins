/**
 * useUserSession Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { getUserSession, listUserSessions, revokeUserSession } from '@features/user-session';

const useUserSession = () => {
  const actions = useMemo(
    () => ({
      list: listUserSessions,
      get: getUserSession,
      revoke: revokeUserSession,
    }),
    []
  );
  return useCrud(actions);
};

export default useUserSession;
