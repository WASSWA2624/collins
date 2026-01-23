/**
 * User Session Usecase Tests
 * File: user-session.usecase.test.js
 */
import { listUserSessions, getUserSession, revokeUserSession } from '@features/user-session';
import {
  listUserSessionsApi,
  getUserSessionApi,
  deleteUserSessionApi,
} from '@features/user-session/user-session.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/user-session/user-session.api', () => ({
  listUserSessionsApi: jest.fn(),
  getUserSessionApi: jest.fn(),
  deleteUserSessionApi: jest.fn(),
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

const pagination = {
  page: 1,
  limit: 20,
  total: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

describe('user-session.usecase', () => {
  beforeEach(() => {
    listUserSessionsApi.mockResolvedValue({
      data: { data: [{ id: '1' }], pagination },
    });
    getUserSessionApi.mockResolvedValue({ data: { data: { id: '1' } } });
    deleteUserSessionApi.mockResolvedValue({ data: null, status: 204 });
  });

  runCrudUsecaseTests(
    {
      list: listUserSessions,
      get: getUserSession,
      remove: revokeUserSession,
    },
    { queueRequestIfOffline }
  );
});
