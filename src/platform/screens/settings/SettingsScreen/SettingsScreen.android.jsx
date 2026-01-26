/**
 * SettingsScreen - Android
 * Main settings screen displaying tabs for all settings sub-screens
 * File: SettingsScreen.android.jsx
 *
 * Android implementation using Material Design tabs and interactions
 */

import React, { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useI18n } from '@hooks';
import { Text } from '@platform/components';
import { StyledContainer, StyledContent, StyledTabBarContainer } from './SettingsScreen.android.styles';
import useSettingsScreen from './useSettingsScreen';

/**
 * SettingsScreen Android Component
 */
const SettingsScreenAndroid = () => {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedTab, tabs, onTabChange } = useSettingsScreen();

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

  const tabItems = useMemo(() => tabs.map(tab => ({
    id: tab.id,
    label: t(`settings.tabs.${tab.id}`),
    testID: tab.testID,
  })), [tabs, t]);

  const handleTabPress = (tabId) => {
    onTabChange(tabId);
  };

  return (
    <StyledContainer testID="settings-screen">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="settings-screen-title"
            style={{ marginBottom: 20 }}
          >
            {t('settings.title')}
          </Text>
          
          <StyledTabBarContainer testID="settings-tabs-container">
            <StyledTabBar>
              {tabItems.map(tab => (
                <View
                  key={tab.id}
                  onPress={() => handleTabPress(tab.id)}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: getCurrentTabId === tab.id ? 3 : 1,
                    borderBottomColor: getCurrentTabId === tab.id ? '#2196F3' : '#ddd',
                  }}
                  testID={tab.testID}
                >
                  <Text
                    style={{
                      color: getCurrentTabId === tab.id ? '#2196F3' : '#666',
                      fontWeight: getCurrentTabId === tab.id ? '600' : '400',
                    }}
                  >
                    {tab.label}
                  </Text>
                </View>
              ))}
            </StyledTabBar>
          </StyledTabBarContainer>
        </StyledContent>
      </ScrollView>
    </StyledContainer>
  );
};

export default SettingsScreenAndroid;
