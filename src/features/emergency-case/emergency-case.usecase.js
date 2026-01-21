/**
 * Emergency Case Use Cases
 * File: emergency-case.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { emergencyCaseApi } from './emergency-case.api';
import { normalizeEmergencyCase, normalizeEmergencyCaseList } from './emergency-case.model';
import {
  parseEmergencyCaseId,
  parseEmergencyCaseListParams,
  parseEmergencyCasePayload,
} from './emergency-case.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEmergencyCases = async (params = {}) =>
  execute(async () => {
    const parsed = parseEmergencyCaseListParams(params);
    const response = await emergencyCaseApi.list(parsed);
    return normalizeEmergencyCaseList(response.data);
  });

const getEmergencyCase = async (id) =>
  execute(async () => {
    const parsedId = parseEmergencyCaseId(id);
    const response = await emergencyCaseApi.get(parsedId);
    return normalizeEmergencyCase(response.data);
  });

const createEmergencyCase = async (payload) =>
  execute(async () => {
    const parsed = parseEmergencyCasePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EMERGENCY_CASES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEmergencyCase(parsed);
    }
    const response = await emergencyCaseApi.create(parsed);
    return normalizeEmergencyCase(response.data);
  });

const updateEmergencyCase = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEmergencyCaseId(id);
    const parsed = parseEmergencyCasePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EMERGENCY_CASES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEmergencyCase({ id: parsedId, ...parsed });
    }
    const response = await emergencyCaseApi.update(parsedId, parsed);
    return normalizeEmergencyCase(response.data);
  });

const deleteEmergencyCase = async (id) =>
  execute(async () => {
    const parsedId = parseEmergencyCaseId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EMERGENCY_CASES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEmergencyCase({ id: parsedId });
    }
    const response = await emergencyCaseApi.remove(parsedId);
    return normalizeEmergencyCase(response.data);
  });

export {
  listEmergencyCases,
  getEmergencyCase,
  createEmergencyCase,
  updateEmergencyCase,
  deleteEmergencyCase,
};
