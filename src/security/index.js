/**
 * Security Barrel Export
 * File: index.js
 */
import * as tokenManagerModule from './token.manager';

export const tokenManager = {
  getAccessToken: tokenManagerModule.getAccessToken,
  getRefreshToken: tokenManagerModule.getRefreshToken,
  setTokens: tokenManagerModule.setTokens,
  clearTokens: tokenManagerModule.clearTokens,
  isTokenExpired: tokenManagerModule.isTokenExpired,
};

export {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  isTokenExpired,
} from './token.manager';

export * from './encryption';
export * from './biometric';

