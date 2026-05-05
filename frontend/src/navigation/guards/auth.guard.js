/**
 * Auth guards
 * Protect clinical routes until session restore and facility context are known.
 * File: auth.guard.js
 */
import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import {
  selectAuthHasRestoredSession,
  selectAuthLoading,
  selectIsAuthenticated,
  selectRequiresActiveFacility,
} from '@store/selectors';

const LOGIN_PATH = '/login';
const FACILITY_PATH = '/select-facility';
const HOME_PATH = '/';

export function useAuthGuard() {
  const hasRestoredSession = useSelector(selectAuthHasRestoredSession);
  const isLoading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const requiresActiveFacility = useSelector(selectRequiresActiveFacility);
  const isReady = hasRestoredSession && !isLoading;

  let redirectTo = null;
  if (isReady && !isAuthenticated) {
    redirectTo = LOGIN_PATH;
  } else if (isReady && requiresActiveFacility) {
    redirectTo = FACILITY_PATH;
  }

  return {
    isReady,
    isAuthenticated,
    requiresActiveFacility,
    redirectTo,
  };
}

export function AuthGuard({ children }) {
  const { isReady, redirectTo } = useAuthGuard();
  if (!isReady) return null;
  if (redirectTo) return <Redirect href={redirectTo} />;
  return children;
}

export function usePublicAuthGuard() {
  const hasRestoredSession = useSelector(selectAuthHasRestoredSession);
  const isLoading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const requiresActiveFacility = useSelector(selectRequiresActiveFacility);
  const isReady = hasRestoredSession && !isLoading;

  let redirectTo = null;
  if (isReady && isAuthenticated) {
    redirectTo = requiresActiveFacility ? FACILITY_PATH : HOME_PATH;
  }

  return {
    isReady,
    redirectTo,
  };
}

export function PublicAuthGuard({ children }) {
  const { isReady, redirectTo } = usePublicAuthGuard();
  if (!isReady) return null;
  if (redirectTo) return <Redirect href={redirectTo} />;
  return children;
}

