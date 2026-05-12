/**
 * Auth Model Tests
 * File: auth.model.test.js
 */
import { normalizeAuthResponse, normalizeAuthTokens, normalizeAuthUser } from '@features/auth';

describe('auth.model', () => {
  it('normalizes auth user and tokens', () => {
    expect(normalizeAuthUser(null)).toBeNull();
    expect(normalizeAuthUser({ id: '1', name: 'User' })).toEqual({ id: '1', name: 'User' });
    expect(normalizeAuthTokens(null)).toBeNull();
    expect(normalizeAuthTokens({ access_token: 'a', refresh_token: 'b' })).toEqual({
      accessToken: 'a',
      refreshToken: 'b',
    });
  });

  it('normalizes auth response', () => {
    expect(normalizeAuthResponse(null)).toEqual({ user: null, tokens: null });
    expect(normalizeAuthResponse({ user: { id: '2' }, tokens: { accessToken: 'a' } })).toEqual({
      user: { id: '2' },
      tokens: { accessToken: 'a', refreshToken: null },
    });
  });
});
