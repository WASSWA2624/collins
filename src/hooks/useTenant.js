/**
 * useTenant Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createTenant, deleteTenant, getTenant, listTenants, updateTenant } from '@features/tenant';

const useTenant = () => {
  const actions = useMemo(
    () => ({
      list: listTenants,
      get: getTenant,
      create: createTenant,
      update: updateTenant,
      remove: deleteTenant,
    }),
    []
  );
  return useCrud(actions);
};

export default useTenant;
