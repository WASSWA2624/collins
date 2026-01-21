/**
 * Triage Assessment Rules
 * File: triage-assessment.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseTriageAssessmentId = (value) => parseId(value);
const parseTriageAssessmentPayload = (value) => parsePayload(value);
const parseTriageAssessmentListParams = (value) => parseListParams(value);

export {
  parseTriageAssessmentId,
  parseTriageAssessmentPayload,
  parseTriageAssessmentListParams,
};
