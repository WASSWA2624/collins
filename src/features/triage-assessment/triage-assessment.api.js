/**
 * Triage Assessment API
 * File: triage-assessment.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const triageAssessmentApi = createCrudApi(endpoints.TRIAGE_ASSESSMENTS);

export { triageAssessmentApi };
