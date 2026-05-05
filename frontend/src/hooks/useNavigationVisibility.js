/**
 * useNavigationVisibility Hook
 * Visibility for role-aware nav items.
 * File: useNavigationVisibility.js
 */
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { canAccessNavigationItem } from '@config/accessControl';
import { selectIsAuthenticated, selectUser } from '@store/selectors';

/**
 * @returns {Object} isItemVisible(item) - true when auth, facility, roles, and permissions allow it
 */
const useNavigationVisibility = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const isItemVisible = useCallback((item) => {
    return canAccessNavigationItem({ item, user, isAuthenticated });
  }, [isAuthenticated, user]);

  return { isItemVisible };
};

export default useNavigationVisibility;
