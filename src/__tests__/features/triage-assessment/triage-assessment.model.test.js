/**
 * Triage Assessment Model Tests
 * File: triage-assessment.model.test.js
 */
import {
  normalizeTriageAssessment,
  normalizeTriageAssessmentList,
} from '@features/triage-assessment';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('triage-assessment.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeTriageAssessment, normalizeTriageAssessmentList);
  });
});
