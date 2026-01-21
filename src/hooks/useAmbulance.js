/**
 * useAmbulance Hook
 * File: useAmbulance.js
 */
import useCrud from '@hooks/useCrud';
import {
  createAmbulance,
  deleteAmbulance,
  getAmbulance,
  listAmbulances,
  updateAmbulance,
} from '@features/ambulance';

const useAmbulance = () =>
  useCrud({
    list: listAmbulances,
    get: getAmbulance,
    create: createAmbulance,
    update: updateAmbulance,
    remove: deleteAmbulance,
  });

export default useAmbulance;
