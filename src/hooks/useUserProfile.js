/**
 * useUserProfile Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createUserProfile,
  deleteUserProfile,
  getUserProfile,
  listUserProfiles,
  updateUserProfile,
} from '@features/user-profile';

const useUserProfile = () => {
  const actions = useMemo(
    () => ({
      list: listUserProfiles,
      get: getUserProfile,
      create: createUserProfile,
      update: updateUserProfile,
      remove: deleteUserProfile,
    }),
    []
  );
  return useCrud(actions);
};

export default useUserProfile;
