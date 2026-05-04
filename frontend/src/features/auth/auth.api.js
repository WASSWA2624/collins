/**
 * Auth API
 * Auth service orchestration
 * File: auth.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient } from '@services/api';

const identifyApi = (payload) =>
  apiClient({
    url: endpoints.AUTH.IDENTIFY,
    method: 'POST',
    body: payload,
  });

const loginApi = (payload) =>
  apiClient({
    url: endpoints.AUTH.LOGIN,
    method: 'POST',
    body: payload,
  });

const logoutApi = () =>
  apiClient({
    url: endpoints.AUTH.LOGOUT,
    method: 'POST',
  });

const refreshApi = (payload) =>
  apiClient({
    url: endpoints.AUTH.REFRESH,
    method: 'POST',
    body: payload,
  });

const registerApi = (payload) =>
  apiClient({
    url: endpoints.AUTH.REGISTER,
    method: 'POST',
    body: payload,
  });

const verifyEmailApi = (payload) =>
  apiClient({
    url: endpoints.AUTH.VERIFY_EMAIL,
    method: 'POST',
    body: payload,
  });

const verifyPhoneApi = (payload) =>
  apiClient({
    url: endpoints.AUTH.VERIFY_PHONE,
    method: 'POST',
    body: payload,
  });

const resendVerificationApi = (payload) =>
  apiClient({
    url: endpoints.AUTH.RESEND_VERIFICATION,
    method: 'POST',
    body: payload,
  });

const forgotPasswordApi = (payload) =>
  apiClient({
    url: endpoints.AUTH.FORGOT_PASSWORD,
    method: 'POST',
    body: payload,
  });

const resetPasswordApi = (payload) =>
  apiClient({
    url: endpoints.AUTH.RESET_PASSWORD,
    method: 'POST',
    body: payload,
  });

const changePasswordApi = (payload) =>
  apiClient({
    url: endpoints.AUTH.CHANGE_PASSWORD,
    method: 'POST',
    body: payload,
  });

const getCurrentUserApi = () =>
  apiClient({
    url: endpoints.AUTH.ME,
    method: 'GET',
  });

export {
  identifyApi,
  loginApi,
  logoutApi,
  refreshApi,
  registerApi,
  verifyEmailApi,
  verifyPhoneApi,
  resendVerificationApi,
  forgotPasswordApi,
  resetPasswordApi,
  changePasswordApi,
  getCurrentUserApi,
};
