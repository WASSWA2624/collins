import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const listManagedUsersApi = (params = {}) =>
  apiClient({
    url: `${endpoints.ADMIN.USERS}${buildQueryString(params)}`,
    method: 'GET',
  });

const createManagedUserApi = (payload) =>
  apiClient({
    url: endpoints.ADMIN.USERS,
    method: 'POST',
    body: payload,
  });

const assignManagedUserMembershipsApi = (userId, payload) =>
  apiClient({
    url: endpoints.ADMIN.USER_MEMBERSHIPS(userId),
    method: 'POST',
    body: payload,
  });

const updateManagedUserStatusApi = (userId, payload) =>
  apiClient({
    url: endpoints.ADMIN.USER(userId),
    method: 'PATCH',
    body: payload,
  });

const updateManagedUserMembershipApi = (userId, membershipId, payload) =>
  apiClient({
    url: endpoints.ADMIN.USER_MEMBERSHIP(userId, membershipId),
    method: 'PATCH',
    body: payload,
  });

const searchFacilitiesForUserManagementApi = (params = {}) =>
  apiClient({
    url: `${endpoints.FACILITIES.SEARCH}${buildQueryString(params)}`,
    method: 'GET',
  });

export {
  assignManagedUserMembershipsApi,
  createManagedUserApi,
  listManagedUsersApi,
  searchFacilitiesForUserManagementApi,
  updateManagedUserStatusApi,
  updateManagedUserMembershipApi,
};
