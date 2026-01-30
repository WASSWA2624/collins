/**
 * useWard Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createWard, deleteWard, getWard, listWardBeds, listWards, updateWard } from '@features/ward';

const useWard = () => {
  const actions = useMemo(
    () => ({
      list: listWards,
      get: getWard,
      create: createWard,
      update: updateWard,
      remove: deleteWard,
      listBeds: listWardBeds,
    }),
    []
  );
  return useCrud(actions);
};

export default useWard;
