/**
 * useRoom Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createRoom, deleteRoom, getRoom, listRooms, updateRoom } from '@features/room';

const useRoom = () => {
  const actions = useMemo(
    () => ({
      list: listRooms,
      get: getRoom,
      create: createRoom,
      update: updateRoom,
      remove: deleteRoom,
    }),
    []
  );
  return useCrud(actions);
};

export default useRoom;
