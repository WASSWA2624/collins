/**
 * useAmbulanceDispatch Hook
 * File: useAmbulanceDispatch.js
 */
import useCrud from '@hooks/useCrud';
import {
  createAmbulanceDispatch,
  deleteAmbulanceDispatch,
  getAmbulanceDispatch,
  listAmbulanceDispatches,
  updateAmbulanceDispatch,
} from '@features/ambulance-dispatch';

const useAmbulanceDispatch = () =>
  useCrud({
    list: listAmbulanceDispatches,
    get: getAmbulanceDispatch,
    create: createAmbulanceDispatch,
    update: updateAmbulanceDispatch,
    remove: deleteAmbulanceDispatch,
  });

export default useAmbulanceDispatch;
