/**
 * useNavigationVisibility Hook
 * Visibility for nav items (used with items from config/sideMenu).
 * File: useNavigationVisibility.js
 */
import { useCallback } from 'react';
import useAuth from './useAuth';
import { canAccessNavigationItem } from '@config/accessControl';

/**
 * @returns {Object} isItemVisible(item) - true when auth and item role requirements allow it
 */
const useNavigationVisibility = () => {
  const { isAuthenticated, user } = useAuth();

  const isItemVisible = useCallback((item) => {
    return canAccessNavigationItem({ item, user, isAuthenticated });
  }, [isAuthenticated, user]);

  return { isItemVisible };
};

export default useNavigationVisibility;
