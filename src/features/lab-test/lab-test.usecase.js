/**
 * Lab Test Use Cases
 * File: lab-test.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { labTestApi } from './lab-test.api';
import { normalizeLabTest, normalizeLabTestList } from './lab-test.model';
import { parseLabTestId, parseLabTestListParams, parseLabTestPayload } from './lab-test.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listLabTests = async (params = {}) =>
  execute(async () => {
    const parsed = parseLabTestListParams(params);
    const response = await labTestApi.list(parsed);
    return normalizeLabTestList(response.data);
  });

const getLabTest = async (id) =>
  execute(async () => {
    const parsedId = parseLabTestId(id);
    const response = await labTestApi.get(parsedId);
    return normalizeLabTest(response.data);
  });

const createLabTest = async (payload) =>
  execute(async () => {
    const parsed = parseLabTestPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_TESTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeLabTest(parsed);
    }
    const response = await labTestApi.create(parsed);
    return normalizeLabTest(response.data);
  });

const updateLabTest = async (id, payload) =>
  execute(async () => {
    const parsedId = parseLabTestId(id);
    const parsed = parseLabTestPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_TESTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeLabTest({ id: parsedId, ...parsed });
    }
    const response = await labTestApi.update(parsedId, parsed);
    return normalizeLabTest(response.data);
  });

const deleteLabTest = async (id) =>
  execute(async () => {
    const parsedId = parseLabTestId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.LAB_TESTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeLabTest({ id: parsedId });
    }
    const response = await labTestApi.remove(parsedId);
    return normalizeLabTest(response.data);
  });

export { listLabTests, getLabTest, createLabTest, updateLabTest, deleteLabTest };
