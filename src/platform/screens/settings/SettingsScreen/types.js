/**
 * Settings Screen Types
 * File: types.js
 * 
 * Type definitions and constants for Settings main screen
 */

export const SETTINGS_TABS = {
  FACILITY: 'facility',
  TENANT: 'tenant',
  BRANCH: 'branch',
  DEPARTMENT: 'department',
  UNIT: 'unit',
  ROOM: 'room',
  WARD: 'ward',
  BED: 'bed',
  ADDRESS: 'address',
  CONTACT: 'contact',
  USER: 'user',
  USER_PROFILE: 'user-profile',
  ROLE: 'role',
  PERMISSION: 'permission',
  ROLE_PERMISSION: 'role-permission',
  USER_ROLE: 'user-role',
  USER_SESSION: 'user-session',
  API_KEY: 'api-key',
  API_KEY_PERMISSION: 'api-key-permission',
  USER_MFA: 'user-mfa',
  OAUTH_ACCOUNT: 'oauth-account',
};

export const SETTINGS_TAB_ORDER = [
  SETTINGS_TABS.FACILITY,
  SETTINGS_TABS.TENANT,
  SETTINGS_TABS.BRANCH,
  SETTINGS_TABS.DEPARTMENT,
  SETTINGS_TABS.UNIT,
  SETTINGS_TABS.ROOM,
  SETTINGS_TABS.WARD,
  SETTINGS_TABS.BED,
  SETTINGS_TABS.ADDRESS,
  SETTINGS_TABS.CONTACT,
  SETTINGS_TABS.USER,
  SETTINGS_TABS.USER_PROFILE,
  SETTINGS_TABS.ROLE,
  SETTINGS_TABS.PERMISSION,
  SETTINGS_TABS.ROLE_PERMISSION,
  SETTINGS_TABS.USER_ROLE,
  SETTINGS_TABS.USER_SESSION,
  SETTINGS_TABS.API_KEY,
  SETTINGS_TABS.API_KEY_PERMISSION,
  SETTINGS_TABS.USER_MFA,
  SETTINGS_TABS.OAUTH_ACCOUNT,
];

export const STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};
