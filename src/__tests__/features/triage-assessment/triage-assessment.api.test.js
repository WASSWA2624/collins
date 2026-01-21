/**
 * Triage Assessment API Tests
 * File: triage-assessment.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { triageAssessmentApi } from '@features/triage-assessment/triage-assessment.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('triage-assessment.api', () => {
  it('creates crud api with triage assessment endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.TRIAGE_ASSESSMENTS);
    expect(triageAssessmentApi).toBeDefined();
  });
});
