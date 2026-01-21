/**
 * Ambulance Trip Use Cases
 * File: ambulance-trip.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { ambulanceTripApi } from './ambulance-trip.api';
import { normalizeAmbulanceTrip, normalizeAmbulanceTripList } from './ambulance-trip.model';
import { parseAmbulanceTripId, parseAmbulanceTripListParams, parseAmbulanceTripPayload } from './ambulance-trip.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listAmbulanceTrips = async (params = {}) =>
  execute(async () => {
    const parsed = parseAmbulanceTripListParams(params);
    const response = await ambulanceTripApi.list(parsed);
    return normalizeAmbulanceTripList(response.data);
  });

const getAmbulanceTrip = async (id) =>
  execute(async () => {
    const parsedId = parseAmbulanceTripId(id);
    const response = await ambulanceTripApi.get(parsedId);
    return normalizeAmbulanceTrip(response.data);
  });

const createAmbulanceTrip = async (payload) =>
  execute(async () => {
    const parsed = parseAmbulanceTripPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.AMBULANCE_TRIPS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeAmbulanceTrip(parsed);
    }
    const response = await ambulanceTripApi.create(parsed);
    return normalizeAmbulanceTrip(response.data);
  });

const updateAmbulanceTrip = async (id, payload) =>
  execute(async () => {
    const parsedId = parseAmbulanceTripId(id);
    const parsed = parseAmbulanceTripPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.AMBULANCE_TRIPS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeAmbulanceTrip({ id: parsedId, ...parsed });
    }
    const response = await ambulanceTripApi.update(parsedId, parsed);
    return normalizeAmbulanceTrip(response.data);
  });

const deleteAmbulanceTrip = async (id) =>
  execute(async () => {
    const parsedId = parseAmbulanceTripId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.AMBULANCE_TRIPS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeAmbulanceTrip({ id: parsedId });
    }
    const response = await ambulanceTripApi.remove(parsedId);
    return normalizeAmbulanceTrip(response.data);
  });

export { listAmbulanceTrips, getAmbulanceTrip, createAmbulanceTrip, updateAmbulanceTrip, deleteAmbulanceTrip };
