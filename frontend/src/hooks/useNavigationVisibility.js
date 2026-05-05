/**
 * useNavigationVisibility Hook
 * Visibility for nav items (used with items from config/sideMenu).
 * File: useNavigationVisibility.js
 */
import { useCallback } from 'react';
import useAuth from './useAuth';
import { normalizeRoles } from '@features/dashboard';

/**
 * @returns {Object} isItemVisible(item) - true when auth and item role requirements allow it
 */
const useNavigationVisibility = () => {
  const { isAuthenticated, roles } = useAuth();
  const normalizedRoles = normalizeRoles(roles);

  const isItemVisible = useCallback((item) => {
    if (!item || !isAuthenticated) return false;
    if (!Array.isArray(item.requiredRoles) || item.requiredRoles.length === 0) return true;
    const requiredRoles = normalizeRoles(item.requiredRoles);
    return requiredRoles.some((role) => normalizedRoles.includes(role));
  }, [isAuthenticated, normalizedRoles]);

  return { isItemVisible };
};

export default useNavigationVisibility;
