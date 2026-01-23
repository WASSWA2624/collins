/**
 * useUserSession Hook Tests
 * File: useUserSession.test.js
 */
jest.mock('@features/user-session', () => ({
  listUserSessions: jest.fn(),
  getUserSession: jest.fn(),
  revokeUserSession: jest.fn(),
}));

import useUserSession from '@hooks/useUserSession';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useUserSession', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useUserSession);
    expectCrudHook(result, ['list', 'get', 'revoke']);
  });
});
