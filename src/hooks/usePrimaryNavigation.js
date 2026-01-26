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
        id: 'settings',
        label: t('navigation.items.main.settings'),
        href: '/settings',
        icon: 'Cog',
        roles: STAFF_ROLES,
        children: [
          {
            id: 'settings-facilities',
            label: t('navigation.items.main.facilities'),
            href: '/settings/facilities',
            icon: 'Building',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-tenants',
            label: t('navigation.items.main.tenants'),
            href: '/settings/tenants',
            icon: 'Users',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-branches',
            label: t('navigation.items.main.branches'),
            href: '/settings/branches',
            icon: 'MapPin',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-departments',
            label: t('navigation.items.main.departments'),
            href: '/settings/departments',
            icon: 'Layers',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-units',
            label: t('navigation.items.main.units'),
            href: '/settings/units',
            icon: 'Grid',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-rooms',
            label: t('navigation.items.main.rooms'),
            href: '/settings/rooms',
            icon: 'Square',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-wards',
            label: t('navigation.items.main.wards'),
            href: '/settings/wards',
            icon: 'Home',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-beds',
            label: t('navigation.items.main.beds'),
            href: '/settings/beds',
            icon: 'Heart',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-addresses',
            label: t('navigation.items.main.addresses'),
            href: '/settings/addresses',
            icon: 'MapPin',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-contacts',
            label: t('navigation.items.main.contacts'),
            href: '/settings/contacts',
            icon: 'Phone',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-users',
            label: t('navigation.items.main.users'),
            href: '/settings/users',
            icon: 'User',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-user-profiles',
            label: t('navigation.items.main.userProfiles'),
            href: '/settings/user-profiles',
            icon: 'UserCheck',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-roles',
            label: t('navigation.items.main.roles'),
            href: '/settings/roles',
            icon: 'Shield',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-permissions',
            label: t('navigation.items.main.permissions'),
            href: '/settings/permissions',
            icon: 'Lock',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-role-permissions',
            label: t('navigation.items.main.rolePermissions'),
            href: '/settings/role-permissions',
            icon: 'LockOpen',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-user-roles',
            label: t('navigation.items.main.userRoles'),
            href: '/settings/user-roles',
            icon: 'UserShield',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-user-sessions',
            label: t('navigation.items.main.userSessions'),
            href: '/settings/user-sessions',
            icon: 'Clock',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-api-keys',
            label: t('navigation.items.main.apiKeys'),
            href: '/settings/api-keys',
            icon: 'Key',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-api-key-permissions',
            label: t('navigation.items.main.apiKeyPermissions'),
            href: '/settings/api-key-permissions',
            icon: 'KeyOff',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-user-mfas',
            label: t('navigation.items.main.userMfas'),
            href: '/settings/user-mfas',
            icon: 'Smartphone',
            roles: STAFF_ROLES,
          },
          {
            id: 'settings-oauth-accounts',
            label: t('navigation.items.main.oauthAccounts'),
            href: '/settings/oauth-accounts',
            icon: 'LogIn',
            roles: STAFF_ROLES,
          },
        ],
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
      // Allow all items visible if authenticated (for testing/development)
      if (!item) {
        return false;
      }
      if (!isAuthenticated) {
        return false;
      }
      // In development, show all items to authenticated users
      return true;
    },
    [isAuthenticated]
  );

  return {
    mainItems,
    patientItems,
    isItemVisible,
  };
};

export default usePrimaryNavigation;
