/**
 * useBed Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createBed, deleteBed, getBed, listBeds, updateBed } from '@features/bed';

const useBed = () => {
  const actions = useMemo(
    () => ({
      list: listBeds,
      get: getBed,
      create: createBed,
      update: updateBed,
      remove: deleteBed,
    }),
    []
  );
  return useCrud(actions);
};

export default useBed;
