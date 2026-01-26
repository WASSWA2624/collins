/**
 * SettingsScreen - Web
 * Main settings screen displaying tabs for all settings sub-screens
 * File: SettingsScreen.web.jsx
 *
 * Per platform-ui.mdc: Platform-specific implementations for cross-platform compatibility
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useI18n } from '@hooks';
import { Text } from '@platform/components';
import { StyledContainer, StyledContent, StyledTabBar, StyledTabBarContainer } from './SettingsScreen.web.styles';
import useSettingsScreen from './useSettingsScreen';

/**
 * SettingsScreen Web Component
 * Displays a tab-based interface for managing all settings
 */
const SettingsScreenWeb = () => {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedTab, tabs, onTabChange } = useSettingsScreen();

  // Determine which tab is currently active based on pathname
  const getCurrentTabId = useMemo(() => {
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    
    const tabMap = {
      'users': 'user',
      'user-profiles': 'user-profile',
      'roles': 'role',
      'permissions': 'permission',
      'role-permissions': 'role-permission',
      'user-roles': 'user-role',
      'user-sessions': 'user-session',
      'tenants': 'tenant',
      'facilities': 'facility',
      'branches': 'branch',
      'departments': 'department',
      'units': 'unit',
      'rooms': 'room',
      'wards': 'ward',
      'beds': 'bed',
      'addresses': 'address',
      'contacts': 'contact',
      'api-keys': 'api-key',
      'api-key-permissions': 'api-key-permission',
      'user-mfas': 'user-mfa',
      'oauth-accounts': 'oauth-account',
    };
    
    return tabMap[lastPart] || 'tenant';
  }, [pathname]);

  // Define tab items with labels from i18n
  const tabItems = useMemo(() => tabs.map(tab => ({
    id: tab.id,
    label: t(`settings.tabs.${tab.id}`),
    testID: tab.testID,
  })), [tabs, t]);

  const handleTabPress = (tabId) => {
    onTabChange(tabId);
  };

  return (
    <StyledContainer testID="settings-screen" role="main">
      <StyledContent>
        <Text
          variant="h1"
          accessibilityRole="header"
          testID="settings-screen-title"
          style={{ marginBottom: 24 }}
        >
          {t('settings.title')}
        </Text>
        
        <StyledTabBarContainer testID="settings-tabs-container">
          <StyledTabBar>
            {tabItems.map(tab => (
              <div
                key={tab.id}
                onClick={() => handleTabPress(tab.id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: getCurrentTabId === tab.id ? '3px solid #0066cc' : '3px solid transparent',
                  color: getCurrentTabId === tab.id ? '#0066cc' : '#666',
                  fontWeight: getCurrentTabId === tab.id ? '600' : '400',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
                testID={tab.testID}
              >
                {tab.label}
              </div>
            ))}
          </StyledTabBar>
        </StyledTabBarContainer>
      </StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenWeb;
