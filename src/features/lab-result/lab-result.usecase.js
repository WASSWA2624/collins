/**
 * Lab Result Use Cases
 * File: lab-result.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { labResultApi } from './lab-result.api';
import { normalizeLabResult, normalizeLabResultList } from './lab-result.model';
import { parseLabResultId, parseLabResultListParams, parseLabResultPayload } from './lab-result.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listLabResults = async (params = {}) =>
  execute(async () => {
    const parsed = parseLabResultListParams(params);
    const response = await labResultApi.list(parsed);
    return normalizeLabResultList(response.data);
  });

const getLabResult = async (id) =>
  execute(async () => {
    const parsedId = parseLabResultId(id);
    const response = await labResultApi.get(parsedId);
    return normalizeLabResult(response.data);
  });

const createLabResult = async (payload) =>
  execute(async () => {
    const parsed = parseLabResultPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_RESULTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeLabResult(parsed);
    }
    const response = await labResultApi.create(parsed);
    return normalizeLabResult(response.data);
  });

const updateLabResult = async (id, payload) =>
  execute(async () => {
    const parsedId = parseLabResultId(id);
    const parsed = parseLabResultPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_RESULTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeLabResult({ id: parsedId, ...parsed });
    }
    const response = await labResultApi.update(parsedId, parsed);
    return normalizeLabResult(response.data);
  });

const deleteLabResult = async (id) =>
  execute(async () => {
    const parsedId = parseLabResultId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_RESULTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeLabResult({ id: parsedId });
    }
    const response = await labResultApi.remove(parsedId);
    return normalizeLabResult(response.data);
  });

export { listLabResults, getLabResult, createLabResult, updateLabResult, deleteLabResult };
