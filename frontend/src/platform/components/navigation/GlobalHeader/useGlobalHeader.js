/**
 * useGlobalHeader Hook
 * Shared logic for GlobalHeader component
 * File: useGlobalHeader.js
 */
import { useMemo } from 'react';
import { ACTION_PLACEMENTS } from './types';

const normalizeRole = (role) => {
  if (typeof role !== 'string') return null;
  const normalized = role.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
};

const isActionVisible = (action, currentRole) => {
  if (!action || action.isVisible === false) return false;
  const roles = Array.isArray(action.roles) ? action.roles : [];
  if (roles.length === 0) return true;
  if (!currentRole) return false;
  const normalizedRoles = roles.map((role) => String(role).trim().toLowerCase());
  return normalizedRoles.includes(currentRole);
};

const splitActions = (actions) => {
  return actions.reduce(
    (acc, action) => {
      if (action.placement === ACTION_PLACEMENTS.SECONDARY) {
        acc.secondaryActions.push(action);
      } else {
        acc.primaryActions.push(action);
      }
      return acc;
    },
    { primaryActions: [], secondaryActions: [] }
  );
};

/**
 * GlobalHeader hook
 * @param {Object} options - Hook options
 * @param {Array} [options.actions] - Action definitions
 * @param {string} [options.currentRole] - Current user role
 * @param {Array} [options.breadcrumbs] - Breadcrumb items
 * @returns {Object} Header state helpers
 */
const useGlobalHeader = ({ actions = [], currentRole, breadcrumbs } = {}) => {
  const normalizedRole = normalizeRole(currentRole);

  const visibleActions = useMemo(() => {
    if (!Array.isArray(actions)) return [];
    return actions.filter((action) => isActionVisible(action, normalizedRole));
  }, [actions, normalizedRole]);

  const { primaryActions, secondaryActions } = useMemo(() => {
    return splitActions(visibleActions);
  }, [visibleActions]);

  const hasBreadcrumbs = Array.isArray(breadcrumbs) && breadcrumbs.length > 0;

  return {
    primaryActions,
    secondaryActions,
    hasBreadcrumbs,
  };
};

export default useGlobalHeader;
