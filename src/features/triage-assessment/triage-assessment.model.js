/**
 * Triage Assessment Model
 * File: triage-assessment.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeTriageAssessment = (value) => normalize(value);
const normalizeTriageAssessmentList = (value) => normalizeList(value);

export { normalizeTriageAssessment, normalizeTriageAssessmentList };
