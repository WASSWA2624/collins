/**
 * useEmergencyResponse Hook
 * File: useEmergencyResponse.js
 */
import useCrud from '@hooks/useCrud';
import {
  createEmergencyResponse,
  deleteEmergencyResponse,
  getEmergencyResponse,
  listEmergencyResponses,
  updateEmergencyResponse,
} from '@features/emergency-response';

const useEmergencyResponse = () =>
  useCrud({
    list: listEmergencyResponses,
    get: getEmergencyResponse,
    create: createEmergencyResponse,
    update: updateEmergencyResponse,
    remove: deleteEmergencyResponse,
  });

export default useEmergencyResponse;
