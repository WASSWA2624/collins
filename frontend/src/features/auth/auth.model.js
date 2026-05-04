/**
 * Auth Model
 * Normalizes auth responses
 * File: auth.model.js
 */

const normalizeAuthUser = (value) => {
  if (!value || typeof value !== 'object') return null;
  const { id = null, ...rest } = value;
  return { id, ...rest };
};

const normalizeAuthTokens = (value) => {
  if (!value || typeof value !== 'object') return null;
  const accessToken = value.accessToken || value.access_token || null;
  const refreshToken = value.refreshToken || value.refresh_token || null;
  if (!accessToken && !refreshToken) return null;
  return { accessToken, refreshToken };
};

const normalizeAuthResponse = (value) => {
  if (!value || typeof value !== 'object') return { user: null, tokens: null };
  const userSource = value.user || value.profile || value;
  const user = normalizeAuthUser(userSource);
  const tokensSource = value.tokens || value;
  const tokens = normalizeAuthTokens(tokensSource);
  return { user, tokens };
};

export { normalizeAuthUser, normalizeAuthTokens, normalizeAuthResponse };
