/**
 * Ambulance Dispatch Use Cases
 * File: ambulance-dispatch.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { ambulanceDispatchApi } from './ambulance-dispatch.api';
import {
  normalizeAmbulanceDispatch,
  normalizeAmbulanceDispatchList,
} from './ambulance-dispatch.model';
import {
  parseAmbulanceDispatchId,
  parseAmbulanceDispatchListParams,
  parseAmbulanceDispatchPayload,
} from './ambulance-dispatch.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listAmbulanceDispatches = async (params = {}) =>
  execute(async () => {
    const parsed = parseAmbulanceDispatchListParams(params);
    const response = await ambulanceDispatchApi.list(parsed);
    return normalizeAmbulanceDispatchList(response.data);
  });

const getAmbulanceDispatch = async (id) =>
  execute(async () => {
    const parsedId = parseAmbulanceDispatchId(id);
    const response = await ambulanceDispatchApi.get(parsedId);
    return normalizeAmbulanceDispatch(response.data);
  });

const createAmbulanceDispatch = async (payload) =>
  execute(async () => {
    const parsed = parseAmbulanceDispatchPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.AMBULANCE_DISPATCHES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeAmbulanceDispatch(parsed);
    }
    const response = await ambulanceDispatchApi.create(parsed);
    return normalizeAmbulanceDispatch(response.data);
  });

const updateAmbulanceDispatch = async (id, payload) =>
  execute(async () => {
    const parsedId = parseAmbulanceDispatchId(id);
    const parsed = parseAmbulanceDispatchPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.AMBULANCE_DISPATCHES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeAmbulanceDispatch({ id: parsedId, ...parsed });
    }
    const response = await ambulanceDispatchApi.update(parsedId, parsed);
    return normalizeAmbulanceDispatch(response.data);
  });

const deleteAmbulanceDispatch = async (id) =>
  execute(async () => {
    const parsedId = parseAmbulanceDispatchId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.AMBULANCE_DISPATCHES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeAmbulanceDispatch({ id: parsedId });
    }
    const response = await ambulanceDispatchApi.remove(parsedId);
    return normalizeAmbulanceDispatch(response.data);
  });

export {
  listAmbulanceDispatches,
  getAmbulanceDispatch,
  createAmbulanceDispatch,
  updateAmbulanceDispatch,
  deleteAmbulanceDispatch,
};
