/**
 * useGlobalFooter Hook
 * Shared logic for GlobalFooter component
 * File: useGlobalFooter.js
 */
import { useMemo } from 'react';

const normalizeRole = (role) => {
  if (typeof role !== 'string') return null;
  const normalized = role.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
};

const isItemVisible = (item, currentRole) => {
  if (!item || item.isVisible === false) return false;
  const roles = Array.isArray(item.roles) ? item.roles : [];
  if (roles.length === 0) return true;
  if (!currentRole) return false;
  const normalizedRoles = roles.map((role) => String(role).trim().toLowerCase());
  return normalizedRoles.includes(currentRole);
};

const filterItems = (items, currentRole) => {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => isItemVisible(item, currentRole));
};

/**
 * GlobalFooter hook
 * @param {Object} options - Hook options
 * @param {Array} [options.legalLinks] - Legal link definitions
 * @param {Array} [options.quickActions] - Quick action definitions
 * @param {string} [options.currentRole] - Current user role
 * @returns {Object} Footer state helpers
 */
const useGlobalFooter = ({ legalLinks = [], quickActions = [], currentRole } = {}) => {
  const normalizedRole = normalizeRole(currentRole);

  const visibleLegalLinks = useMemo(() => {
    return filterItems(legalLinks, normalizedRole);
  }, [legalLinks, normalizedRole]);

  const visibleQuickActions = useMemo(() => {
    return filterItems(quickActions, normalizedRole);
  }, [quickActions, normalizedRole]);

  return {
    visibleLegalLinks,
    visibleQuickActions,
    hasLegalLinks: visibleLegalLinks.length > 0,
    hasQuickActions: visibleQuickActions.length > 0,
  };
};

export default useGlobalFooter;
