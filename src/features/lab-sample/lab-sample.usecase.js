/**
 * Lab Sample Use Cases
 * File: lab-sample.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { labSampleApi } from './lab-sample.api';
import { normalizeLabSample, normalizeLabSampleList } from './lab-sample.model';
import { parseLabSampleId, parseLabSampleListParams, parseLabSamplePayload } from './lab-sample.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listLabSamples = async (params = {}) =>
  execute(async () => {
    const parsed = parseLabSampleListParams(params);
    const response = await labSampleApi.list(parsed);
    return normalizeLabSampleList(response.data);
  });

const getLabSample = async (id) =>
  execute(async () => {
    const parsedId = parseLabSampleId(id);
    const response = await labSampleApi.get(parsedId);
    return normalizeLabSample(response.data);
  });

const createLabSample = async (payload) =>
  execute(async () => {
    const parsed = parseLabSamplePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_SAMPLES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeLabSample(parsed);
    }
    const response = await labSampleApi.create(parsed);
    return normalizeLabSample(response.data);
  });

const updateLabSample = async (id, payload) =>
  execute(async () => {
    const parsedId = parseLabSampleId(id);
    const parsed = parseLabSamplePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_SAMPLES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeLabSample({ id: parsedId, ...parsed });
    }
    const response = await labSampleApi.update(parsedId, parsed);
    return normalizeLabSample(response.data);
  });

const deleteLabSample = async (id) =>
  execute(async () => {
    const parsedId = parseLabSampleId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_SAMPLES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeLabSample({ id: parsedId });
    }
    const response = await labSampleApi.remove(parsedId);
    return normalizeLabSample(response.data);
  });

export { listLabSamples, getLabSample, createLabSample, updateLabSample, deleteLabSample };
