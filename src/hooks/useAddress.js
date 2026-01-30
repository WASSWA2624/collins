/**
 * useAddress Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createAddress, deleteAddress, getAddress, listAddresses, updateAddress } from '@features/address';

const useAddress = () => {
  const actions = useMemo(
    () => ({
      list: listAddresses,
      get: getAddress,
      create: createAddress,
      update: updateAddress,
      remove: deleteAddress,
    }),
    []
  );
  return useCrud(actions);
};

export default useAddress;
