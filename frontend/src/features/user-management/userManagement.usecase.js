import { handleError } from '@errors';
import {
  assignManagedUserMembershipsApi,
  createManagedUserApi,
  listManagedUsersApi,
  searchFacilitiesForUserManagementApi,
  updateManagedUserMembershipApi,
} from './userManagement.api';
import {
  normalizeFacilitiesResponse,
  normalizeManagedUser,
  normalizeManagedUsersResponse,
} from './userManagement.model';

const unwrap = (res) => res?.data ?? res;

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listManagedUsersUseCase = async (params = {}) =>
  execute(async () => {
    const body = unwrap(await listManagedUsersApi(params));
    return normalizeManagedUsersResponse({
      data: body?.data || [],
      meta: body?.meta || {},
    });
  });

const createManagedUserUseCase = async (payload) =>
  execute(async () => {
    const body = unwrap(await createManagedUserApi(payload));
    return normalizeManagedUser(body?.data?.user || body?.user || {});
  });

const assignManagedUserMembershipsUseCase = async (userId, payload) =>
  execute(async () => {
    const body = unwrap(await assignManagedUserMembershipsApi(userId, payload));
    return normalizeManagedUser(body?.data?.user || body?.user || {});
  });

const updateManagedUserMembershipUseCase = async (userId, membershipId, payload) =>
  execute(async () => {
    const body = unwrap(await updateManagedUserMembershipApi(userId, membershipId, payload));
    return normalizeManagedUser(body?.data?.user || body?.user || {});
  });

const searchFacilitiesForUserManagementUseCase = async (params = {}) =>
  execute(async () => {
    const body = unwrap(await searchFacilitiesForUserManagementApi(params));
    return normalizeFacilitiesResponse({
      data: body?.data || [],
      meta: body?.meta || {},
    });
  });

export {
  assignManagedUserMembershipsUseCase,
  createManagedUserUseCase,
  listManagedUsersUseCase,
  searchFacilitiesForUserManagementUseCase,
  updateManagedUserMembershipUseCase,
};
