/**
 * Triage Assessment Use Cases
 * File: triage-assessment.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { triageAssessmentApi } from './triage-assessment.api';
import { normalizeTriageAssessment, normalizeTriageAssessmentList } from './triage-assessment.model';
import {
  parseTriageAssessmentId,
  parseTriageAssessmentListParams,
  parseTriageAssessmentPayload,
} from './triage-assessment.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listTriageAssessments = async (params = {}) =>
  execute(async () => {
    const parsed = parseTriageAssessmentListParams(params);
    const response = await triageAssessmentApi.list(parsed);
    return normalizeTriageAssessmentList(response.data);
  });

const getTriageAssessment = async (id) =>
  execute(async () => {
    const parsedId = parseTriageAssessmentId(id);
    const response = await triageAssessmentApi.get(parsedId);
    return normalizeTriageAssessment(response.data);
  });

const createTriageAssessment = async (payload) =>
  execute(async () => {
    const parsed = parseTriageAssessmentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.TRIAGE_ASSESSMENTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeTriageAssessment(parsed);
    }
    const response = await triageAssessmentApi.create(parsed);
    return normalizeTriageAssessment(response.data);
  });

const updateTriageAssessment = async (id, payload) =>
  execute(async () => {
    const parsedId = parseTriageAssessmentId(id);
    const parsed = parseTriageAssessmentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.TRIAGE_ASSESSMENTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeTriageAssessment({ id: parsedId, ...parsed });
    }
    const response = await triageAssessmentApi.update(parsedId, parsed);
    return normalizeTriageAssessment(response.data);
  });

const deleteTriageAssessment = async (id) =>
  execute(async () => {
    const parsedId = parseTriageAssessmentId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.TRIAGE_ASSESSMENTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeTriageAssessment({ id: parsedId });
    }
    const response = await triageAssessmentApi.remove(parsedId);
    return normalizeTriageAssessment(response.data);
  });

export {
  listTriageAssessments,
  getTriageAssessment,
  createTriageAssessment,
  updateTriageAssessment,
  deleteTriageAssessment,
};
