/**
 * useAuth Hook
 * Provides minimal auth state from Redux for UI guards/navigation.
 * File: useAuth.js
 */
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveFacility,
  selectAuthErrorCode,
  selectAuthHasRestoredSession,
  selectAuthLoading,
  selectAuthSessionErrorCode,
  selectAuthSessionStatus,
  selectIsAuthenticated,
  selectRequiresActiveFacility,
  selectUser,
} from '@store/selectors';
import { actions as authActions } from '@store/slices/auth.slice';

const normalizeRole = (role) => {
  if (!role) return null;
  return String(role).trim().toLowerCase();
};

const normalizeRoles = (roles) => {
  if (!roles) return [];
  const list = Array.isArray(roles) ? roles : [roles];
  return list.map(normalizeRole).filter(Boolean);
};

/**
 * useAuth hook
 * @returns {Object} auth state and normalized roles
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const activeFacility = useSelector(selectActiveFacility);
  const requiresActiveFacility = useSelector(selectRequiresActiveFacility);
  const isLoading = useSelector(selectAuthLoading);
  const errorCode = useSelector(selectAuthErrorCode);
  const sessionErrorCode = useSelector(selectAuthSessionErrorCode);
  const hasRestoredSession = useSelector(selectAuthHasRestoredSession);
  const sessionStatus = useSelector(selectAuthSessionStatus);

  const roles = useMemo(() => {
    const userRoles = activeFacility?.roles || user?.roles || user?.role || [];
    return normalizeRoles(userRoles);
  }, [activeFacility, user]);

  return {
    isAuthenticated,
    user: user || null,
    activeFacility,
    requiresActiveFacility,
    roles,
    role: roles[0] || null,
    isLoading: Boolean(isLoading),
    hasRestoredSession,
    sessionStatus,
    errorCode: errorCode || null,
    sessionErrorCode: sessionErrorCode || null,
    login: useCallback((payload) => dispatch(authActions.login(payload)), [dispatch]),
    register: useCallback((payload) => dispatch(authActions.register(payload)), [dispatch]),
    logout: useCallback(() => dispatch(authActions.logout()), [dispatch]),
    refreshSession: useCallback((payload) => dispatch(authActions.refreshSession(payload)), [dispatch]),
    loadCurrentUser: useCallback(() => dispatch(authActions.loadCurrentUser()), [dispatch]),
    restoreSession: useCallback(() => dispatch(authActions.restoreSession()), [dispatch]),
    selectActiveFacility: useCallback((payload) => dispatch(authActions.selectActiveFacility(payload)), [dispatch]),
    verifyEmail: useCallback((payload) => dispatch(authActions.verifyEmail(payload)), [dispatch]),
    verifyPhone: useCallback((payload) => dispatch(authActions.verifyPhone(payload)), [dispatch]),
    resendVerification: useCallback((payload) => dispatch(authActions.resendVerification(payload)), [dispatch]),
    forgotPassword: useCallback((payload) => dispatch(authActions.forgotPassword(payload)), [dispatch]),
    resetPassword: useCallback((payload) => dispatch(authActions.resetPassword(payload)), [dispatch]),
    changePassword: useCallback((payload) => dispatch(authActions.changePassword(payload)), [dispatch]),
    clearError: useCallback(() => dispatch(authActions.clearAuthError()), [dispatch]),
  };
};

export default useAuth;
