import { handleError } from '@errors';
import { searchFacilitiesApi } from './facilities.api';
import { normalizeFacilitiesResponse } from './facilities.model';

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

export {
  searchFacilitiesUseCase,
};
