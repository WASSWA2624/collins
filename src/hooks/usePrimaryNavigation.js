/**
 * usePrimaryNavigation Hook
 * Builds primary navigation items for main and patient shells.
 * File: usePrimaryNavigation.js
 */
import { useCallback, useMemo } from 'react';
import useI18n from '@hooks/useI18n';
import useAuth from '@hooks/useAuth';

const normalizeRole = (role) => {
  if (!role) return null;
  return String(role).trim().toLowerCase();
};

const normalizeRoles = (roles) => {
  if (!roles) return [];
  const list = Array.isArray(roles) ? roles : [roles];
  return list.map(normalizeRole).filter(Boolean);
};

const STAFF_ROLES = [
  'admin',
  'hospital-admin',
  'system-admin',
  'super-admin',
  'doctor',
  'specialist',
  'nurse',
  'clinical-officer',
  'intern',
  'laboratory-technician',
  'radiology-technician',
  'pharmacist',
  'pharmacy-assistant',
  'emergency-officer',
  'ambulance-driver',
  'finance',
  'accounts',
  'hr',
  'housekeeping',
  'facility-manager',
];

/**
 * Primary navigation hook
 * @returns {Object} navigation items and visibility helpers
 */
const usePrimaryNavigation = () => {
  const { t } = useI18n();
  const { isAuthenticated, roles } = useAuth();

  const mainItems = useMemo(
    () => [
      {
        id: 'home',
        label: t('navigation.items.main.home'),
        href: '/home',
        icon: 'H',
        roles: STAFF_ROLES,
      },
      {
        id: 'overview',
        label: t('navigation.items.main.overview'),
        href: '/',
        icon: 'O',
        roles: STAFF_ROLES,
      },
      {
        id: 'user-sessions',
        label: t('navigation.items.main.userSessions'),
        href: '/settings/user-sessions',
        icon: 'S',
        roles: STAFF_ROLES,
      },
      {
        id: 'tenants',
        label: t('navigation.items.main.tenants'),
        href: '/settings/tenants',
        icon: 'T',
        roles: STAFF_ROLES,
      },
      {
        id: 'facilities',
        label: t('navigation.items.main.facilities'),
        href: '/settings/facilities',
        icon: 'F',
        roles: STAFF_ROLES,
      },
      {
        id: 'branches',
        label: t('navigation.items.main.branches'),
        href: '/settings/branches',
        icon: 'B',
        roles: STAFF_ROLES,
      },
      {
        id: 'departments',
        label: t('navigation.items.main.departments'),
        href: '/settings/departments',
        icon: 'D',
        roles: STAFF_ROLES,
      },
      {
        id: 'units',
        label: t('navigation.items.main.units'),
        href: '/settings/units',
        icon: 'U',
        roles: STAFF_ROLES,
      },
      {
        id: 'rooms',
        label: t('navigation.items.main.rooms'),
        href: '/settings/rooms',
        icon: 'R',
        roles: STAFF_ROLES,
      },
      {
        id: 'wards',
        label: t('navigation.items.main.wards'),
        href: '/settings/wards',
        icon: 'W',
        roles: STAFF_ROLES,
      },
      {
        id: 'beds',
        label: t('navigation.items.main.beds'),
        href: '/settings/beds',
        icon: 'B',
        roles: STAFF_ROLES,
      },
      {
        id: 'addresses',
        label: t('navigation.items.main.addresses'),
        href: '/settings/addresses',
        icon: 'A',
        roles: STAFF_ROLES,
      },
      {
        id: 'contacts',
        label: t('navigation.items.main.contacts'),
        href: '/settings/contacts',
        icon: 'C',
        roles: STAFF_ROLES,
      },
    ],
    [t]
  );

  const patientItems = useMemo(
    () => [
      {
        id: 'home',
        label: t('navigation.items.patient.home'),
        href: '/',
        icon: 'H',
        roles: ['patient'],
      },
    ],
    [t]
  );

  const isItemVisible = useCallback(
    (item) => {
      if (!item || !item.roles || item.roles.length === 0) {
        return true;
      }
      if (!isAuthenticated) {
        return false;
      }
      const normalizedItemRoles = normalizeRoles(item.roles);
      if (normalizedItemRoles.length === 0) {
        return false;
      }
      return normalizedItemRoles.some((role) => roles.includes(role));
    },
    [isAuthenticated, roles]
  );

  return {
    mainItems,
    patientItems,
    isItemVisible,
  };
};

export default usePrimaryNavigation;
