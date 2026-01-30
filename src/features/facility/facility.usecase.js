/**
 * Facility Use Cases
 * File: facility.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { getFacilityBranchesApi, facilityApi } from './facility.api';
import { normalizeFacility, normalizeFacilityList } from './facility.model';
import { parseFacilityId, parseFacilityListParams, parseFacilityPayload } from './facility.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

/** Backend sends { status, message, data, meta }; apiClient returns { data: body }. Unwrap payload. */
const getPayload = (response) =>
  (response?.data?.data !== undefined ? response.data.data : response?.data);

const listFacilities = async (params = {}) =>
  execute(async () => {
    const parsed = parseFacilityListParams(params);
    const response = await facilityApi.list(parsed);
    return normalizeFacilityList(getPayload(response) ?? []);
  });

const getFacility = async (id) =>
  execute(async () => {
    const parsedId = parseFacilityId(id);
    const response = await facilityApi.get(parsedId);
    return normalizeFacility(getPayload(response));
  });

const createFacility = async (payload) =>
  execute(async () => {
    const parsed = parseFacilityPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.FACILITIES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeFacility(parsed);
    }
    const response = await facilityApi.create(parsed);
    return normalizeFacility(getPayload(response));
  });

const updateFacility = async (id, payload) =>
  execute(async () => {
    const parsedId = parseFacilityId(id);
    const parsed = parseFacilityPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.FACILITIES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeFacility({ id: parsedId, ...parsed });
    }
    const response = await facilityApi.update(parsedId, parsed);
    return normalizeFacility(getPayload(response));
  });

const deleteFacility = async (id) =>
  execute(async () => {
    const parsedId = parseFacilityId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.FACILITIES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeFacility({ id: parsedId });
    }
    await facilityApi.remove(parsedId);
    return normalizeFacility({ id: parsedId });
  });

const listFacilityBranches = async (id) =>
  execute(async () => {
    const parsedId = parseFacilityId(id);
    const response = await getFacilityBranchesApi(parsedId);
    return normalizeFacilityList(getPayload(response) ?? []);
  });

export {
  listFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  listFacilityBranches,
};
