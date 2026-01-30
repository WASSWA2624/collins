/**
 * useBranch Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createBranch, deleteBranch, getBranch, listBranches, updateBranch } from '@features/branch';

const useBranch = () => {
  const actions = useMemo(
    () => ({
      list: listBranches,
      get: getBranch,
      create: createBranch,
      update: updateBranch,
      remove: deleteBranch,
    }),
    []
  );
  return useCrud(actions);
};

export default useBranch;
