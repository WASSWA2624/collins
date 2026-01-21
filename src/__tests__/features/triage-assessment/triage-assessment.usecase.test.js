/**
 * Triage Assessment Usecase Tests
 * File: triage-assessment.usecase.test.js
 */
import {
  listTriageAssessments,
  getTriageAssessment,
  createTriageAssessment,
  updateTriageAssessment,
  deleteTriageAssessment,
} from '@features/triage-assessment';
import { triageAssessmentApi } from '@features/triage-assessment/triage-assessment.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/triage-assessment/triage-assessment.api', () => ({
  triageAssessmentApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('triage-assessment.usecase', () => {
  beforeEach(() => {
    triageAssessmentApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    triageAssessmentApi.get.mockResolvedValue({ data: { id: '1' } });
    triageAssessmentApi.create.mockResolvedValue({ data: { id: '1' } });
    triageAssessmentApi.update.mockResolvedValue({ data: { id: '1' } });
    triageAssessmentApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listTriageAssessments,
      get: getTriageAssessment,
      create: createTriageAssessment,
      update: updateTriageAssessment,
      remove: deleteTriageAssessment,
    },
    { queueRequestIfOffline }
  );
});
