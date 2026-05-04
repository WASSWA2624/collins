/**
 * Token Manager
 * Handles JWT token lifecycle
 * File: token.manager.js
 */
import { secure } from '@services/storage';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

const getAccessToken = async () => {
  return await secure.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

const getRefreshToken = async () => {
  return await secure.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

const setTokens = async (accessToken, refreshToken) => {
  const results = await Promise.all([
    secure.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken),
    secure.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken),
  ]);
  return results.every(Boolean);
};

const clearTokens = async () => {
  await Promise.all([
    secure.removeItem(TOKEN_KEYS.ACCESS_TOKEN),
    secure.removeItem(TOKEN_KEYS.REFRESH_TOKEN),
  ]);
};

const decodeBase64 = (value) => {
  if (typeof value !== 'string') return null;

  // base64url -> base64
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
  const normalized = `${base64}${padding}`;

  if (typeof globalThis?.atob === 'function') {
    try {
      return globalThis.atob(normalized);
    } catch {
      return null;
    }
  }

  // Jest/Node fallback
  // eslint-disable-next-line no-undef
  if (typeof Buffer !== 'undefined') {
    // eslint-disable-next-line no-undef
    return Buffer.from(normalized, 'base64').toString('utf8');
  }

  return null;
};

const getJwtPayload = (token) => {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;

  const decoded = decodeBase64(parts[1]);
  if (!decoded) return null;

  try {
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  if (!token) return true;

  const payload = getJwtPayload(token);
  const expSeconds = payload?.exp;
  if (typeof expSeconds !== 'number' || !Number.isFinite(expSeconds)) return true;

  const expMs = expSeconds * 1000;
  return Date.now() >= expMs;
};

export { getAccessToken, getRefreshToken, setTokens, clearTokens, isTokenExpired };

