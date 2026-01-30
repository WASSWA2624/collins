/**
 * useContact Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createContact, deleteContact, getContact, listContacts, updateContact } from '@features/contact';

const useContact = () => {
  const actions = useMemo(
    () => ({
      list: listContacts,
      get: getContact,
      create: createContact,
      update: updateContact,
      remove: deleteContact,
    }),
    []
  );
  return useCrud(actions);
};

export default useContact;
