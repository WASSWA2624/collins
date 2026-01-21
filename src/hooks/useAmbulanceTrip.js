/**
 * useAmbulanceTrip Hook
 * File: useAmbulanceTrip.js
 */
import useCrud from '@hooks/useCrud';
import {
  createAmbulanceTrip,
  deleteAmbulanceTrip,
  getAmbulanceTrip,
  listAmbulanceTrips,
  updateAmbulanceTrip,
} from '@features/ambulance-trip';

const useAmbulanceTrip = () =>
  useCrud({
    list: listAmbulanceTrips,
    get: getAmbulanceTrip,
    create: createAmbulanceTrip,
    update: updateAmbulanceTrip,
    remove: deleteAmbulanceTrip,
  });

export default useAmbulanceTrip;
