/**
 * Ambulance Use Cases
 * File: ambulance.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { ambulanceApi } from './ambulance.api';
import { normalizeAmbulance, normalizeAmbulanceList } from './ambulance.model';
import { parseAmbulanceId, parseAmbulanceListParams, parseAmbulancePayload } from './ambulance.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listAmbulances = async (params = {}) =>
  execute(async () => {
    const parsed = parseAmbulanceListParams(params);
    const response = await ambulanceApi.list(parsed);
    return normalizeAmbulanceList(response.data);
  });

const getAmbulance = async (id) =>
  execute(async () => {
    const parsedId = parseAmbulanceId(id);
    const response = await ambulanceApi.get(parsedId);
    return normalizeAmbulance(response.data);
  });

const createAmbulance = async (payload) =>
  execute(async () => {
    const parsed = parseAmbulancePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.AMBULANCES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeAmbulance(parsed);
    }
    const response = await ambulanceApi.create(parsed);
    return normalizeAmbulance(response.data);
  });

const updateAmbulance = async (id, payload) =>
  execute(async () => {
    const parsedId = parseAmbulanceId(id);
    const parsed = parseAmbulancePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.AMBULANCES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeAmbulance({ id: parsedId, ...parsed });
    }
    const response = await ambulanceApi.update(parsedId, parsed);
    return normalizeAmbulance(response.data);
  });

const deleteAmbulance = async (id) =>
  execute(async () => {
    const parsedId = parseAmbulanceId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.AMBULANCES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeAmbulance({ id: parsedId });
    }
    const response = await ambulanceApi.remove(parsedId);
    return normalizeAmbulance(response.data);
  });

export { listAmbulances, getAmbulance, createAmbulance, updateAmbulance, deleteAmbulance };
