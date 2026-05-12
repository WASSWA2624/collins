import { handleError } from '@errors';
import {
  createFacilityApi,
  deleteFacilityApi,
  listAdminFacilitiesApi,
  searchFacilitiesApi,
  updateFacilityApi,
} from './facilities.api';
import {
  normalizeAdminFacilitiesResponse,
  normalizeFacilitiesResponse,
  normalizeFacilityResponse,
} from './facilities.model';

const unwrap = (res) => res?.data ?? res;

const searchFacilitiesUseCase = async (params = {}) => {
  try {
    const body = unwrap(await searchFacilitiesApi(params));
    return normalizeFacilitiesResponse({
      data: body?.data || [],
      meta: body?.meta || {},
    });
  } catch (error) {
    throw handleError(error);
  }
};

const listAdminFacilitiesUseCase = async () => {
  try {
    const body = unwrap(await listAdminFacilitiesApi());
    return normalizeAdminFacilitiesResponse({
      data: body?.data || [],
      meta: body?.meta || {},
    });
  } catch (error) {
    throw handleError(error);
  }
};

const createFacilityUseCase = async (payload) => {
  try {
    const body = unwrap(await createFacilityApi(payload));
    return normalizeFacilityResponse(body?.data || body);
  } catch (error) {
    throw handleError(error);
  }
};

const updateFacilityUseCase = async (id, payload) => {
  try {
    const body = unwrap(await updateFacilityApi(id, payload));
    return normalizeFacilityResponse(body?.data || body);
  } catch (error) {
    throw handleError(error);
  }
};

const deleteFacilityUseCase = async (id) => {
  try {
    const body = unwrap(await deleteFacilityApi(id));
    return normalizeFacilityResponse(body?.data || body);
  } catch (error) {
    throw handleError(error);
  }
};

export {
  createFacilityUseCase,
  deleteFacilityUseCase,
  listAdminFacilitiesUseCase,
  searchFacilitiesUseCase,
  updateFacilityUseCase,
};
