/**
 * Auth Use Cases
 * File: auth.usecase.js
 * Backend response-format.mdc: success body is { status, message, data, meta }; unwrap data.
 */
import { handleError } from '@errors';
import { tokenManager } from '@security';
import { clearCsrfToken } from '@services/csrf';
import { normalizeAuthResponse } from './auth.model';
import {
  changePasswordApi,
  forgotPasswordApi,
  getCurrentUserApi,
  identifyApi,
  loginApi,
  logoutApi,
  refreshApi,
  registerApi,
  resendVerificationApi,
  resetPasswordApi,
  verifyEmailApi,
  verifyPhoneApi,
} from './auth.api';
import { parseAuthPayload, parseCredentials } from './auth.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

/** Unwrap backend success body: { status, message, data, meta } -> data */
const unwrap = (res) => res?.data?.data ?? res?.data;

const SESSION_CLEAR_CODES = new Set([
  'UNAUTHORIZED',
  'TOKEN_EXPIRED',
  'TOKEN_INVALID',
  'REFRESH_TOKEN_INVALID',
  'SESSION_NOT_FOUND',
]);

const shouldClearStoredSession = (error) => SESSION_CLEAR_CODES.has(error?.code);

const clearStoredSession = async () => {
  await tokenManager.clearTokens();
  clearCsrfToken();
};

const normalizeSessionError = (error) => (error?.code ? error : handleError(error));

const requireStoredAuthSession = async (data) => {
  const { user, tokens } = normalizeAuthResponse(data);

  if (!user?.id || !tokens?.accessToken || !tokens?.refreshToken) {
    throw {
      code: 'BACKEND_INVALID_RESPONSE',
      message: 'Invalid auth response',
      status: 502,
    };
  }

  const didStoreTokens = await tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
  if (!didStoreTokens) {
    throw {
      code: 'SESSION_STORAGE_FAILED',
      message: 'Unable to save auth session',
      status: 500,
    };
  }

  return user;
};

const refreshStoredTokens = async (payload = {}) => {
  const refreshToken = await tokenManager.getRefreshToken();
  if (!refreshToken) {
    throw {
      status: 401,
      message: 'Authentication required',
    };
  }

  const response = await refreshApi({
    ...payload,
    refreshToken,
  });
  const data = unwrap(response);
  const { tokens } = normalizeAuthResponse(data);

  if (tokens?.accessToken && tokens?.refreshToken) {
    await tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
  }

  return { data, tokens };
};

const identifyUseCase = async (payload) =>
  execute(async () => {
    const { identifier } = payload;
    if (!identifier) {
      throw new Error('Identifier is required');
    }
    const response = await identifyApi({ identifier });
    const result = unwrap(response);
    return result && Array.isArray(result.users) ? result : { users: [] };
  });

const loginUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseCredentials(payload);
    const response = await loginApi(parsed);
    const data = unwrap(response);
    return requireStoredAuthSession(data);
  });

const registerUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await registerApi(parsed);
    const data = unwrap(response);
    return requireStoredAuthSession(data);
  });

const logoutUseCase = async () =>
  execute(async () => {
    try {
      const refreshToken = await tokenManager.getRefreshToken();
      await logoutApi(refreshToken ? { refreshToken } : undefined);
    } catch {
      // Local logout must still succeed when the network is unavailable.
    } finally {
      await clearStoredSession();
    }
    return true;
  });

const refreshSessionUseCase = async (payload = {}) =>
  execute(async () => {
    const { tokens } = await refreshStoredTokens(payload);
    return tokens;
  });

const loadCurrentUserUseCase = async () =>
  execute(async () => {
    const response = await getCurrentUserApi();
    const data = unwrap(response);
    const { user } = normalizeAuthResponse(data);
    return user;
  });

const restoreSessionUseCase = async () => {
  try {
    const accessToken = await tokenManager.getAccessToken();
    const refreshToken = await tokenManager.getRefreshToken();

    if (!accessToken && !refreshToken) return null;

    if (accessToken && !tokenManager.isTokenExpired(accessToken)) {
      return await loadCurrentUserUseCase();
    }

    await refreshStoredTokens();
    return await loadCurrentUserUseCase();
  } catch (error) {
    const normalized = normalizeSessionError(error);
    if (shouldClearStoredSession(normalized)) {
      await clearStoredSession();
    }
    throw normalized;
  }
};

const selectActiveFacilityUseCase = async ({ activeFacilityId, facilityId } = {}) => {
  try {
    const requestedFacilityId = activeFacilityId || facilityId;
    if (!requestedFacilityId) {
      throw new Error('Active facility is required');
    }

    await refreshStoredTokens({ activeFacilityId: requestedFacilityId });
    return await loadCurrentUserUseCase();
  } catch (error) {
    const normalized = normalizeSessionError(error);
    if (shouldClearStoredSession(normalized)) {
      await clearStoredSession();
    }
    throw normalized;
  }
};

const verifyEmailUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await verifyEmailApi(parsed);
    return unwrap(response) ?? null;
  });

const verifyPhoneUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await verifyPhoneApi(parsed);
    return unwrap(response) ?? null;
  });

const resendVerificationUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await resendVerificationApi(parsed);
    return unwrap(response) ?? null;
  });

const forgotPasswordUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await forgotPasswordApi(parsed);
    return unwrap(response) ?? null;
  });

const resetPasswordUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await resetPasswordApi(parsed);
    return unwrap(response) ?? null;
  });

const changePasswordUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await changePasswordApi(parsed);
    return unwrap(response) ?? null;
  });

export {
  identifyUseCase,
  loginUseCase,
  registerUseCase,
  logoutUseCase,
  refreshSessionUseCase,
  loadCurrentUserUseCase,
  restoreSessionUseCase,
  selectActiveFacilityUseCase,
  verifyEmailUseCase,
  verifyPhoneUseCase,
  resendVerificationUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  changePasswordUseCase,
};
