import crypto from 'crypto';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { getCurrentUser, loginUser, registerUser } from './auth.service.js';

export const csrfToken = (_req, res) => successResponse(res, {
  message: 'CSRF token issued',
  data: { csrfToken: crypto.randomBytes(24).toString('hex') },
});

export const identify = (_req, res) => successResponse(res, {
  message: 'Auth capabilities loaded',
  data: {
    registrationEnabled: true,
    passwordLoginEnabled: true,
    mfaEnabled: false,
  },
});

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.validated.body);
  return successResponse(res, {
    status: 201,
    message: 'User registered',
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.validated.body);
  return successResponse(res, {
    message: 'Login successful',
    data: result,
  });
});

export const refresh = (_req, res) => successResponse(res, {
  status: 202,
  message: 'Refresh-token rotation is planned for the next auth hardening phase',
  data: { planned: true },
});

export const logout = (_req, res) => successResponse(res, {
  message: 'Logout accepted',
  data: null,
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user?.sub);
  return successResponse(res, {
    message: 'Current user loaded',
    data: { user },
  });
});

export const plannedAuth = (featureName) => (_req, res) => successResponse(res, {
  status: 202,
  message: `${featureName} is registered and planned for a later auth phase`,
  data: { planned: true, featureName },
});
