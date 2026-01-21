/**
 * useTriageAssessment Hook
 * File: useTriageAssessment.js
 */
import useCrud from '@hooks/useCrud';
import {
  createTriageAssessment,
  deleteTriageAssessment,
  getTriageAssessment,
  listTriageAssessments,
  updateTriageAssessment,
} from '@features/triage-assessment';

const useTriageAssessment = () =>
  useCrud({
    list: listTriageAssessments,
    get: getTriageAssessment,
    create: createTriageAssessment,
    update: updateTriageAssessment,
    remove: deleteTriageAssessment,
  });

export default useTriageAssessment;
