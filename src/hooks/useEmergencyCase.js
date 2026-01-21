/**
 * useEmergencyCase Hook
 * File: useEmergencyCase.js
 */
import useCrud from '@hooks/useCrud';
import {
  createEmergencyCase,
  deleteEmergencyCase,
  getEmergencyCase,
  listEmergencyCases,
  updateEmergencyCase,
} from '@features/emergency-case';

const useEmergencyCase = () =>
  useCrud({
    list: listEmergencyCases,
    get: getEmergencyCase,
    create: createEmergencyCase,
    update: updateEmergencyCase,
    remove: deleteEmergencyCase,
  });

export default useEmergencyCase;
