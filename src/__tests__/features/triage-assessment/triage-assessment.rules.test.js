/**
 * Triage Assessment Rules Tests
 * File: triage-assessment.rules.test.js
 */
import {
  parseTriageAssessmentId,
  parseTriageAssessmentListParams,
  parseTriageAssessmentPayload,
} from '@features/triage-assessment';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('triage-assessment.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseTriageAssessmentId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseTriageAssessmentPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseTriageAssessmentListParams);
  });
});
