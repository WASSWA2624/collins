/**
 * useUnit Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createUnit, deleteUnit, getUnit, listUnits, updateUnit } from '@features/unit';

const useUnit = () => {
  const actions = useMemo(
    () => ({
      list: listUnits,
      get: getUnit,
      create: createUnit,
      update: updateUnit,
      remove: deleteUnit,
    }),
    []
  );
  return useCrud(actions);
};

export default useUnit;
