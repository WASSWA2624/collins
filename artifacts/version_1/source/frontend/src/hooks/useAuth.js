/**
 * useAuth Hook
 * Provides auth, facility, role, and permission state from Redux for UI guards/navigation.
 * File: useAuth.js
 */
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveFacility,
  selectActiveFacilityRoles,
  selectAuthErrorCode,
  selectAuthHasRestoredSession,
  selectAuthLoading,
  selectAuthSessionErrorCode,
  selectAuthSessionStatus,
  selectIsAuthenticated,
  selectRequiresActiveFacility,
  selectUser,
  selectUserMemberships,
  selectUserPermissions,
  selectUserRoleKeys,
} from '@store/selectors';
import { actions as authActions } from '@store/slices/auth.slice';
import { normalizeRoleSlugs } from '@config/accessControl';

/**
 * useAuth hook
 * @returns {Object} auth state, active facility, normalized roles, and permissions
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);
  const errorCode = useSelector(selectAuthErrorCode);
  const sessionErrorCode = useSelector(selectAuthSessionErrorCode);
  const requiresActiveFacility = useSelector(selectRequiresActiveFacility);
  const hasRestoredSession = useSelector(selectAuthHasRestoredSession);
  const sessionStatus = useSelector(selectAuthSessionStatus);
  const roleKeys = useSelector(selectUserRoleKeys);
  const activeFacility = useSelector(selectActiveFacility);
  const activeFacilityRoles = useSelector(selectActiveFacilityRoles);
  const memberships = useSelector(selectUserMemberships);
  const permissions = useSelector(selectUserPermissions);

  const roles = useMemo(() => normalizeRoleSlugs(roleKeys), [roleKeys]);

  return {
    isAuthenticated,
    user: user || null,
    roles,
    role: roles[0] || null,
    roleKeys,
    activeFacility,
    activeFacilityId: activeFacility?.facilityId || activeFacility?.id || null,
    activeFacilityRoles,
    memberships,
    permissions,
    requiresActiveFacility,
    hasRestoredSession,
    sessionStatus,
    isLoading: Boolean(isLoading),
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
    setActiveFacilityId: useCallback(
      (facilityId) => dispatch(authActions.setActiveFacilityId(facilityId)),
      [dispatch]
    ),
    clearError: useCallback(() => dispatch(authActions.clearAuthError()), [dispatch]),
  };
};

export default useAuth;
