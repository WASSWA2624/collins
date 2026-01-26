/**
 * useSettingsScreen Hook
 * File: useSettingsScreen.js
 *
 * Manages the Settings main screen logic including tab navigation
 * Per features-domain.mdc: Business logic separated from UI
 */

import { useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { SETTINGS_TABS, SETTINGS_TAB_ORDER } from './types';

/**
 * useSettingsScreen hook
 * Manages Settings screen tab state and navigation
 * 
 * @returns {Object} Settings screen state and handlers
 */
const useSettingsScreen = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract current tab from pathname
  // E.g., /settings/users -> 'user'
  const getCurrentTab = useCallback(() => {
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    
    // Map route names to tab names
    const tabMap = {
      'users': SETTINGS_TABS.USER,
      'user-profiles': SETTINGS_TABS.USER_PROFILE,
      'roles': SETTINGS_TABS.ROLE,
      'permissions': SETTINGS_TABS.PERMISSION,
      'role-permissions': SETTINGS_TABS.ROLE_PERMISSION,
      'user-roles': SETTINGS_TABS.USER_ROLE,
      'user-sessions': SETTINGS_TABS.USER_SESSION,
      'tenants': SETTINGS_TABS.TENANT,
      'facilities': SETTINGS_TABS.FACILITY,
      'branches': SETTINGS_TABS.BRANCH,
      'departments': SETTINGS_TABS.DEPARTMENT,
      'units': SETTINGS_TABS.UNIT,
      'rooms': SETTINGS_TABS.ROOM,
      'wards': SETTINGS_TABS.WARD,
      'beds': SETTINGS_TABS.BED,
      'addresses': SETTINGS_TABS.ADDRESS,
      'contacts': SETTINGS_TABS.CONTACT,
      'api-keys': SETTINGS_TABS.API_KEY,
      'api-key-permissions': SETTINGS_TABS.API_KEY_PERMISSION,
      'user-mfas': SETTINGS_TABS.USER_MFA,
      'oauth-accounts': SETTINGS_TABS.OAUTH_ACCOUNT,
    };
    
    return tabMap[lastPart] || SETTINGS_TABS.TENANT;
  }, [pathname]);

  const [selectedTab, setSelectedTab] = useState(getCurrentTab());

  const tabs = useMemo(() => SETTINGS_TAB_ORDER.map(tabKey => ({
    id: tabKey,
    label: `settings.tabs.${tabKey}`,
    testID: `settings-tab-${tabKey}`,
  })), []);

  const handleTabChange = useCallback((tabId) => {
    setSelectedTab(tabId);
    
    // Map tab to route path
    const routeMap = {
      [SETTINGS_TABS.USER]: '/settings/users',
      [SETTINGS_TABS.USER_PROFILE]: '/settings/user-profiles',
      [SETTINGS_TABS.ROLE]: '/settings/roles',
      [SETTINGS_TABS.PERMISSION]: '/settings/permissions',
      [SETTINGS_TABS.ROLE_PERMISSION]: '/settings/role-permissions',
      [SETTINGS_TABS.USER_ROLE]: '/settings/user-roles',
      [SETTINGS_TABS.USER_SESSION]: '/settings/user-sessions',
      [SETTINGS_TABS.TENANT]: '/settings/tenants',
      [SETTINGS_TABS.FACILITY]: '/settings/facilities',
      [SETTINGS_TABS.BRANCH]: '/settings/branches',
      [SETTINGS_TABS.DEPARTMENT]: '/settings/departments',
      [SETTINGS_TABS.UNIT]: '/settings/units',
      [SETTINGS_TABS.ROOM]: '/settings/rooms',
      [SETTINGS_TABS.WARD]: '/settings/wards',
      [SETTINGS_TABS.BED]: '/settings/beds',
      [SETTINGS_TABS.ADDRESS]: '/settings/addresses',
      [SETTINGS_TABS.CONTACT]: '/settings/contacts',
      [SETTINGS_TABS.API_KEY]: '/settings/api-keys',
      [SETTINGS_TABS.API_KEY_PERMISSION]: '/settings/api-key-permissions',
      [SETTINGS_TABS.USER_MFA]: '/settings/user-mfas',
      [SETTINGS_TABS.OAUTH_ACCOUNT]: '/settings/oauth-accounts',
    };
    
    const route = routeMap[tabId];
    if (route) {
      router.push(route);
    }
  }, [router]);

  return {
    selectedTab,
    tabs,
    onTabChange: handleTabChange,
    testID: 'settings-screen',
    accessibilityLabel: 'settings.screen.label',
  };
};

export default useSettingsScreen;
