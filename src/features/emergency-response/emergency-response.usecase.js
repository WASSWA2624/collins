/**
 * Emergency Response Use Cases
 * File: emergency-response.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { emergencyResponseApi } from './emergency-response.api';
import { normalizeEmergencyResponse, normalizeEmergencyResponseList } from './emergency-response.model';
import {
  parseEmergencyResponseId,
  parseEmergencyResponseListParams,
  parseEmergencyResponsePayload,
} from './emergency-response.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEmergencyResponses = async (params = {}) =>
  execute(async () => {
    const parsed = parseEmergencyResponseListParams(params);
    const response = await emergencyResponseApi.list(parsed);
    return normalizeEmergencyResponseList(response.data);
  });

const getEmergencyResponse = async (id) =>
  execute(async () => {
    const parsedId = parseEmergencyResponseId(id);
    const response = await emergencyResponseApi.get(parsedId);
    return normalizeEmergencyResponse(response.data);
  });

const createEmergencyResponse = async (payload) =>
  execute(async () => {
    const parsed = parseEmergencyResponsePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EMERGENCY_RESPONSES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEmergencyResponse(parsed);
    }
    const response = await emergencyResponseApi.create(parsed);
    return normalizeEmergencyResponse(response.data);
  });

const updateEmergencyResponse = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEmergencyResponseId(id);
    const parsed = parseEmergencyResponsePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EMERGENCY_RESPONSES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEmergencyResponse({ id: parsedId, ...parsed });
    }
    const response = await emergencyResponseApi.update(parsedId, parsed);
    return normalizeEmergencyResponse(response.data);
  });

const deleteEmergencyResponse = async (id) =>
  execute(async () => {
    const parsedId = parseEmergencyResponseId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EMERGENCY_RESPONSES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEmergencyResponse({ id: parsedId });
    }
    const response = await emergencyResponseApi.remove(parsedId);
    return normalizeEmergencyResponse(response.data);
  });

export {
  listEmergencyResponses,
  getEmergencyResponse,
  createEmergencyResponse,
  updateEmergencyResponse,
  deleteEmergencyResponse,
};
